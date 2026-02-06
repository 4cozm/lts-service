import { getRedis } from "../redis.js";
import { getTodayBoardKey } from "../lib/boardKey.js";
const WAITING = "waiting";
const PLAYING = "playing";
const DONE = "done";
const STATUSES = [WAITING, PLAYING, DONE];
function isLocalhost(ip) {
    return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}
function requireLocalhost(req, reply, done) {
    const ip = req.ip;
    if (!isLocalhost(ip)) {
        reply.status(403).send({ error: "Forbidden: localhost only" });
        return;
    }
    done();
}
export async function boardRoutes(app) {
    app.addHook("preHandler", requireLocalhost);
    app.get("/api/board", async (req, reply) => {
        const redis = getRedis();
        const key = getTodayBoardKey();
        const entries = [];
        for (const status of STATUSES) {
            const list = await redis.smembers(`${key}:${status}`);
            for (const id of list) {
                const data = await redis.get(`${key}:entry:${id}`);
                if (data) {
                    try {
                        const o = JSON.parse(data);
                        entries.push({ ...o, status });
                    }
                    catch {
                        entries.push({ id, nickname: id, status, createdAt: new Date().toISOString() });
                    }
                }
            }
        }
        const byStatus = { waiting: [], playing: [], done: [] };
        for (const e of entries) {
            byStatus[e.status].push(e);
        }
        return reply.send(byStatus);
    });
    app.patch("/api/board/entries/:id", {
        schema: {
            params: { type: "object", required: ["id"], properties: { id: { type: "string" } } },
            body: { type: "object", required: ["status"], properties: { status: { type: "string", enum: STATUSES } } },
        },
    }, async (req, reply) => {
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
    });
    app.post("/api/board/entries", {
        schema: {
            body: { type: "object", required: ["id", "nickname"], properties: { id: { type: "string" }, nickname: { type: "string" } } },
        },
    }, async (req, reply) => {
        const { id, nickname } = req.body;
        const redis = getRedis();
        const key = getTodayBoardKey();
        const createdAt = new Date().toISOString();
        const entry = { id, nickname, status: WAITING, createdAt };
        await redis.sadd(`${key}:${WAITING}`, id);
        await redis.set(`${key}:entry:${id}`, JSON.stringify({ id, nickname, createdAt }));
        return reply.send(entry);
    });
}
