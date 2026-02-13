import { getRedis } from "../redis.js";
import { toNickKey, validateGuestNickname } from "../lib/nickKey.js";
import { getTodayBoardKey } from "../lib/boardKey.js";
import { config } from "../config.js";
const NICK_KEY_SET = "nickname:keys";
const NICKNAME_GUEST_PREFIX = "nickname:guest:";
const PHONE_SET = "phone:set";
const GUEST_PREFIX = "guest:";
const MEMBER_KEY_PREFIX = "member:";
const MEMBER_ID_PREFIX = "mem_";
const GUEST_REDIS_TTL_SECONDS = 7 * 24 * 3600; // 7 days
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
        const raw = req.body.nickname ?? "";
        const validation = validateGuestNickname(raw);
        if (!validation.ok) {
            return reply.status(400).send({ error: validation.error });
        }
        const nickname = validation.normalized;
        const nickKey = toNickKey(nickname);
        const redis = getRedis();
        const memberTaken = await redis.sismember(NICK_KEY_SET, nickKey);
        if (memberTaken) {
            return reply.status(409).send({ error: "Nickname already taken" });
        }
        const guestTaken = await redis.get(`${NICKNAME_GUEST_PREFIX}${nickKey}`);
        if (guestTaken) {
            return reply.status(409).send({ error: "Nickname already taken" });
        }
        const guestApiUrl = config.GUEST_API_URL;
        if (!guestApiUrl) {
            return reply.status(503).send({ error: "Guest registration unavailable (GUEST_API_URL not set)" });
        }
        let id;
        try {
            const res = await fetch(`${guestApiUrl.replace(/\/$/, "")}/internal/guest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname }),
            });
            if (!res.ok) {
                const err = (await res.json().catch(() => ({})));
                return reply.status(res.status).send({ error: err.error ?? res.statusText });
            }
            const data = (await res.json());
            id = data.id;
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : "Guest API request failed";
            return reply.status(502).send({ error: msg });
        }
        const idStr = String(id);
        const createdAt = new Date().toISOString();
        await redis.set(`${GUEST_PREFIX}${id}`, JSON.stringify({ id: idStr, nickname, nickKey, createdAt }), "EX", GUEST_REDIS_TTL_SECONDS);
        await redis.set(`${NICKNAME_GUEST_PREFIX}${nickKey}`, idStr, "EX", GUEST_REDIS_TTL_SECONDS);
        const boardKey = getTodayBoardKey();
        await redis.sadd(`${boardKey}:waiting`, idStr);
        await redis.set(`${boardKey}:entry:${idStr}`, JSON.stringify({ id: idStr, nickname, createdAt }));
        return reply.send({ id: idStr, nickname });
    });
    app.post("/api/register/member-login", {
        schema: {
            body: {
                type: "object",
                required: ["phone", "code"],
                properties: { phone: { type: "string" }, code: { type: "string" } },
            },
        },
    }, async (req, reply) => {
        const { phone, code } = req.body;
        const phoneTrim = phone?.trim();
        if (!phoneTrim || !code?.trim()) {
            return reply.status(400).send({ error: "Phone and code required" });
        }
        const redis = getRedis();
        const memberId = await redis.get(`${MEMBER_KEY_PREFIX}phone:${phoneTrim}`);
        if (!memberId) {
            return reply.status(404).send({ error: "회원이 아닙니다" });
        }
        const memberJson = await redis.get(`${MEMBER_KEY_PREFIX}${memberId}`);
        const member = memberJson ? JSON.parse(memberJson) : { nickname: phoneTrim };
        const nickname = member.nickname || phoneTrim;
        const boardKey = getTodayBoardKey();
        const createdAt = new Date().toISOString();
        await redis.sadd(`${boardKey}:waiting`, memberId);
        await redis.set(`${boardKey}:entry:${memberId}`, JSON.stringify({ id: memberId, nickname, createdAt }));
        return reply.send({ userRef: memberId, message: "등록 완료(대기열 들어감)" });
    });
    app.post("/api/register/member", {
        schema: {
            body: {
                type: "object",
                required: ["phone", "code", "nickname"],
                properties: {
                    phone: { type: "string" },
                    code: { type: "string" },
                    nickname: { type: "string" },
                },
            },
        },
    }, async (req, reply) => {
        const { phone, code, nickname } = req.body;
        const phoneTrim = phone?.trim();
        const nicknameTrim = nickname?.trim();
        if (!phoneTrim || !code?.trim() || !nicknameTrim) {
            return reply.status(400).send({ error: "Phone, code and nickname required" });
        }
        const nickKey = toNickKey(nicknameTrim);
        const redis = getRedis();
        const phoneExists = await redis.sismember(PHONE_SET, phoneTrim);
        if (phoneExists) {
            return reply.status(409).send({ error: "이미 가입된 전화번호입니다" });
        }
        const nickExists = await redis.sismember(NICK_KEY_SET, nickKey);
        if (nickExists) {
            return reply.status(409).send({ error: "Nickname already taken" });
        }
        const id = `${MEMBER_ID_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const createdAt = new Date().toISOString();
        await redis.sadd(PHONE_SET, phoneTrim);
        await redis.set(`${MEMBER_KEY_PREFIX}phone:${phoneTrim}`, id);
        await redis.set(`${MEMBER_KEY_PREFIX}${id}`, JSON.stringify({ id, phone: phoneTrim, nickname: nicknameTrim, nickKey, createdAt }));
        await redis.sadd(NICK_KEY_SET, nickKey);
        const boardKey = getTodayBoardKey();
        await redis.sadd(`${boardKey}:waiting`, id);
        await redis.set(`${boardKey}:entry:${id}`, JSON.stringify({ id, nickname: nicknameTrim, createdAt }));
        return reply.send({ userRef: id, message: "등록 완료(대기열 들어감)" });
    });
}
