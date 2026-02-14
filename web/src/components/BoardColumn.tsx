import { useDroppable } from "@dnd-kit/core";
import BoardCard from "./BoardCard";

type Status = "waiting" | "playing" | "done";

type Entry = {
  id: string;
  nickname: string;
  status: Status;
  createdAt: string;
};

type Props = {
  id: Status;
  title: string;
  entries: Entry[];
};

export default function BoardColumn({ id, title, entries }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`glass p-4 min-h-[280px] rounded-xl transition ${
        isOver ? "ring-2 ring-cyan-500/50" : ""
      }`}
    >
      <h2 className="font-medium text-slate-300 mb-3">{title}</h2>
      <div className="space-y-2">
        {entries.map((entry) => (
          <BoardCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
