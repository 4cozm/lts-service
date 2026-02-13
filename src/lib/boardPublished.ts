import type { MatchLine } from "../ingest/matchSchema.js";
import type { Redis } from "ioredis";

export const BOARD_PUBLISHED_KEY = "board:published";

export type AggregatedPlayer = {
  deviceId: number;
  name: string;
  totalScore: number;
  wins: number;
  gamesPlayed: number;
  totalKills: number;
  totalDeaths: number;
  totalShots: number;
  totalHits: number;
  totalDamage: number;
};

export type PublishedPayload = {
  matchIds: string[];
  players: AggregatedPlayer[];
  updatedAt: string;
};

type PlayerStats = {
  Score?: number | null;
  Deaths?: number | null;
  Shots?: number | null;
  Hits?: number | null;
  TotalDamage?: number | null;
  Kills?: number | null;
};

/**
 * 여러 경기에서 플레이어별 총점·승리·킬/데스/명중/데미지 집계.
 * 플레이어 식별: DeviceId (fallback PreconfiguredDeviceId). 이름은 마지막 등장 PlayerName.
 */
export function aggregatePlayersFromMatches(matches: MatchLine[]): AggregatedPlayer[] {
  const byDevice = new Map<number, {
    name: string;
    totalScore: number;
    wins: number;
    gamesPlayed: number;
    totalKills: number;
    totalDeaths: number;
    totalShots: number;
    totalHits: number;
    totalDamage: number;
  }>();

  for (const match of matches) {
    const winSide = match.WinSide ?? (match as Record<string, unknown>).winSide as string | undefined;
    const teams = match.Teams;
    if (!teams || typeof teams !== "object") continue;

    for (const [teamKey, team] of Object.entries(teams)) {
      const t = team as { Players?: Array<{ PlayerName?: string | null; DeviceId?: number | null; PreconfiguredDeviceId?: number | null; Statistics?: PlayerStats }> };
      const players = t?.Players ?? [];
      if (!Array.isArray(players)) continue;

      for (const p of players) {
        const deviceId = p.DeviceId ?? p.PreconfiguredDeviceId;
        if (deviceId == null) continue;

        const name = (p.PlayerName ?? "").trim() || `#${deviceId}`;
        const st = p.Statistics;
        const score = typeof st?.Score === "number" ? st.Score : 0;
        const kills = typeof st?.Kills === "number" ? st.Kills : 0;
        const deaths = typeof st?.Deaths === "number" ? st.Deaths : 0;
        const shots = typeof st?.Shots === "number" ? st.Shots : 0;
        const hits = typeof st?.Hits === "number" ? st.Hits : 0;
        const damage = typeof st?.TotalDamage === "number" ? st.TotalDamage : 0;
        const won = winSide != null && winSide === teamKey ? 1 : 0;

        const cur = byDevice.get(deviceId);
        if (cur) {
          cur.name = name || cur.name;
          cur.totalScore += score;
          cur.wins += won;
          cur.gamesPlayed += 1;
          cur.totalKills += kills;
          cur.totalDeaths += deaths;
          cur.totalShots += shots;
          cur.totalHits += hits;
          cur.totalDamage += damage;
        } else {
          byDevice.set(deviceId, {
            name,
            totalScore: score,
            wins: won,
            gamesPlayed: 1,
            totalKills: kills,
            totalDeaths: deaths,
            totalShots: shots,
            totalHits: hits,
            totalDamage: damage,
          });
        }
      }
    }
  }

  return Array.from(byDevice.entries())
    .map(([deviceId, v]) => ({
      deviceId,
      name: v.name,
      totalScore: v.totalScore,
      wins: v.wins,
      gamesPlayed: v.gamesPlayed,
      totalKills: v.totalKills,
      totalDeaths: v.totalDeaths,
      totalShots: v.totalShots,
      totalHits: v.totalHits,
      totalDamage: v.totalDamage,
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
}

export async function getPublishedPayload(redis: Redis): Promise<PublishedPayload | null> {
  const raw = await redis.get(BOARD_PUBLISHED_KEY);
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as PublishedPayload;
  } catch {
    return null;
  }
}

export async function setPublishedPayload(redis: Redis, payload: PublishedPayload): Promise<void> {
  await redis.set(BOARD_PUBLISHED_KEY, JSON.stringify(payload));
}
