import { config } from "../config.js";
import { getRedis } from "../redis.js";
import { getMatchStreamLastId, setMatchStreamLastId } from "./checkpoint.js";
import { parseMatchLine } from "./matchSchema.js";
import { processNewMatches, onMatchFileChanged } from "./poll.js";
const BLOCK_MS = 5000;
/**
 * Redis Stream에서 경기 엔트리를 블로킹으로 읽고, processNewMatches + onMatchFileChanged 호출.
 * INGEST_STREAM_KEY 스트림의 엔트리 필드 "payload"에 경기 JSON 문자열이 있어야 함.
 */
export function startIngestFromStream(log) {
    const streamKey = config.INGEST_STREAM_KEY;
    async function run() {
        let lastId = await getMatchStreamLastId();
        const redis = getRedis();
        for (;;) {
            try {
                const result = await redis.xread("BLOCK", BLOCK_MS, "STREAMS", streamKey, lastId);
                if (result == null) {
                    continue;
                }
                const matches = [];
                let nextLastId = lastId;
                for (const streamResult of result) {
                    const [, entries] = streamResult;
                    if (!entries || !Array.isArray(entries))
                        continue;
                    for (const entry of entries) {
                        const [id, fields] = entry;
                        nextLastId = id;
                        const payload = getField(fields, "payload");
                        if (!payload)
                            continue;
                        const parsed = parseMatchLine(payload);
                        if (parsed?.FinishTime) {
                            matches.push(parsed);
                        }
                    }
                }
                if (matches.length > 0) {
                    await processNewMatches(matches, log);
                }
                await onMatchFileChanged(log);
                await setMatchStreamLastId(nextLastId);
                lastId = nextLastId;
            }
            catch (e) {
                log.warn({ err: e });
            }
        }
    }
    run();
    log.info({ streamKey, message: "ingest from Redis Stream started" });
}
function getField(fields, name) {
    for (let i = 0; i < fields.length - 1; i += 2) {
        if (fields[i] === name)
            return fields[i + 1] ?? null;
    }
    return null;
}
