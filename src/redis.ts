import { Redis } from "ioredis";
import { config } from "./config.js";

const RECONNECT_INTERVAL_MS = 10_000;

let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    client = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: null,
      retryStrategy(times: number): number {
        return RECONNECT_INTERVAL_MS;
      },
    });
  }
  return client;
}

export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
  }
}
