import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";

type Mode = "guest" | "member-login" | "member-signup";

const API_HEADERS = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

async function registerGuest(nickname: string, token: string) {
  const res = await fetch("/api/register/guest", {
    method: "POST",
    headers: API_HEADERS(token),
    body: JSON.stringify({ nickname: nickname.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "등록 실패");
  return data;
}

async function registerMemberLogin(phone: string, code: string, token: string) {
  const res = await fetch("/api/register/member-login", {
    method: "POST",
    headers: API_HEADERS(token),
    body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "등록 실패");
  return data;
}

async function registerMember(phone: string, code: string, nickname: string, token: string) {
  const res = await fetch("/api/register/member", {
    method: "POST",
    headers: API_HEADERS(token),
    body: JSON.stringify({
      phone: phone.trim(),
      code: code.trim(),
      nickname: nickname.trim(),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "등록 실패");
  return data;
}

const SUCCESS_MSG = "등록 완료(대기열 들어감)";

export default function Register() {
  const { token, logout } = useAuth();
  const [mode, setMode] = useState<Mode>("guest");
  const [success, setSuccess] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nicknameSignup, setNicknameSignup] = useState("");

  const guestMutation = useMutation({
    mutationFn: (nick: string) => registerGuest(nick, token!),
    onSuccess: () => {
      setSuccess(SUCCESS_MSG);
      setNickname("");
    },
  });

  const memberLoginMutation = useMutation({
    mutationFn: ({ phone: p, code: c }: { phone: string; code: string }) =>
      registerMemberLogin(p, c, token!),
    onSuccess: () => {
      setSuccess(SUCCESS_MSG);
      setPhone("");
      setCode("");
    },
  });

  const memberSignupMutation = useMutation({
    mutationFn: ({
      phone: p,
      code: c,
      nickname: n,
    }: {
      phone: string;
      code: string;
      nickname: string;
    }) => registerMember(p, c, n, token!),
    onSuccess: () => {
      setSuccess(SUCCESS_MSG);
      setPhone("");
      setCode("");
      setNicknameSignup("");
    },
  });

  const error =
    guestMutation.error?.message ||
    memberLoginMutation.error?.message ||
    memberSignupMutation.error?.message;
  const pending =
    guestMutation.isPending || memberLoginMutation.isPending || memberSignupMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="glass w-full max-w-sm p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">입장 등록</h1>
          <button
            type="button"
            onClick={logout}
            className="text-slate-400 hover:text-slate-200 text-sm"
          >
            로그아웃
          </button>
        </div>

        <div className="flex gap-1 mb-6 p-1 rounded-lg bg-white/5">
          <button
            type="button"
            onClick={() => setMode("guest")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === "guest" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            비회원
          </button>
          <button
            type="button"
            onClick={() => setMode("member-login")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === "member-login"
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            회원 로그인
          </button>
          <button
            type="button"
            onClick={() => setMode("member-signup")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === "member-signup"
                ? "bg-cyan-500/20 text-cyan-300"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            회원가입
          </button>
        </div>

        {mode === "guest" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (nickname.trim()) guestMutation.mutate(nickname);
            }}
            className="space-y-4"
          >
            <p className="text-slate-400 text-sm">닉네임만 입력</p>
            <p className="text-slate-500 text-xs">7일 후 자동 삭제 · 영어만 가능</p>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={pending || !nickname.trim()}
              className="btn-primary w-full py-3"
            >
              {pending ? "등록 중..." : "등록"}
            </button>
          </form>
        )}

        {mode === "member-login" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.trim() && code.trim()) memberLoginMutation.mutate({ phone, code });
            }}
            className="space-y-4"
          >
            <p className="text-slate-400 text-sm">전화번호 + 4자리 인증번호 (OTP 스켈레톤)</p>
            <input
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              autoComplete="tel"
            />
            <input
              type="text"
              placeholder="4자리 인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input-field"
              autoComplete="one-time-code"
              maxLength={4}
            />
            <button
              type="submit"
              disabled={pending || !phone.trim() || !code.trim()}
              className="btn-primary w-full py-3"
            >
              {pending ? "등록 중..." : "등록"}
            </button>
          </form>
        )}

        {mode === "member-signup" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.trim() && code.trim() && nicknameSignup.trim())
                memberSignupMutation.mutate({
                  phone,
                  code,
                  nickname: nicknameSignup,
                });
            }}
            className="space-y-4"
          >
            <p className="text-slate-400 text-sm">전화번호 + OTP + 닉네임 (OTP 스켈레톤)</p>
            <input
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              autoComplete="tel"
            />
            <input
              type="text"
              placeholder="4자리 인증번호"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input-field"
              autoComplete="one-time-code"
              maxLength={4}
            />
            <input
              type="text"
              placeholder="닉네임"
              value={nicknameSignup}
              onChange={(e) => setNicknameSignup(e.target.value)}
              className="input-field"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={
                pending || !phone.trim() || !code.trim() || !nicknameSignup.trim()
              }
              className="btn-primary w-full py-3"
            >
              {pending ? "등록 중..." : "등록"}
            </button>
          </form>
        )}

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && <p className="text-cyan-400 text-sm mt-2">{success}</p>}
      </div>
    </div>
  );
}
