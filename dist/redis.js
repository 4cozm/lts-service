import { Redis } from "ioredis";
import { config } from "./config.js";
const RECONNECT_INTERVAL_MS = 10_000;
let client = null;
export function getRedis() {
    if (!client) {
        client = new Redis(config.REDIS_URL, {
            maxRetriesPerRequest: null,
            retryStrategy(times) {
                return RECONNECT_INTERVAL_MS;
            },
        });
    }
    return client;
}
export async function closeRedis() {
    if (client) {
        await client.quit();
        client = null;
    }
}
