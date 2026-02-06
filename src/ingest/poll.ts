import { createReadStream, existsSync, statSync } from "fs";
import { createInterface } from "readline";
import { config } from "../config.js";
import { getRedis } from "../redis.js";
import { getCheckpointOffset, setCheckpointOffset } from "./checkpoint.js";
import { parseMatchLine, type MatchLine } from "./matchSchema.js";
import { loadPlayersSnapshot } from "./players.js";

const MATCHES_KEY_PREFIX = "match:";
const MATCH_IDS_SET = "match:ids";

async function processNewMatches(
  matches: MatchLine[],
  log: { info: (o: unknown) => void }
): Promise<void> {
  if (matches.length === 0) return;
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
async function onMatchFileChanged(log: { info: (o: unknown) => void }): Promise<void> {
  const { snapshot, changed } = await loadPlayersSnapshot();
  if (changed && snapshot.length > 0) {
    const redis = getRedis();
    await redis.set("players:snapshot", JSON.stringify(snapshot));
    log.info({ playersCount: snapshot.length, message: "players snapshot updated" });
  }
}

export function startIngestPoll(log: { info: (o: unknown) => void; warn: (o: unknown) => void }): void {
  const path = config.MATCH_RESULTS_PATH;
  const intervalMs = config.POLL_INTERVAL_MS;
  let lastSize = 0;

  const DEBUG_ENDPOINT = "http://127.0.0.1:7242/ingest/f5f9e2b5-6e29-44c2-98b6-e53c33291b35";
  async function tick(): Promise<void> {
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "poll.ts:tick", message: "tick started", data: {}, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H3" }) }).catch(() => {});
    // #endregion
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
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "poll.ts:before getCheckpointOffset", message: "calling getCheckpointOffset", data: { size }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H3" }) }).catch(() => {});
    // #endregion
    const offset = await getCheckpointOffset();
    if (size > offset) {
      const newMatches: MatchLine[] = [];
      let nextOffset = offset;
      await new Promise<void>((resolve, reject) => {
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
    } else if (size !== lastSize) {
      await onMatchFileChanged(log);
      lastSize = size;
    }
  }

  setInterval(async () => {
    try {
      await tick();
    } catch (e) {
      // #region agent log
      fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "poll.ts:tick catch", message: "tick error", data: { err: String(e), stack: (e as Error)?.stack }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H3" }) }).catch(() => {});
      // #endregion
      log.warn({ err: e });
    }
  }, intervalMs);
  log.info({ path, intervalMs, message: "ingest poll started" });
}
