import { z } from "zod";

const playerStatsSchema = z.object({
  playerId: z.number().optional(),
  kills: z.number().optional(),
  deaths: z.number().optional(),
  shots: z.number().optional(),
  hits: z.number().optional(),
  accuracy: z.number().optional(),
  damageDealt: z.number().optional(),
}).passthrough();

const teamSchema = z.object({
  teamId: z.union([z.string(), z.number()]).optional(),
  score: z.number().optional(),
  players: z.array(playerStatsSchema).optional(),
}).passthrough();

export const matchLineSchema = z.object({
  Id: z.union([z.string(), z.number()]),
  Name: z.string().optional(),
  LaunchTime: z.string().optional(),
  FinishTime: z.string().optional(),
  DurationSeconds: z.number().optional(),
  Teams: z.object({
    Red: teamSchema.optional(),
    Blue: teamSchema.optional(),
  }).optional(),
  Result: z.object({
    winTeamId: z.union([z.string(), z.number()]).optional(),
    winSide: z.string().optional(),
    resultType: z.string().optional(),
  }).optional(),
  FirstBlood: z.object({
    killer: z.unknown().optional(),
    victim: z.unknown().optional(),
  }).optional(),
}).passthrough();

export type MatchLine = z.infer<typeof matchLineSchema>;

export function parseMatchLine(line: string): MatchLine | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    return matchLineSchema.parse(JSON.parse(trimmed));
  } catch {
    return null;
  }
}
