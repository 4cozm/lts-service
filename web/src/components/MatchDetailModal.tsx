type MatchRecord = Record<string, unknown> & {
  Id?: string | number;
  Name?: string;
  LaunchTime?: string;
  FinishTime?: string;
  DurationSeconds?: number;
  Teams?: Record<string, { score?: number; Score?: number; players?: unknown[]; Players?: unknown[] }>;
  WinSide?: string;
  winSide?: string;
  Environment?: { GameType?: { Id?: string; Name?: string } };
};

const TEAM_STYLES: Record<string, { border: string; bg: string; title: string }> = {
  Red: { border: "border-red-500/20", bg: "bg-red-500/5", title: "text-red-400/90" },
  Blue: { border: "border-blue-500/20", bg: "bg-blue-500/5", title: "text-blue-400/90" },
  Yellow: { border: "border-yellow-500/20", bg: "bg-yellow-500/5", title: "text-yellow-400/90" },
  Green: { border: "border-green-500/20", bg: "bg-green-500/5", title: "text-green-400/90" },
  Purple: { border: "border-purple-500/20", bg: "bg-purple-500/5", title: "text-purple-400/90" },
};
const DEFAULT_TEAM_STYLE = { border: "border-white/20", bg: "bg-white/5", title: "text-slate-300" };
function getTeamStyle(teamKey: string) {
  return TEAM_STYLES[teamKey] ?? DEFAULT_TEAM_STYLE;
}

/** 어두운 배경에서 가시성 좋은 팀 컬러 */
const TEAM_COLOR: Record<string, string> = {
  Red: "#f87171",
  Blue: "#60a5fa",
  Yellow: "#facc15",
  Green: "#4ade80",
  Purple: "#c084fc",
};
const DEFAULT_TEAM_COLOR = "#94a3b8";
function getTeamColor(teamKey: string): string {
  return TEAM_COLOR[teamKey] ?? DEFAULT_TEAM_COLOR;
}

function kd(kills: number, deaths: number): string {
  if (deaths === 0) return kills > 0 ? kills.toFixed(2) : "0.00";
  return (kills / deaths).toFixed(2);
}

type PlayerStats = {
  Score?: number;
  Deaths?: number;
  Shots?: number;
  ConsecutiveKills?: number;
  MaxConsecutiveKills?: number;
  ConsecutiveDeaths?: number;
  NemesisPlayerId?: number | null;
  Kills?: number;
  Hits?: number;
  TotalDamage?: number;
  FatalHits?: number;
};

type PlayerRecord = Record<string, unknown> & {
  PlayerName?: string;
  DeviceId?: number;
  PreconfiguredDeviceId?: number;
  Statistics?: PlayerStats;
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
  return String(p.PlayerName ?? p.DeviceId ?? "-");
}
function num(v: unknown): number {
  if (v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function pct(shots: number, hits: number): string {
  if (shots <= 0) return "-";
  return `${((hits / shots) * 100).toFixed(1)}%`;
}

type Props = {
  match: MatchRecord | null;
  onClose: () => void;
};

function getTeamEntries(match: MatchRecord): [string, Record<string, unknown>][] {
  const teams = match.Teams;
  if (!teams || typeof teams !== "object") return [];
  return Object.entries(teams).filter(([, t]) => t && typeof t === "object") as [string, Record<string, unknown>][];
}

function getTeamScore(team: Record<string, unknown>): number | undefined {
  const v = team.score ?? team.Score;
  return typeof v === "number" ? v : undefined;
}

function getMatchWinSide(match: MatchRecord): string | null {
  const ws = match.winSide ?? match.WinSide;
  if (typeof ws === "string" && ws) return ws;
  const entries = getTeamEntries(match);
  let maxScore = -1;
  let winner: string | null = null;
  for (const [key, team] of entries) {
    const s = getTeamScore(team);
    if (s != null && s > maxScore) {
      maxScore = s;
      winner = key;
    }
  }
  return winner;
}

export default function MatchDetailModal({ match, onClose }: Props) {
  if (!match) return null;

  const name = (match.Name as string) ?? "-";
  const teamEntries = getTeamEntries(match);
  const winSide = getMatchWinSide(match);
  const durationSec = match.DurationSeconds;
  const durationMin = durationSec != null ? (durationSec / 60).toFixed(1) : null;

  // 모달 너비: 팀 수에 따라 자동 확장
  const teamsWithPlayers = teamEntries.filter(([, team]) => {
    const players = (team.players ?? team.Players) as PlayerRecord[] | undefined;
    return players && players.length > 0;
  });
  const teamCount = teamsWithPlayers.length;
  const modalMaxW = teamCount <= 2 ? "max-w-2xl" : teamCount === 3 ? "max-w-4xl" : "max-w-6xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        className={`glass relative z-10 w-full ${modalMaxW} max-h-[90vh] overflow-y-auto rounded-xl p-6`}
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

        {/* 승리팀 + 팀 스코어 (컬러) */}
        {teamEntries.length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 text-center">
            {winSide != null && (
              <div className="text-sm font-semibold mb-1" style={{ color: getTeamColor(winSide) }}>
                {winSide} 승리
              </div>
            )}
            <div className="flex items-center justify-center gap-1 text-xl font-bold">
              {teamEntries.map(([teamKey, team], i) => (
                <span key={teamKey} className="inline-flex items-center">
                  {i > 0 && <span className="text-slate-500 mx-1.5 text-base font-normal">:</span>}
                  <span style={{ color: getTeamColor(teamKey) }}>{getTeamScore(team) ?? "-"}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 선수 세부: 팀별 테이블 — 팀 수에 따라 자동 열 확장 */}
        {(() => {
          const gridCols =
            teamCount === 1 ? "grid-cols-1"
            : teamCount === 2 ? "grid-cols-1 md:grid-cols-2"
            : teamCount === 3 ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
          return (
            <div className={`mt-4 grid ${gridCols} gap-4`}>
              {teamsWithPlayers.map(([teamKey, team]) => {
                const players = (team.players ?? team.Players) as PlayerRecord[];
                const style = getTeamStyle(teamKey);
                return (
                  <div key={teamKey} className={`rounded-lg border ${style.border} ${style.bg} p-3`}>
                    <h3 className={`${style.title} text-xs font-semibold mb-2`}>{teamKey} ({players.length}명)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-white/10">
                            <th className="text-left py-1 pr-2">닉네임</th>
                            <th className="text-right py-1">K</th>
                            <th className="text-right py-1">D</th>
                            <th className="text-right py-1">명중</th>
                            <th className="text-right py-1">K/D</th>
                            <th className="text-right py-1">피해량</th>
                          </tr>
                        </thead>
                        <tbody>
                          {players.map((p, i) => {
                            const st = p.Statistics;
                            const k = num(st?.Kills);
                            const d = num(st?.Deaths);
                            return (
                              <tr key={i} className="border-b border-white/5">
                                <td className="py-1 pr-2 truncate max-w-[120px]" title={getPlayerDisplayName(p)}>{getPlayerDisplayName(p)}</td>
                                <td className="text-right py-1">{k}</td>
                                <td className="text-right py-1">{d}</td>
                                <td className="text-right py-1">{pct(num(st?.Shots), num(st?.Hits))}</td>
                                <td className="text-right py-1">{kd(k, d)}</td>
                                <td className="text-right py-1">{num(st?.TotalDamage)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

      </div>
    </div>
  );
}
