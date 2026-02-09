export type PlayerSnapshot = Array<{
    playerId?: number;
    nickname?: string;
    displayName?: string;
    [k: string]: unknown;
}>;
/**
 * 플레이어 스냅샷 (현재는 경로 미사용, 빈 배열 반환).
 */
export declare function loadPlayersSnapshot(): Promise<{
    snapshot: PlayerSnapshot;
    hash: string;
    changed: boolean;
}>;
export declare function getCachedPlayersSnapshot(): PlayerSnapshot | null;
