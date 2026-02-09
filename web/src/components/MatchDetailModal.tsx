type MatchRecord = Record<string, unknown> & {
  Id?: string | number;
  Name?: string;
  LaunchTime?: string;
  FinishTime?: string;
  DurationSeconds?: number;
  Teams?: {
    Red?: { teamId?: unknown; score?: number; Score?: number; players?: unknown[]; Players?: unknown[] };
    Blue?: { teamId?: unknown; score?: number; Score?: number; players?: unknown[]; Players?: unknown[] };
  };
  Result?: { winTeamId?: unknown; winSide?: string; WinSide?: string; resultType?: string };
  FirstBlood?: { killer?: unknown; victim?: unknown };
};

type PlayerRecord = Record<string, unknown> & {
  PlayerId?: number;
  playerId?: number;
  PlayerName?: string;
  playerName?: string;
  Kills?: number;
  kills?: number;
  Deaths?: number;
  deaths?: number;
  KD?: number;
  kd?: number;
  Score?: number;
  score?: number;
  Shots?: number;
  shots?: number;
  Hits?: number;
  hits?: number;
  Accuracy?: number;
  accuracy?: number;
  DamageDealt?: number;
  damageDealt?: number;
  FatalHits?: number;
  fatalHits?: number;
  MaxConsecutiveKills?: number;
  maxConsecutiveKills?: number;
};

/** 12시간 형식, 초 제외 (예: 오후 7시 43분) */
function formatTimeShort(s: string | undefined): string {
  if (!s) return "-";
  try {
    const d = new Date(s);
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h < 12 ? "오전" : "오후";
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${ampm} ${hour}시 ${m}분`;
  } catch {
    return String(s);
  }
}

function getPlayerDisplayName(p: PlayerRecord): string {
  return String(p.PlayerName ?? p.playerName ?? p.PlayerId ?? p.playerId ?? "-");
}
function num(v: unknown): number {
  if (v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function pct(v: unknown): string {
  const n = num(v);
  return n > 0 ? `${(n * 100).toFixed(1)}%` : "-";
}

type Props = {
  match: MatchRecord | null;
  onClose: () => void;
};

export default function MatchDetailModal({ match, onClose }: Props) {
  if (!match) return null;

  const name = (match.Name as string) ?? "-";
  const red = match.Teams?.Red;
  const blue = match.Teams?.Blue;
  const redScore = red != null ? (red.score ?? (red as Record<string, unknown>).Score as number) : undefined;
  const blueScore = blue != null ? (blue.score ?? (blue as Record<string, unknown>).Score as number) : undefined;
  const winSide =
    redScore != null && blueScore != null
      ? redScore > blueScore
        ? "Red"
        : blueScore > redScore
          ? "Blue"
          : null
      : null;
  const durationSec = match.DurationSeconds;
  const durationMin = durationSec != null ? (durationSec / 60).toFixed(1) : null;

  const redPlayers = (red?.players ?? (red as Record<string, unknown>)?.Players) as PlayerRecord[] | undefined;
  const bluePlayers = (blue?.players ?? (blue as Record<string, unknown>)?.Players) as PlayerRecord[] | undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className="glass relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6"
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

        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-slate-500">이름</dt>
            <dd>{name}</dd>
          </div>
          <div className="flex gap-6">
            <div>
              <dt className="text-slate-500">시작</dt>
              <dd>{formatTimeShort(match.LaunchTime as string)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">종료</dt>
              <dd>{formatTimeShort(match.FinishTime as string)}</dd>
            </div>
            {durationMin != null && (
              <div>
                <dt className="text-slate-500">경기 시간</dt>
                <dd>{durationMin}분</dd>
              </div>
            )}
          </div>
        </dl>

        {/* 팀 스코어: 몇 대 몇, 누가 이겼는지 */}
        {(red != null || blue != null) && (
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-slate-400 text-xs font-medium mb-2">팀 스코어</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-red-400/90">Red {redScore ?? "-"}</span>
              <span className="text-slate-500">:</span>
              <span className="font-medium text-blue-400/90">Blue {blueScore ?? "-"}</span>
              {winSide != null && (
                <span className="text-cyan-400 font-medium ml-1">· {winSide} 승</span>
              )}
            </div>
          </div>
        )}

        {/* 선수 세부: Red / Blue 각각 테이블 */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {redPlayers?.length ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <h3 className="text-red-400/90 text-xs font-semibold mb-2">Red ({redPlayers.length}명)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/10">
                      <th className="text-left py-1 pr-2">닉네임</th>
                      <th className="text-right py-1">K/D</th>
                      <th className="text-right py-1">점수</th>
                      <th className="text-right py-1">명중</th>
                      <th className="text-right py-1">피해</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redPlayers.map((p, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-1 pr-2 truncate max-w-[100px]" title={getPlayerDisplayName(p)}>{getPlayerDisplayName(p)}</td>
                        <td className="text-right py-1">{num(p.Kills ?? p.kills)}/{num(p.Deaths ?? p.deaths)}</td>
                        <td className="text-right py-1">{num(p.Score ?? p.score)}</td>
                        <td className="text-right py-1">{pct(p.Accuracy ?? p.accuracy)}</td>
                        <td className="text-right py-1">{num(p.DamageDealt ?? p.damageDealt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {bluePlayers?.length ? (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <h3 className="text-blue-400/90 text-xs font-semibold mb-2">Blue ({bluePlayers.length}명)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/10">
                      <th className="text-left py-1 pr-2">닉네임</th>
                      <th className="text-right py-1">K/D</th>
                      <th className="text-right py-1">점수</th>
                      <th className="text-right py-1">명중</th>
                      <th className="text-right py-1">피해</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bluePlayers.map((p, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-1 pr-2 truncate max-w-[100px]" title={getPlayerDisplayName(p)}>{getPlayerDisplayName(p)}</td>
                        <td className="text-right py-1">{num(p.Kills ?? p.kills)}/{num(p.Deaths ?? p.deaths)}</td>
                        <td className="text-right py-1">{num(p.Score ?? p.score)}</td>
                        <td className="text-right py-1">{pct(p.Accuracy ?? p.accuracy)}</td>
                        <td className="text-right py-1">{num(p.DamageDealt ?? p.damageDealt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
