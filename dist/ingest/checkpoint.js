import { getRedis } from "../redis.js";
const KEY = "checkpoint:matchesOffset";
const PLAYERS_HASH_KEY = "checkpoint:playersHash";
const MATCH_STREAM_LAST_ID_KEY = "checkpoint:matchStreamLastId";
export async function getCheckpointOffset() {
    const redis = getRedis();
    const v = await redis.get(KEY);
    return v ? parseInt(v, 10) : 0;
}
export async function setCheckpointOffset(offset) {
    const redis = getRedis();
    await redis.set(KEY, String(offset));
}
export async function getMatchStreamLastId() {
    const redis = getRedis();
    const v = await redis.get(MATCH_STREAM_LAST_ID_KEY);
    return v ?? "0";
}
export async function setMatchStreamLastId(lastId) {
    const redis = getRedis();
    await redis.set(MATCH_STREAM_LAST_ID_KEY, lastId);
}
export async function getPlayersHash() {
    const redis = getRedis();
    return redis.get(PLAYERS_HASH_KEY);
}
export async function setPlayersHash(hash) {
    const redis = getRedis();
    await redis.set(PLAYERS_HASH_KEY, hash);
}
