import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getRecentLogs } from "../lib/logBuffer.js";

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

export async function devRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireLocalhost);

  app.get<{
    Querystring: { limit?: string };
  }>(
    "/api/dev/logs",
    {
      schema: {
        querystring: {
          type: "object",
          properties: { limit: { type: "string" } },
        },
        response: {
          200: {
            type: "object",
            properties: {
              logs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    level: { type: "number" },
                    time: { type: "number" },
                    msg: { type: "string" },
                    levelName: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
      const limit = req.query.limit ? Math.min(500, parseInt(req.query.limit, 10) || 200) : 200;
      const logs = getRecentLogs(limit);
      return reply.send({ logs });
    }
  );
}
