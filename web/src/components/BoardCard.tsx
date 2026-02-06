import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Entry = {
  id: string;
  nickname: string;
  status: string;
  createdAt: string;
};

export default function BoardCard({ entry }: { entry: Entry }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entry.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-0" : ""
      }`}
    >
      <span className="font-medium">{entry.nickname}</span>
      <span className="text-slate-500 text-xs ml-2">#{entry.id.slice(0, 8)}</span>
    </div>
  );
}
