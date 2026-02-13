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
  const bottomPauseUntilRef = useRef<number>(0);

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

  // 자동 스크롤: 컨텐츠가 화면 밖으로 넘치면 아래로 스크롤 → 맨 아래에서 2초 멈춤 → 맨 위로
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    bottomPauseUntilRef.current = 0;
    const tick = (): void => {
      if (el.scrollHeight <= el.clientHeight) return;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      if (atBottom) {
        if (bottomPauseUntilRef.current === 0)
          bottomPauseUntilRef.current = Date.now() + 2000;
        if (Date.now() < bottomPauseUntilRef.current) return;
        el.scrollTop = 0;
        bottomPauseUntilRef.current = 0;
      } else {
        bottomPauseUntilRef.current = 0;
        el.scrollTop += 1;
      }
    };
    const id = setInterval(tick, 80);
    return () => clearInterval(id);
  }, [payload?.players?.length]);

  const players = payload?.players ?? [];
  const hasData = players.length > 0;

  // 행별 숫자 값 (컬럼 순서: 킬, 데스, 평균명중률, 평균데미지, 총데미지, 승률, 합산점수)
  const rowValues = players.map((p) => {
    const shots = p.totalShots ?? 0;
    const hits = p.totalHits ?? 0;
    const damage = p.totalDamage ?? 0;
    const games = p.gamesPlayed || 1;
    const avgAccuracy = shots > 0 ? (hits / shots) * 100 : 0;
    const avgDamage = games > 0 ? damage / games : 0;
    const winRate = games > 0 ? (p.wins / games) * 100 : 0;
    return {
      kills: p.totalKills ?? 0,
      deaths: p.totalDeaths ?? 0,
      avgAccuracy,
      avgDamage,
      totalDamage: damage,
      winRate,
      totalScore: p.totalScore,
    };
  });

  const columns = ["kills", "deaths", "avgAccuracy", "avgDamage", "totalDamage", "winRate", "totalScore"] as const;
  const minMax = columns.map((col) => {
    const vals = rowValues.map((r) => r[col]).filter((v) => v > 0 || col === "deaths" || col === "totalScore");
    const valid = vals.length ? vals : rowValues.map((r) => r[col]);
    return {
      min: valid.length ? Math.min(...valid) : 0,
      max: valid.length ? Math.max(...valid) : 0,
    };
  });

  const getCellClass = (colIndex: number, value: number, display: string): string => {
    const base = "py-4 px-2 text-center";
    if (display === "-") return base;
    const { min, max } = minMax[colIndex];
    if (min === max) return base;
    if (value === max) return `${base} text-rose-400`;
    if (value === min) return `${base} text-sky-400`;
    return base;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12">
      <div className="w-full max-w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">플레이어 점수 보드</h1>
          <p className="text-slate-400 text-base">광안점에서만 시범 운영중인 기능입니다</p>
        </header>

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
            <table
              className="w-full min-w-[960px] table-fixed"
              style={{ fontSize: "clamp(0.65rem, 2.34vw + 0.65rem, 1.95rem)" }}
            >
              <thead
                className="sticky top-0 bg-slate-900/95 z-10"
                style={{ fontSize: "clamp(0.455rem, 1.64vw + 0.455rem, 1.365rem)" }}
              >
                <tr className="border-b-2 border-white/10 text-slate-400">
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">이름</th>
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">합산 킬</th>
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">합산 데스</th>
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">평균 명중률</th>
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">평균 데미지</th>
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">총합 데미지</th>
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">승률</th>
                  <th className="py-6 px-2 font-medium text-center whitespace-nowrap">합산 점수</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, rowIndex) => {
                  const r = rowValues[rowIndex];
                  const avgAccDisp = r.avgAccuracy > 0 ? `${r.avgAccuracy.toFixed(1)}%` : "-";
                  const avgDmgDisp = r.avgDamage > 0 ? Math.round(r.avgDamage) : "-";
                  const totalDmgDisp = r.totalDamage > 0 ? r.totalDamage : "-";
                  const winRateDisp = r.winRate > 0 ? `${r.winRate.toFixed(1)}%` : "0%";
                  return (
                    <tr key={p.deviceId} className="border-b-2 border-white/5 hover:bg-white/5">
                      <td className="py-4 px-2 font-medium text-center truncate whitespace-nowrap">{p.name}</td>
                      <td className={`${getCellClass(0, r.kills, String(r.kills))} px-2 whitespace-nowrap`}>{r.kills}</td>
                      <td className={`${getCellClass(1, r.deaths, String(r.deaths))} px-2 whitespace-nowrap`}>{r.deaths}</td>
                      <td className={`${getCellClass(2, r.avgAccuracy, avgAccDisp)} px-2 whitespace-nowrap`}>{avgAccDisp}</td>
                      <td className={`${getCellClass(3, r.avgDamage, avgDmgDisp === "-" ? "-" : String(avgDmgDisp))} px-2 whitespace-nowrap`}>{avgDmgDisp}</td>
                      <td className={`${getCellClass(4, r.totalDamage, totalDmgDisp === "-" ? "-" : String(totalDmgDisp))} px-2 whitespace-nowrap`}>{totalDmgDisp}</td>
                      <td className={`${getCellClass(5, r.winRate, winRateDisp)} px-2 whitespace-nowrap`}>{winRateDisp}</td>
                      <td className={`${getCellClass(6, r.totalScore, String(r.totalScore))} px-2 whitespace-nowrap font-semibold`}>{r.totalScore}</td>
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
