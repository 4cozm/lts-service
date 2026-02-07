import { getRedis } from "../redis.js";

const KEY = "checkpoint:matchesOffset";
const PLAYERS_HASH_KEY = "checkpoint:playersHash";
const MATCH_STREAM_LAST_ID_KEY = "checkpoint:matchStreamLastId";

export async function getCheckpointOffset(): Promise<number> {
  const redis = getRedis();
  const v = await redis.get(KEY);
  return v ? parseInt(v, 10) : 0;
}

export async function setCheckpointOffset(offset: number): Promise<void> {
  const redis = getRedis();
  await redis.set(KEY, String(offset));
}

export async function getMatchStreamLastId(): Promise<string> {
  const redis = getRedis();
  const v = await redis.get(MATCH_STREAM_LAST_ID_KEY);
  return v ?? "0";
}

export async function setMatchStreamLastId(lastId: string): Promise<void> {
  const redis = getRedis();
  await redis.set(MATCH_STREAM_LAST_ID_KEY, lastId);
}

export async function getPlayersHash(): Promise<string | null> {
  const redis = getRedis();
  return redis.get(PLAYERS_HASH_KEY);
}

export async function setPlayersHash(hash: string): Promise<void> {
  const redis = getRedis();
  await redis.set(PLAYERS_HASH_KEY, hash);
}
