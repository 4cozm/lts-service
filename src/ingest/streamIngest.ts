import { config } from "../config.js";
import { getRedisStreamClient } from "../redis.js";
import { getMatchStreamLastId, setMatchStreamLastId } from "./checkpoint.js";
import { parseMatchLine, type MatchLine } from "./matchSchema.js";
import { processNewMatches, onMatchFileChanged } from "./poll.js";

const BLOCK_MS = 5000;

/**
 * Redis Stream에서 경기 엔트리를 블로킹으로 읽고, processNewMatches + onMatchFileChanged 호출.
 * INGEST_STREAM_KEY 스트림의 엔트리 필드 "payload"에 경기 JSON 문자열이 있어야 함.
 */
export function startIngestFromStream(log: {
  info: (o: unknown) => void;
  warn: (o: unknown) => void;
}): void {
  const streamKey = config.INGEST_STREAM_KEY;

  async function run(): Promise<void> {
    let lastId = await getMatchStreamLastId();
    const streamRedis = getRedisStreamClient();

    for (;;) {
      try {
        const result = await streamRedis.xread(
          "BLOCK",
          BLOCK_MS,
          "STREAMS",
          streamKey,
          lastId
        );

        if (result == null) {
          continue;
        }

        const matches: MatchLine[] = [];
        let nextLastId = lastId;

        for (const streamResult of result) {
          const [, entries] = streamResult as [string, [string, string[]][]];
          if (!entries || !Array.isArray(entries)) continue;

          for (const entry of entries) {
            const [id, fields] = entry;
            nextLastId = id;
            const payload = getField(fields, "payload");
            if (!payload) continue;
            const parsed = parseMatchLine(payload);
            if (parsed?.FinishTime) {
              matches.push(parsed);
            }
          }
        }

        if (matches.length > 0) {
          await processNewMatches(matches, log);
        }
        await onMatchFileChanged(log);
        await setMatchStreamLastId(nextLastId);
        lastId = nextLastId;
      } catch (e) {
        log.warn(`경기 수집 스트림 오류: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  run();
  log.info(`경기 수집 스트림 구독 시작 (${streamKey})`);
}

function getField(fields: string[], name: string): string | null {
  for (let i = 0; i < fields.length - 1; i += 2) {
    if (fields[i] === name) return fields[i + 1] ?? null;
  }
  return null;
}
