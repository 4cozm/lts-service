import { Redis } from "ioredis";
import { config } from "./config.js";

const RECONNECT_INTERVAL_MS = 10_000;
const DEBUG_ENDPOINT = "http://127.0.0.1:7242/ingest/f5f9e2b5-6e29-44c2-98b6-e53c33291b35";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "redis.ts:getRedis", message: "creating Redis client", data: { url: config.REDIS_URL?.replace(/:[^:@]+@/, ":****@") }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H1" }) }).catch(() => {});
    // #endregion
    client = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: null,
      retryStrategy(times: number): number {
        return RECONNECT_INTERVAL_MS;
      },
    });
    client.on("error", (err: Error) => {
      console.error("[Redis] connection error (will retry every 10s):", (err as NodeJS.ErrnoException)?.code ?? err.message);
      // #region agent log
      fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "redis.ts:client.error", message: "Redis error event", data: { err: String(err), code: (err as NodeJS.ErrnoException)?.code }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H1" }) }).catch(() => {});
      // #endregion
    });
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "redis.ts:getRedis", message: "Redis client created, listener attached", data: {}, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H4" }) }).catch(() => {});
    // #endregion
  }
  return client;
}

export async function closeRedis(): Promise<void> {
  if (client) {
    await client.quit();
    client = null;
  }
}
