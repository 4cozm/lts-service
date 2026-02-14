import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BoardColumn from "../components/BoardColumn";
import LogPopup from "../components/LogPopup";
import MatchDetailModal from "../components/MatchDetailModal";

type MatchRecord = Record<string, unknown> & {
  Id?: string | number;
  Name?: string;
  FinishTime?: string;
  Teams?: Record<string, { score?: number; Score?: number }>;
  WinSide?: string;
  winSide?: string;
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

function getMatchWinSide(match: MatchRecord): string | null {
  // 새 포맷: 최상위 WinSide / winSide
  const ws = match.winSide ?? match.WinSide;
  if (typeof ws === "string" && ws) return ws;
  // 하위 호환: Result.winSide
  const result = match.Result as Record<string, unknown> | undefined;
  const rws = result?.winSide ?? result?.WinSide;
  if (typeof rws === "string" && rws) return rws as string;
  // fallback: 가장 높은 팀 스코어
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

type Status = "waiting" | "playing" | "done";

type BoardEntry = {
  id: string;
  nickname: string;
  status: Status;
  createdAt: string;
};

type BoardData = {
  waiting: BoardEntry[];
  playing: BoardEntry[];
  done: BoardEntry[];
};

async function fetchBoard(): Promise<BoardData> {
  const res = await fetch("/api/board");
  if (!res.ok) throw new Error("보드 조회 실패");
  return res.json();
}

async function moveEntry(id: string, status: Status): Promise<BoardEntry> {
  const res = await fetch(`/api/board/entries/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("이동 실패");
  return res.json();
}

const COLUMNS: { id: Status; title: string }[] = [
  { id: "waiting", title: "대기중" },
  { id: "playing", title: "게임중" },
  { id: "done", title: "게임 종료" },
];

function findEntry(data: BoardData, id: string): BoardEntry | null {
  const idStr = String(id);
  for (const col of COLUMNS) {
    const entry = (data[col.id] ?? []).find((e) => String(e.id) === idStr);
    if (entry) return entry;
  }
  return null;
}

async function fetchBoardMatches(): Promise<{ matches: MatchRecord[] }> {
  const res = await fetch("/api/board/matches");
  if (!res.ok) throw new Error("경기 목록 조회 실패");
  return res.json();
}

/** 12시간 형식, 초 제외 (예: 오후 7시 43분) */
function formatFinishTime(s: string | undefined): string {
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

export default function Board() {
  const [logsOpen, setLogsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detailMatch, setDetailMatch] = useState<MatchRecord | null>(null);
  const [selectedMatchIds, setSelectedMatchIds] = useState<Set<string>>(new Set());
  const [publishStatus, setPublishStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["board"], queryFn: fetchBoard });
  const {
    data: matchesData,
    isLoading: matchesLoading,
    isFetching: matchesFetching,
    refetch: refetchMatches,
  } = useQuery({
    queryKey: ["board-matches"],
    queryFn: fetchBoardMatches,
    refetchInterval: 5000,
  });
  const toggleMatchSelection = useCallback((id: string) => {
    setSelectedMatchIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) => moveEntry(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board"] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const status = over.id as Status;
    if (!COLUMNS.some((c) => c.id === status)) return;
    const id = active.id as string;
    mutation.mutate({ id, status });
  }

  const activeEntry = data && activeId ? findEntry(data, activeId) : null;

  if (error) return <div className="p-8 text-red-400">보드 조회 실패 (localhost에서만 접속 가능)</div>;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">운영 보드</h1>
        <p className="text-slate-400 text-sm mt-1">localhost 전용, 무인증 · 드래그하여 상태 이동 · 당일(KST)까지 유지</p>
      </header>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading || !data ? (
            <div className="col-span-full p-8 text-slate-400">보드 로딩 중...</div>
          ) : (
            COLUMNS.map((col) => (
              <BoardColumn
                key={col.id}
                id={col.id}
                title={col.title}
                entries={data[col.id] ?? []}
              />
            ))
          )}
        </div>
        <DragOverlay dropAnimation={null} style={{ zIndex: 1000 }}>
          {activeEntry ? (
            <div className="p-3 rounded-lg bg-white/10 border border-cyan-500/40 cursor-grabbing shadow-lg">
              <span className="font-medium">{activeEntry.nickname}</span>
              <span className="text-slate-500 text-xs ml-2">#{activeEntry.id.slice(0, 8)}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <section className="mt-8 glass rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-semibold">경기 기록</h2>
            <p className="text-slate-400 text-xs mt-0.5">한국시간(KST) 기준 당일 종료된 경기만 표시됩니다.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={matchesFetching}
              onClick={() => refetchMatches()}
              className="btn-primary py-2 px-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {matchesFetching ? "새로고침 중…" : "새로고침"}
            </button>
            <button
              type="button"
              disabled={selectedMatchIds.size === 0 || publishStatus === "loading"}
              className="rounded-lg px-3 py-2 text-sm font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => {
                if (selectedMatchIds.size === 0) return;
                setPublishStatus("loading");
                try {
                  const res = await fetch("/api/board/publish", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ matchIds: Array.from(selectedMatchIds) }),
                  });
                  if (!res.ok) throw new Error(await res.text());
                  setPublishStatus("ok");
                  setTimeout(() => setPublishStatus("idle"), 2000);
                } catch {
                  setPublishStatus("error");
                  setTimeout(() => setPublishStatus("idle"), 3000);
                }
              }}
            >
              {publishStatus === "loading" ? "발행 중…" : publishStatus === "ok" ? "발행 완료" : "발행"}
            </button>
            {publishStatus === "error" && (
              <span className="text-red-400 text-xs self-center">발행 실패</span>
            )}
          </div>
        </div>
        <div className="h-64 overflow-y-auto border border-white/10 rounded-lg">
          {matchesLoading ? (
            <div className="p-4 text-slate-500">로딩 중...</div>
          ) : !matchesData?.matches?.length ? (
            <div className="p-4 text-slate-500">당일 경기 기록이 없습니다.</div>
          ) : (
            <div>
              {/* 헤더 */}
              <div
                className="grid items-center gap-2 px-2 py-1.5 text-[11px] text-slate-500 font-medium border-b border-white/10"
                style={{ gridTemplateColumns: "24px 1fr 100px 72px 90px" }}
              >
                <span />
                <span>경기 이름</span>
                <span className="text-center">점수</span>
                <span className="text-center">승리</span>
                <span className="text-right">종료 시간</span>
              </div>
              {/* 행 */}
              <ul className="divide-y divide-white/5">
                {[...matchesData.matches]
                  .sort((a, b) => {
                    const ta = a.FinishTime ? new Date(a.FinishTime as string).getTime() : 0;
                    const tb = b.FinishTime ? new Date(b.FinishTime as string).getTime() : 0;
                    return tb - ta;
                  })
                  .map((match) => {
                    const id = String(match.Id ?? "");
                    const isSelected = selectedMatchIds.has(id);
                    const teamEntries = getTeamEntries(match);
                    const winSide = getMatchWinSide(match);
                    return (
                      <li
                        key={id}
                        className="grid items-center gap-2 px-2 py-2 hover:bg-white/5 cursor-pointer"
                        style={{ gridTemplateColumns: "24px 1fr 100px 72px 90px" }}
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
                          setDetailMatch(match);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMatchSelection(id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded shrink-0"
                        />
                        <span className="truncate text-sm">{String(match.Name ?? "-")}</span>
                        <span className="text-xs text-center flex items-center justify-center gap-0.5">
                          {teamEntries.length > 0 ? teamEntries.map(([key, t], i) => {
                            const s = getTeamScore(t);
                            return (
                              <span key={key} className="inline-flex items-center gap-0.5">
                                {i > 0 && <span className="text-slate-500 mx-0.5">:</span>}
                                <span className="font-semibold" style={{ color: getTeamColor(key) }}>{s ?? "-"}</span>
                              </span>
                            );
                          }) : "-"}
                        </span>
                        <span className="text-xs text-center font-medium truncate">
                          {winSide != null
                            ? <span style={{ color: getTeamColor(winSide) }}>{winSide} 승</span>
                            : "-"}
                        </span>
                        <span className="text-xs text-right text-slate-400">{formatFinishTime(match.FinishTime as string)}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </section>

      <MatchDetailModal match={detailMatch} onClose={() => setDetailMatch(null)} />

      <button
        type="button"
        onClick={() => setLogsOpen(true)}
        className="fixed bottom-4 right-4 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/15"
      >
        Logs
      </button>
      <LogPopup isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
    </div>
  );
}
