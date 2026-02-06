import { createReadStream, existsSync, statSync } from "fs";
import { createInterface } from "readline";
import { config } from "../config.js";
import { getRedis } from "../redis.js";
import { getCheckpointOffset, setCheckpointOffset } from "./checkpoint.js";
import { parseMatchLine } from "./matchSchema.js";
import { loadPlayersSnapshot } from "./players.js";
const MATCHES_KEY_PREFIX = "match:";
const MATCH_IDS_SET = "match:ids";
async function processNewMatches(matches, log) {
    if (matches.length === 0)
        return;
    const redis = getRedis();
    const pipeline = redis.pipeline();
    for (const m of matches) {
        const id = String(m.Id);
        pipeline.sadd(MATCH_IDS_SET, id);
        pipeline.set(`${MATCHES_KEY_PREFIX}${id}`, JSON.stringify(m), "NX");
    }
    await pipeline.exec();
    log.info({ count: matches.length, ids: matches.map((m) => m.Id) });
}
/**
 * Match 파일이 변했을 때만 players 로드 후 보조 매핑용으로 사용.
 * (현재 뼈대에서는 Redis에 players 스냅샷 저장만 하고, 인덱싱 시 참조 가능하게 함)
 */
async function onMatchFileChanged(log) {
    const { snapshot, changed } = await loadPlayersSnapshot();
    if (changed && snapshot.length > 0) {
        const redis = getRedis();
        await redis.set("players:snapshot", JSON.stringify(snapshot));
        log.info({ playersCount: snapshot.length, message: "players snapshot updated" });
    }
}
export function startIngestPoll(log) {
    const path = config.MATCH_RESULTS_PATH;
    const intervalMs = config.POLL_INTERVAL_MS;
    let lastSize = 0;
    async function tick() {
        if (!existsSync(path)) {
            lastSize = 0;
            return;
        }
        const stat = statSync(path);
        const size = stat.size;
        if (size === 0) {
            lastSize = 0;
            return;
        }
        const offset = await getCheckpointOffset();
        if (size > offset) {
            const newMatches = [];
            let nextOffset = offset;
            await new Promise((resolve, reject) => {
                const stream = createReadStream(path, { start: offset });
                const rl = createInterface({ input: stream, crlfDelay: Infinity });
                rl.on("line", (line) => {
                    nextOffset += Buffer.byteLength(line, "utf-8") + 1;
                    const parsed = parseMatchLine(line);
                    if (parsed?.FinishTime) {
                        newMatches.push(parsed);
                    }
                });
                rl.on("close", () => resolve());
                rl.on("error", reject);
            });
            await processNewMatches(newMatches, log);
            await setCheckpointOffset(nextOffset);
            await onMatchFileChanged(log);
            lastSize = size;
        }
        else if (size !== lastSize) {
            await onMatchFileChanged(log);
            lastSize = size;
        }
    }
    setInterval(async () => {
        try {
            await tick();
        }
        catch (e) {
            log.warn({ err: e });
        }
    }, intervalMs);
    log.info({ path, intervalMs, message: "ingest poll started" });
}
