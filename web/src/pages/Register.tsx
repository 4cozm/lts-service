import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";

async function registerGuest(nickname: string, token: string) {
  const res = await fetch("/api/register/guest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nickname: nickname.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "등록 실패");
  return data;
}

export default function Register() {
  const { token, logout } = useAuth();
  const [nickname, setNickname] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (nick: string) => registerGuest(nick, token!),
    onSuccess: (data) => {
      setSuccess(`${data.nickname} 등록 완료`);
      setNickname("");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) return;
    mutation.mutate(nickname);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass w-full max-w-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold">닉네임 등록</h1>
          <button
            type="button"
            onClick={logout}
            className="text-slate-400 hover:text-slate-200 text-sm"
          >
            로그아웃
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-4">모바일(세로) 기준 · 고객 닉네임만 입력</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="input-field"
            autoComplete="off"
          />
          {mutation.error && (
            <p className="text-red-400 text-sm">{mutation.error.message}</p>
          )}
          {success && <p className="text-cyan-400 text-sm">{success}</p>}
          <button
            type="submit"
            disabled={mutation.isPending || !nickname.trim()}
            className="btn-primary w-full py-3"
          >
            {mutation.isPending ? "등록 중..." : "등록"}
          </button>
        </form>
        <a
          href="/board"
          className="block text-center text-cyan-400/80 hover:text-cyan-300 text-sm mt-4"
        >
          운영 보드 (localhost)
        </a>
      </div>
    </div>
  );
}
