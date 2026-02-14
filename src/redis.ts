import { Redis } from "ioredis";
import { config } from "./config.js";

const RECONNECT_INTERVAL_MS = 10_000;
const MAX_RETRIES = 5;
const DEBUG_ENDPOINT = "http://127.0.0.1:7242/ingest/f5f9e2b5-6e29-44c2-98b6-e53c33291b35";

let client: Redis | null = null;
let streamClient: Redis | null = null;

function createRedisClient(): Redis {
  return new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy(times: number): number | null {
      if (times > MAX_RETRIES) {
        console.error("[Redis] connection failed after 5 retries (10s interval). Exiting.");
        process.exit(1);
        return null;
      }
      return RECONNECT_INTERVAL_MS;
    },
  });
}

/** API·보드·등록 등 일반 명령용. XREAD BLOCK와 같은 연결에서 쓰지 말 것. */
export function getRedis(): Redis {
  if (!client) {
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "redis.ts:getRedis", message: "creating Redis client", data: { url: config.REDIS_URL?.replace(/:[^:@]+@/, ":****@") }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H1" }) }).catch(() => {});
    // #endregion
    client = createRedisClient();
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

/** XREAD BLOCK 전용 연결. 블로킹이 API용 getRedis()를 막지 않도록 별도 연결 사용. */
export function getRedisStreamClient(): Redis {
  if (!streamClient) {
    streamClient = createRedisClient();
    streamClient.on("error", (err: Error) => {
      console.error("[Redis Stream] connection error:", (err as NodeJS.ErrnoException)?.code ?? err.message);
    });
  }
  return streamClient;
}

export async function closeRedis(): Promise<void> {
  if (streamClient) {
    await streamClient.quit();
    streamClient = null;
  }
  if (client) {
    await client.quit();
    client = null;
  }
}
