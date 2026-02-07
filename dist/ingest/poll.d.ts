import { type MatchLine } from "./matchSchema.js";
export declare function processNewMatches(matches: MatchLine[], log: {
    info: (o: unknown) => void;
}): Promise<void>;
/**
 * Match 파일이 변했을 때만 players 로드 후 보조 매핑용으로 사용.
 * (현재 뼈대에서는 Redis에 players 스냅샷 저장만 하고, 인덱싱 시 참조 가능하게 함)
 */
export declare function onMatchFileChanged(log: {
    info: (o: unknown) => void;
}): Promise<void>;
export declare function startIngestPoll(log: {
    info: (o: unknown) => void;
    warn: (o: unknown) => void;
}): void;
