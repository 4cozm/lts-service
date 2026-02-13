import { useEffect, useState } from "react";

type AggregatedPlayer = {
  deviceId: number;
  name: string;
  totalScore: number;
  wins: number;
  gamesPlayed: number;
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

  const players = payload?.players ?? [];
  const hasData = players.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">플레이어 점수 보드</h1>
        <p className="text-slate-400 text-sm mb-6">
          {connected ? (hasData ? "발행된 경기 기준 집계" : "연결됨 · 발행된 경기가 없습니다") : "연결 대기 중…"}
        </p>

        {!hasData && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
            {connected ? "경기를 선택한 뒤 match 페이지에서 발행해 주세요." : "WebSocket 연결 중…"}
          </div>
        )}

        {hasData && (
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm">
                  <th className="py-3 px-4 font-medium">이름</th>
                  <th className="py-3 px-4 font-medium text-right">총점</th>
                  <th className="py-3 px-4 font-medium text-right">승리</th>
                  <th className="py-3 px-4 font-medium text-right">참가 경기</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.deviceId} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-right">{p.totalScore}</td>
                    <td className="py-3 px-4 text-right">{p.wins}</td>
                    <td className="py-3 px-4 text-right">{p.gamesPlayed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
