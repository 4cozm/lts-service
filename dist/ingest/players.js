let cachedSnapshot = null;
/**
 * 플레이어 스냅샷 (현재는 경로 미사용, 빈 배열 반환).
 */
export async function loadPlayersSnapshot() {
    cachedSnapshot = [];
    return { snapshot: [], hash: "", changed: false };
}
export function getCachedPlayersSnapshot() {
    return cachedSnapshot;
}
