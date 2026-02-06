import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { JWT_OPTIONS } from "./lib/jwt.js";
import { authRoutes } from "./routes/auth.js";
import { boardRoutes } from "./routes/board.js";
import { registerRoutes } from "./routes/register.js";

export async function buildApp() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(jwt, JWT_OPTIONS);
  await app.register(authRoutes);
  await app.register(registerRoutes, { prefix: "/" });
  await app.register(boardRoutes, { prefix: "/" });
  return app;
}
