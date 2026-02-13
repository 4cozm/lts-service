import { useEffect, useRef, useState } from "react";

type AggregatedPlayer = {
  deviceId: number;
  name: string;
  totalScore: number;
  wins: number;
  gamesPlayed: number;
  totalKills?: number;
  totalDeaths?: number;
  totalShots?: number;
  totalHits?: number;
  totalDamage?: number;
};

type Payload = {
  matchIds?: string[];
  players: AggregatedPlayer[];
  updatedAt?: string;
};

function getWsUrl(): string {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws/display`;
}

export default function Display() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let timeout: ReturnType<typeof setTimeout>;

    function connect() {
      ws = new WebSocket(getWsUrl());
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        timeout = setTimeout(connect, 3000);
      };
      ws.onerror = () => {};
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data as string) as Payload;
          if (data && Array.isArray(data.players)) setPayload(data);
        } catch {
          // ignore
        }
      };
    }

    connect();
    return () => {
      clearTimeout(timeout);
      ws?.close();
    };
  }, []);

  // 자동 스크롤: 컨텐츠가 넘치면 천천히 아래로 스크롤 후 맨 위로
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tick = (): void => {
      if (el.scrollHeight <= el.clientHeight) return;
      el.scrollTop += 1;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        el.scrollTop = 0;
      }
    };
    const id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, [payload?.players?.length]);

  const players = payload?.players ?? [];
  const hasData = players.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12">
      <div className="w-full max-w-full">
        <h1 className="text-4xl font-bold mb-4">플레이어 점수 보드</h1>
        <p className="text-slate-400 text-base mb-8">
          {connected ? (hasData ? "발행된 경기 기준 집계 (합산 점수 순)" : "연결됨 · 발행된 경기가 없습니다") : "연결 대기 중…"}
        </p>

        {!hasData && (
          <div className="rounded-2xl border-2 border-white/10 bg-white/5 p-16 text-center text-slate-400 text-xl">
            {connected ? "경기를 선택한 뒤 match 페이지에서 발행해 주세요." : "WebSocket 연결 중…"}
          </div>
        )}

        {hasData && (
          <div
            ref={scrollRef}
            className="rounded-2xl border-2 border-white/10 bg-white/5 overflow-y-auto overflow-x-auto"
            style={{ maxHeight: "calc(100vh - 14rem)" }}
          >
            <table className="w-full text-left min-w-[960px] text-lg">
              <thead className="sticky top-0 bg-slate-900/95 z-10">
                <tr className="border-b-2 border-white/10 text-slate-400 text-base">
                  <th className="py-6 px-6 font-medium">이름</th>
                  <th className="py-6 px-6 font-medium text-right">합산 킬</th>
                  <th className="py-6 px-6 font-medium text-right">합산 데스</th>
                  <th className="py-6 px-6 font-medium text-right">평균 명중률</th>
                  <th className="py-6 px-6 font-medium text-right">평균 데미지</th>
                  <th className="py-6 px-6 font-medium text-right">총합 데미지</th>
                  <th className="py-6 px-6 font-medium text-right">승률</th>
                  <th className="py-6 px-6 font-medium text-right">합산 점수</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => {
                  const shots = p.totalShots ?? 0;
                  const hits = p.totalHits ?? 0;
                  const damage = p.totalDamage ?? 0;
                  const games = p.gamesPlayed || 1;
                  const avgAccuracy = shots > 0 ? (hits / shots) * 100 : 0;
                  const avgDamage = games > 0 ? damage / games : 0;
                  const winRate = games > 0 ? (p.wins / games) * 100 : 0;
                  return (
                    <tr key={p.deviceId} className="border-b-2 border-white/5 hover:bg-white/5">
                      <td className="py-4 px-6 font-medium truncate max-w-[240px]">{p.name}</td>
                      <td className="py-4 px-6 text-right">{p.totalKills ?? 0}</td>
                      <td className="py-4 px-6 text-right">{p.totalDeaths ?? 0}</td>
                      <td className="py-4 px-6 text-right">{avgAccuracy > 0 ? `${avgAccuracy.toFixed(1)}%` : "-"}</td>
                      <td className="py-4 px-6 text-right">{avgDamage > 0 ? Math.round(avgDamage) : "-"}</td>
                      <td className="py-4 px-6 text-right">{damage > 0 ? damage : "-"}</td>
                      <td className="py-4 px-6 text-right">{winRate > 0 ? `${winRate.toFixed(1)}%` : "0%"}</td>
                      <td className="py-4 px-6 text-right font-semibold">{p.totalScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
