import { config } from "../config.js";
import { getRedis } from "../redis.js";
import { getFirestore } from "../firebase.js";

const MATCH_IDS_SET = "match:ids";
const MATCHES_KEY_PREFIX = "match:";

const DEFAULT_INTERVAL_MS = 10 * 60 * 1000; // 10분
const MATCHES_COLLECTION = "matches";

/**
 * Redis의 경기 목록을 Firestore에 멱등하게 동기화 (doc id = match Id).
 * Firebase 미설정 시 no-op.
 */
export async function syncMatchesToFirebase(log: {
  info: (o: unknown) => void;
  warn: (o: unknown) => void;
}): Promise<{ synced: number; skipped: number }> {
  const db = getFirestore();
  if (!db) {
    return { synced: 0, skipped: 1 };
  }

  const redis = getRedis();
  const ids = await redis.smembers(MATCH_IDS_SET);
  if (ids.length === 0) return { synced: 0, skipped: 0 };

  const keys = ids.map((id) => `${MATCHES_KEY_PREFIX}${id}`);
  const raws = await redis.mget(...keys);

  const col = db.collection(config.FIREBASE_MATCHES_COLLECTION ?? MATCHES_COLLECTION);
  let synced = 0;
  let skipped = 0;

  for (let i = 0; i < ids.length; i++) {
    const raw = raws[i];
    if (!raw || typeof raw !== "string") {
      skipped++;
      continue;
    }
    try {
      const data = JSON.parse(raw) as Record<string, unknown>;
      const id = String(data.Id ?? ids[i]);
      await col.doc(id).set(data, { merge: true });
      synced++;
    } catch (e) {
      log.warn({ err: e, id: ids[i], message: "firebase sync doc failed" });
      skipped++;
    }
  }

  if (synced > 0) {
    log.info({ synced, skipped, message: "firebase matches synced" });
  }
  return { synced, skipped };
}

/**
 * 10분(또는 FIREBASE_SYNC_INTERVAL_MS)마다 Redis → Firestore 동기화 실행.
 * Firebase 미설정 시 아무것도 하지 않음.
 */
export function startFirebaseSyncCron(log: {
  info: (o: unknown) => void;
  warn: (o: unknown) => void;
}): void {
  const db = getFirestore();
  if (!db) {
    log.info({ message: "firebase not configured, sync cron disabled" });
    return;
  }

  const intervalMs = config.FIREBASE_SYNC_INTERVAL_MS ?? DEFAULT_INTERVAL_MS;

  function run(): void {
    syncMatchesToFirebase(log).catch((e) => {
      log.warn({ err: e, message: "firebase sync cron error" });
    });
  }

  run();
  setInterval(run, intervalMs);
  log.info({ intervalMs, message: "firebase sync cron started" });
}
