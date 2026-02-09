export type PlayerSnapshot = Array<{
  playerId?: number;
  nickname?: string;
  displayName?: string;
  [k: string]: unknown;
}>;

let cachedSnapshot: PlayerSnapshot | null = null;

/**
 * 플레이어 스냅샷 (현재는 경로 미사용, 빈 배열 반환).
 */
export async function loadPlayersSnapshot(): Promise<{
  snapshot: PlayerSnapshot;
  hash: string;
  changed: boolean;
}> {
  cachedSnapshot = [];
  return { snapshot: [], hash: "", changed: false };
}

export function getCachedPlayersSnapshot(): PlayerSnapshot | null {
  return cachedSnapshot;
}
