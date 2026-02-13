import { z } from "zod";
// 개인 통계 (C# BuildPlayerSlim 출력 기준)
const playerStatsSchema = z.object({
    Score: z.number().nullable().optional(),
    Deaths: z.number().nullable().optional(),
    Shots: z.number().nullable().optional(),
    ConsecutiveKills: z.number().nullable().optional(),
    MaxConsecutiveKills: z.number().nullable().optional(),
    ConsecutiveDeaths: z.number().nullable().optional(),
    NemesisPlayerId: z.number().nullable().optional(),
    Kills: z.number().nullable().optional(),
    Hits: z.number().nullable().optional(),
    TotalDamage: z.number().nullable().optional(),
    FatalHits: z.number().nullable().optional(),
}).passthrough();
// 플레이어 1명
const playerSchema = z.object({
    PlayerName: z.string().nullable().optional(),
    DeviceId: z.number().nullable().optional(),
    PreconfiguredDeviceId: z.number().nullable().optional(),
    Statistics: playerStatsSchema.optional(),
}).passthrough();
// 팀 (Score + Players)
const teamSchema = z.object({
    Score: z.number().nullable().optional(),
    Players: z.array(playerSchema).optional(),
}).passthrough();
// 경기 전체 — Teams는 z.record로 동적 키(Red/Blue/Yellow/Green/Purple 등) 허용
export const matchLineSchema = z.object({
    Id: z.union([z.string(), z.number()]),
    Name: z.string().optional(),
    LaunchTime: z.string().optional(),
    StartTime: z.string().nullable().optional(),
    FinishTime: z.string().optional(),
    DurationSeconds: z.number().optional(),
    Environment: z.object({
        GameType: z.object({
            Id: z.string().optional(),
            Name: z.string().optional(),
        }).passthrough().optional(),
    }).passthrough().nullable().optional(),
    Teams: z.record(z.string(), teamSchema).optional(),
    WinSide: z.string().nullable().optional(),
}).passthrough();
export function parseMatchLine(line) {
    const trimmed = line.trim();
    if (!trimmed)
        return null;
    try {
        return matchLineSchema.parse(JSON.parse(trimmed));
    }
    catch {
        return null;
    }
}
