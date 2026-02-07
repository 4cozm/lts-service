export declare function getCheckpointOffset(): Promise<number>;
export declare function setCheckpointOffset(offset: number): Promise<void>;
export declare function getMatchStreamLastId(): Promise<string>;
export declare function setMatchStreamLastId(lastId: string): Promise<void>;
export declare function getPlayersHash(): Promise<string | null>;
export declare function setPlayersHash(hash: string): Promise<void>;
