import { getRedis } from "../redis.js";
import { toNickKey } from "../lib/nickKey.js";
const NICK_KEY_SET = "nickname:keys";
const GUEST_PREFIX = "guest:";
async function requireStaff(req, reply) {
    try {
        await req.jwtVerify();
        const payload = req.user;
        if (payload.type !== "staff") {
            return reply.status(403).send({ error: "Staff only" });
        }
    }
    catch {
        return reply.status(401).send({ error: "Unauthorized" });
    }
}
export async function registerRoutes(app) {
    app.addHook("preHandler", requireStaff);
    app.post("/api/register/guest", {
        schema: {
            body: { type: "object", required: ["nickname"], properties: { nickname: { type: "string" } } },
        },
    }, async (req, reply) => {
        const nickname = req.body.nickname?.trim();
        if (!nickname || nickname.length < 1) {
            return reply.status(400).send({ error: "Nickname required" });
        }
        const nickKey = toNickKey(nickname);
        const redis = getRedis();
        const exists = await redis.sismember(NICK_KEY_SET, nickKey);
        if (exists) {
            return reply.status(409).send({ error: "Nickname already taken" });
        }
        const id = `${GUEST_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        await redis.sadd(NICK_KEY_SET, nickKey);
        await redis.set(`guest:${id}`, JSON.stringify({ id, nickname, nickKey, createdAt: new Date().toISOString() }));
        const boardKey = getTodayBoardKey();
        await redis.sadd(`${boardKey}:waiting`, id);
        await redis.set(`${boardKey}:entry:${id}`, JSON.stringify({ id, nickname, createdAt: new Date().toISOString() }));
        return reply.send({ id, nickname });
    });
}
function getTodayBoardKey() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const y = kst.getUTCFullYear();
    const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
    const d = String(kst.getUTCDate()).padStart(2, "0");
    return `board:${y}-${m}-${d}`;
}
