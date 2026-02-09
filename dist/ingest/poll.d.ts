import { type MatchLine } from "./matchSchema.js";
export declare function processNewMatches(matches: MatchLine[], log: {
    info: (o: unknown) => void;
}): Promise<void>;
/**
 * Match 소스가 변했을 때 players 스냅샷 갱신 (현재는 빈 스냅샷 반환).
 */
export declare function onMatchFileChanged(log: {
    info: (o: unknown) => void;
}): Promise<void>;
