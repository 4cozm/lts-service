import { useQuery } from "@tanstack/react-query";

type LogEntry = {
  level: number;
  time: number;
  msg: string;
  levelName: string;
  [key: string]: unknown;
};

async function fetchLogs(): Promise<{ logs: LogEntry[] }> {
  const res = await fetch("/api/dev/logs?limit=200");
  if (!res.ok) throw new Error("로그 조회 실패");
  return res.json();
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function levelClass(levelName: string): string {
  switch (levelName) {
    case "error":
      return "text-red-400 bg-red-500/10 border-red-500/30";
    case "warn":
      return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    default:
      return "text-slate-300 bg-white/5 border-white/10";
  }
}

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

const POLL_INTERVAL_MS = 3000;

export default function LogPopup({ onClose, isOpen }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dev-logs"],
    queryFn: fetchLogs,
    refetchInterval: isOpen ? POLL_INTERVAL_MS : false,
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="glass relative z-10 flex w-full max-w-md flex-col rounded-xl shadow-xl max-h-[70vh]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-sm font-medium text-slate-300">서버 로그</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 font-mono text-xs">
          {isLoading && !data && <p className="text-slate-500 py-2">로딩 중...</p>}
          {error && <p className="text-red-400 py-2">로그를 불러올 수 없습니다.</p>}
          {data?.logs?.length === 0 && !isLoading && (
            <p className="text-slate-500 py-2">로그가 없습니다.</p>
          )}
          {data?.logs?.map((entry, i) => {
            const skip = new Set(["level", "time", "msg", "levelName"]);
            const rest: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(entry)) {
              if (!skip.has(k)) rest[k] = v;
            }
            const hasRest = Object.keys(rest).length > 0;
            return (
              <div
                key={`${entry.time}-${i}`}
                className={`mb-1 rounded border px-2 py-1 ${levelClass(entry.levelName)}`}
              >
                <span className="text-slate-500 mr-2">{formatTime(entry.time)}</span>
                <span className="font-semibold uppercase mr-2">{entry.levelName}</span>
                <span>{entry.msg}</span>
                {hasRest && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-slate-500">추가 필드</summary>
                    <pre className="mt-1 overflow-x-auto text-slate-400">
                      {JSON.stringify(rest, null, 0)}
                    </pre>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
