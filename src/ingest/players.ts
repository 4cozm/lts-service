import { readFileSync, existsSync } from "fs";
import { createHash } from "crypto";
import { config } from "../config.js";
import { getPlayersHash, setPlayersHash } from "./checkpoint.js";

export type PlayerSnapshot = Array<{
  playerId?: number;
  nickname?: string;
  displayName?: string;
  [k: string]: unknown;
}>;

let cachedSnapshot: PlayerSnapshot | null = null;
let cachedHash: string | null = null;

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Match 파일이 변한 뒤에만 호출. players.json을 읽어 보조 매핑용 스냅샷 반환.
 * 동일 해시면 Redis에 저장된 이전 해시와 비교해 업로드 스킵 가능.
 */
export async function loadPlayersSnapshot(): Promise<{
  snapshot: PlayerSnapshot;
  hash: string;
  changed: boolean;
}> {
  const path = config.PLAYERS_PATH;
  if (!existsSync(path)) {
    return { snapshot: [], hash: "", changed: false };
  }
  const raw = readFileSync(path, "utf-8");
  const hash = hashContent(raw);
  const prevHash = await getPlayersHash();
  const changed = prevHash !== hash;
  if (changed) {
    await setPlayersHash(hash);
  }
  let snapshot: PlayerSnapshot = [];
  try {
    const data = JSON.parse(raw);
    snapshot = Array.isArray(data) ? data : (data.players ?? data.list ?? []);
  } catch {
    snapshot = [];
  }
  cachedSnapshot = snapshot;
  cachedHash = hash;
  return { snapshot, hash, changed };
}

export function getCachedPlayersSnapshot(): PlayerSnapshot | null {
  return cachedSnapshot;
}
