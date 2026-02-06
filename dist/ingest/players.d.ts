export type PlayerSnapshot = Array<{
    playerId?: number;
    nickname?: string;
    displayName?: string;
    [k: string]: unknown;
}>;
/**
 * Match 파일이 변한 뒤에만 호출. players.json을 읽어 보조 매핑용 스냅샷 반환.
 * 동일 해시면 Redis에 저장된 이전 해시와 비교해 업로드 스킵 가능.
 */
export declare function loadPlayersSnapshot(): Promise<{
    snapshot: PlayerSnapshot;
    hash: string;
    changed: boolean;
}>;
export declare function getCachedPlayersSnapshot(): PlayerSnapshot | null;
