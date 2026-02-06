import { useState } from "react";
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
  for (const col of COLUMNS) {
    const entry = (data[col.id] ?? []).find((e) => e.id === id);
    if (entry) return entry;
  }
  return null;
}

export default function Board() {
  const [logsOpen, setLogsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["board"], queryFn: fetchBoard });
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

  if (isLoading) return <div className="p-8 text-slate-400">보드 로딩 중...</div>;
  if (error) return <div className="p-8 text-red-400">보드 조회 실패 (localhost에서만 접속 가능)</div>;
  if (!data) return null;

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
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              id={col.id}
              title={col.title}
              entries={data[col.id] ?? []}
            />
          ))}
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
