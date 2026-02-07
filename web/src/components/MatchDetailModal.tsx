type MatchRecord = Record<string, unknown> & {
  Id?: string | number;
  Name?: string;
  LaunchTime?: string;
  FinishTime?: string;
  DurationSeconds?: number;
  Teams?: {
    Red?: { teamId?: unknown; score?: number; players?: unknown[] };
    Blue?: { teamId?: unknown; score?: number; players?: unknown[] };
  };
  Result?: { winTeamId?: unknown; winSide?: string; resultType?: string };
  FirstBlood?: { killer?: unknown; victim?: unknown };
};

function formatTime(s: string | undefined): string {
  if (!s) return "-";
  try {
    const d = new Date(s);
    return d.toLocaleString("ko-KR", { hour12: false });
  } catch {
    return String(s);
  }
}

type Props = {
  match: MatchRecord | null;
  onClose: () => void;
};

export default function MatchDetailModal({ match, onClose }: Props) {
  if (!match) return null;

  const id = match.Id != null ? String(match.Id) : "-";
  const name = (match.Name as string) ?? "-";
  const red = match.Teams?.Red;
  const blue = match.Teams?.Blue;
  const result = match.Result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className="glass relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">경기 상세</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">ID</dt>
            <dd className="font-mono">{id}</dd>
          </div>
          <div>
            <dt className="text-slate-500">이름</dt>
            <dd>{name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">시작</dt>
            <dd>{formatTime(match.LaunchTime as string)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">종료</dt>
            <dd>{formatTime(match.FinishTime as string)}</dd>
          </div>
          {match.DurationSeconds != null && (
            <div>
              <dt className="text-slate-500">경기 시간(초)</dt>
              <dd>{match.DurationSeconds}</dd>
            </div>
          )}

          {(red != null || blue != null) && (
            <div>
              <dt className="text-slate-500 mb-1">팀 스코어</dt>
              <dd className="flex gap-4">
                {red != null && (
                  <span>
                    Red: {red.score ?? "-"}
                    {red.players?.length != null && ` (${red.players.length}명)`}
                  </span>
                )}
                {blue != null && (
                  <span>
                    Blue: {blue.score ?? "-"}
                    {blue.players?.length != null && ` (${blue.players.length}명)`}
                  </span>
                )}
              </dd>
            </div>
          )}

          {result != null && (
            <div>
              <dt className="text-slate-500">결과</dt>
              <dd>
                {result.winSide != null && `승리: ${result.winSide}`}
                {result.resultType != null && ` (${result.resultType})`}
              </dd>
            </div>
          )}

          {match.FirstBlood != null && (
            <div>
              <dt className="text-slate-500">First Blood</dt>
              <dd className="font-mono text-xs">
                {JSON.stringify(match.FirstBlood)}
              </dd>
            </div>
          )}
        </dl>

        {match.Teams?.Red?.players?.length ? (
          <div className="mt-4">
            <h3 className="text-slate-400 text-xs font-medium mb-1">Red 플레이어</h3>
            <ul className="text-xs space-y-0.5">
              {(match.Teams.Red.players as Record<string, unknown>[]).map((p, i) => (
                <li key={i}>
                  {String(p.playerId ?? i)} · K{Number(p.kills) || 0}/D{Number(p.deaths) || 0} · acc {p.accuracy != null ? String(p.accuracy) : "-"}%
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {match.Teams?.Blue?.players?.length ? (
          <div className="mt-2">
            <h3 className="text-slate-400 text-xs font-medium mb-1">Blue 플레이어</h3>
            <ul className="text-xs space-y-0.5">
              {(match.Teams.Blue.players as Record<string, unknown>[]).map((p, i) => (
                <li key={i}>
                  {String(p.playerId ?? i)} · K{Number(p.kills) || 0}/D{Number(p.deaths) || 0} · acc {p.accuracy != null ? String(p.accuracy) : "-"}%
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
