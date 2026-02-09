import { getRedis } from "../redis.js";
import { parseMatchLine, type MatchLine } from "./matchSchema.js";
import { loadPlayersSnapshot } from "./players.js";

const MATCHES_KEY_PREFIX = "match:";
const MATCH_IDS_SET = "match:ids";

export async function processNewMatches(
  matches: MatchLine[],
  log: { info: (o: unknown) => void }
): Promise<void> {
  if (matches.length === 0) return;
  const redis = getRedis();
  const pipeline = redis.pipeline();
  for (const m of matches) {
    const id = String(m.Id);
    pipeline.sadd(MATCH_IDS_SET, id);
    pipeline.set(`${MATCHES_KEY_PREFIX}${id}`, JSON.stringify(m));
  }
  await pipeline.exec();
  log.info({ count: matches.length, ids: matches.map((m) => m.Id) });
}

/**
 * Match 소스가 변했을 때 players 스냅샷 갱신 (현재는 빈 스냅샷 반환).
 */
export async function onMatchFileChanged(log: { info: (o: unknown) => void }): Promise<void> {
  const { snapshot, changed } = await loadPlayersSnapshot();
  if (changed && snapshot.length > 0) {
    const redis = getRedis();
    await redis.set("players:snapshot", JSON.stringify(snapshot));
    log.info({ playersCount: snapshot.length, message: "players snapshot updated" });
  }
}
