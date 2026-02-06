import { Redis } from "ioredis";
import { config } from "./config.js";
let client = null;
export function getRedis() {
    if (!client) {
        client = new Redis(config.REDIS_URL, { maxRetriesPerRequest: null });
    }
    return client;
}
export async function closeRedis() {
    if (client) {
        await client.quit();
        client = null;
    }
}
