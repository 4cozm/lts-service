import { getRedis } from "../redis.js";
const KEY = "checkpoint:matchesOffset";
const PLAYERS_HASH_KEY = "checkpoint:playersHash";
export async function getCheckpointOffset() {
    const redis = getRedis();
    const v = await redis.get(KEY);
    return v ? parseInt(v, 10) : 0;
}
export async function setCheckpointOffset(offset) {
    const redis = getRedis();
    await redis.set(KEY, String(offset));
}
export async function getPlayersHash() {
    const redis = getRedis();
    return redis.get(PLAYERS_HASH_KEY);
}
export async function setPlayersHash(hash) {
    const redis = getRedis();
    await redis.set(PLAYERS_HASH_KEY, hash);
}
