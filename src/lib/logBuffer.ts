import { Writable } from "stream";

const MAX_LOGS = 500;
const DEFAULT_LIMIT = 200;

export type LogEntry = {
  level: number;
  time: number;
  msg: string;
  [key: string]: unknown;
};

const buffer: LogEntry[] = [];
let remainder = "";

function levelName(level: number): string {
  if (level >= 60) return "error";
  if (level >= 50) return "warn";
  if (level >= 40) return "info";
  if (level >= 30) return "debug";
  return "trace";
}

function parseLine(line: string): LogEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    const raw = JSON.parse(trimmed) as Record<string, unknown>;
    const entry: LogEntry = {
      level: typeof raw.level === "number" ? raw.level : 30,
      time: typeof raw.time === "number" ? raw.time : Date.now(),
      msg: typeof raw.msg === "string" ? raw.msg : "",
    };
    for (const [k, v] of Object.entries(raw)) {
      if (k !== "level" && k !== "time" && k !== "msg") (entry as Record<string, unknown>)[k] = v;
    }
    return entry;
  } catch {
    return null;
  }
}

export const logBufferStream = new Writable({
  write(chunk: Buffer | string, _enc: string, cb: (error?: Error | null) => void) {
    const str = remainder + chunk.toString("utf-8");
    const lines = str.split("\n");
    remainder = lines.pop() ?? "";
    for (const line of lines) {
      const entry = parseLine(line);
      if (entry) {
        buffer.push(entry);
        if (buffer.length > MAX_LOGS) buffer.shift();
      }
    }
    cb();
  },
});

export function getRecentLogs(limit = DEFAULT_LIMIT): LogEntry[] {
  const n = Math.min(limit, buffer.length);
  const out = buffer.slice(-n).map((e) => ({
    ...e,
    levelName: levelName(e.level),
  }));
  return out.reverse();
}
