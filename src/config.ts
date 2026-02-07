import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5179),
  BIND_HOST: z.string().default("0.0.0.0"),
  MATCH_RESULTS_PATH: z.string().default("./data/matchResults.jsonl"),
  PLAYERS_PATH: z.string().default("./data/players.json"),
  POLL_INTERVAL_MS: z.coerce.number().default(1000),
  STAFF_ID: z.string().min(1),
  STAFF_PW: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default("7d"),
  REDIS_URL: z.string().url(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
});

export type Config = z.infer<typeof envSchema>;

function loadEnv(): Config {
  const raw = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    BIND_HOST: process.env.BIND_HOST,
    MATCH_RESULTS_PATH: process.env.MATCH_RESULTS_PATH,
    PLAYERS_PATH: process.env.PLAYERS_PATH,
    POLL_INTERVAL_MS: process.env.POLL_INTERVAL_MS,
    STAFF_ID: process.env.STAFF_ID,
    STAFF_PW: process.env.STAFF_PW,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REDIS_URL: process.env.REDIS_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  };
  return envSchema.parse(raw);
}

export const config = loadEnv();
