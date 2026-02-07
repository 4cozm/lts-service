/**
 * Redis Stream에서 경기 엔트리를 블로킹으로 읽고, processNewMatches + onMatchFileChanged 호출.
 * INGEST_STREAM_KEY 스트림의 엔트리 필드 "payload"에 경기 JSON 문자열이 있어야 함.
 */
export declare function startIngestFromStream(log: {
    info: (o: unknown) => void;
    warn: (o: unknown) => void;
}): void;
