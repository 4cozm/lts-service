import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getRedis } from "../redis.js";
import { getTodayBoardKey } from "../lib/boardKey.js";

const WAITING = "waiting";
const PLAYING = "playing";
const DONE = "done";
const STATUSES = [WAITING, PLAYING, DONE] as const;
type Status = (typeof STATUSES)[number];

function isLocalhost(ip: string): boolean {
  return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}

function requireLocalhost(
  req: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void
): void {
  const ip = req.ip;
  if (!isLocalhost(ip)) {
    reply.status(403).send({ error: "Forbidden: localhost only" });
    return;
  }
  done();
}

export async function boardRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireLocalhost);

  app.get("/api/board", async (req: FastifyRequest, reply: FastifyReply) => {
    const redis = getRedis();
    const key = getTodayBoardKey();
    const entries: Array<{ id: string; nickname: string; status: Status; createdAt: string }> = [];
    for (const status of STATUSES) {
      const list = await redis.smembers(`${key}:${status}`);
      for (const id of list) {
        const data = await redis.get(`${key}:entry:${id}`);
        if (data) {
          try {
            const o = JSON.parse(data);
            entries.push({ ...o, status });
          } catch {
            entries.push({ id, nickname: id, status, createdAt: new Date().toISOString() });
          }
        }
      }
    }
    const byStatus = { waiting: [] as typeof entries, playing: [] as typeof entries, done: [] as typeof entries };
    for (const e of entries) {
      byStatus[e.status].push(e);
    }
    return reply.send(byStatus);
  });

  app.patch<{
    Params: { id: string };
    Body: { status: Status };
  }>(
    "/api/board/entries/:id",
    {
      schema: {
        params: { type: "object", required: ["id"], properties: { id: { type: "string" } } },
        body: { type: "object", required: ["status"], properties: { status: { type: "string", enum: STATUSES } } },
      },
    },
    async (req: FastifyRequest<{ Params: { id: string }; Body: { status: Status } }>, reply: FastifyReply) => {
      const { id } = req.params;
      const { status } = req.body;
      const redis = getRedis();
      const key = getTodayBoardKey();
      const pipe = redis.pipeline();
      for (const s of STATUSES) {
        pipe.srem(`${key}:${s}`, id);
      }
      pipe.sadd(`${key}:${status}`, id);
      await pipe.exec();
      const data = await redis.get(`${key}:entry:${id}`);
      const entry = data ? JSON.parse(data) : { id, nickname: id, createdAt: new Date().toISOString() };
      return reply.send({ ...entry, status });
    }
  );

  app.post<{
    Body: { id: string; nickname: string };
  }>(
    "/api/board/entries",
    {
      schema: {
        body: { type: "object", required: ["id", "nickname"], properties: { id: { type: "string" }, nickname: { type: "string" } } },
      },
    },
    async (req: FastifyRequest<{ Body: { id: string; nickname: string } }>, reply: FastifyReply) => {
      const { id, nickname } = req.body;
      const redis = getRedis();
      const key = getTodayBoardKey();
      const createdAt = new Date().toISOString();
      const entry = { id, nickname, status: WAITING, createdAt };
      await redis.sadd(`${key}:${WAITING}`, id);
      await redis.set(`${key}:entry:${id}`, JSON.stringify({ id, nickname, createdAt }));
      return reply.send(entry);
    }
  );
}
