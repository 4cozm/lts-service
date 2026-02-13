import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import websocket from "@fastify/websocket";
import pino from "pino";
import { logBufferStream } from "./lib/logBuffer.js";
import { JWT_OPTIONS } from "./lib/jwt.js";
import { authRoutes } from "./routes/auth.js";
import { boardRoutes } from "./routes/board.js";
import { displayWsRoutes } from "./routes/displayWsRoutes.js";
import { registerRoutes } from "./routes/register.js";
import { devRoutes } from "./routes/dev.js";
const multistream = pino.multistream([
    pino.destination(1),
    logBufferStream,
]);
export async function buildApp() {
    const app = Fastify({
        logger: { stream: multistream },
    });
    await app.register(cors, { origin: true });
    await app.register(jwt, JWT_OPTIONS);
    await app.register(websocket);
    await app.register(displayWsRoutes);
    await app.register(authRoutes);
    await app.register(registerRoutes, { prefix: "/" });
    await app.register(boardRoutes, { prefix: "/" });
    await app.register(devRoutes, { prefix: "/" });
    return app;
}
