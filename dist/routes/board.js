import { getRedis } from "../redis.js";
import { getTodayBoardKey, getTodayDateString, isCreatedTodayKst } from "../lib/boardKey.js";
import { broadcastDisplay } from "../displayWs.js";
import { aggregatePlayersFromMatches, setPublishedPayload, } from "../lib/boardPublished.js";
const MATCH_IDS_SET = "match:ids";
const MATCHES_KEY_PREFIX = "match:";
/** C# 슬림 요약은 PascalCase. 프론트 호환을 위해 camelCase alias 추가. */
function normalizeMatchForFrontend(obj) {
    const out = { ...obj };
    // Teams 내부 각 팀에 score/players alias
    const teams = out.Teams;
    if (teams && typeof teams === "object") {
        for (const key of Object.keys(teams)) {
            const team = teams[key];
            if (team && typeof team === "object") {
                if (team.Score !== undefined && team.score === undefined)
                    team.score = team.Score;
                if (team.Players !== undefined && team.players === undefined)
                    team.players = team.Players;
            }
        }
    }
    // WinSide: 최상위 (새 포맷) 또는 Result 안 (하위 호환)
    if (out.WinSide !== undefined && out.winSide === undefined)
        out.winSide = out.WinSide;
    const result = out.Result;
    if (result && result.WinSide !== undefined && result.winSide === undefined)
        result.winSide = result.WinSide;
    return out;
}
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
        const todayOnly = entries.filter((e) => isCreatedTodayKst(e.createdAt ?? ""));
        const byStatus = { waiting: [], playing: [], done: [] };
        for (const e of todayOnly) {
            byStatus[e.status].push(e);
        }
        return reply.send(byStatus);
    });
    app.get("/api/board/matches", async (req, reply) => {
        const redis = getRedis();
        const ids = await redis.smembers(MATCH_IDS_SET);
        const todayKst = getTodayDateString();
        const matches = [];
        if (ids.length === 0)
            return reply.send({ matches });
        const keys = ids.map((id) => `${MATCHES_KEY_PREFIX}${id}`);
        const raws = await redis.mget(...keys);
        for (let i = 0; i < ids.length; i++) {
            const raw = raws[i];
            if (!raw || typeof raw !== "string")
                continue;
            try {
                const obj = JSON.parse(raw);
                const ft = obj.FinishTime;
                if (!ft || typeof ft !== "string")
                    continue;
                const finishMs = new Date(ft).getTime();
                if (Number.isNaN(finishMs))
                    continue;
                const kstDate = new Date(finishMs + 9 * 60 * 60 * 1000);
                const y = kstDate.getUTCFullYear();
                const mth = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
                const d = String(kstDate.getUTCDate()).padStart(2, "0");
                const dateStr = `${y}-${mth}-${d}`;
                if (dateStr !== todayKst)
                    continue;
                const durationSec = obj.DurationSeconds;
                if (typeof durationSec === "number" && durationSec <= 360)
                    continue;
                matches.push(normalizeMatchForFrontend(obj));
            }
            catch {
                continue;
            }
        }
        matches.sort((a, b) => {
            const ta = a.FinishTime ?? "";
            const tb = b.FinishTime ?? "";
            return tb.localeCompare(ta);
        });
        return reply.send({ matches });
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
    app.post("/api/board/publish", {
        schema: {
            body: { type: "object", required: ["matchIds"], properties: { matchIds: { type: "array", items: { type: "string" } } } },
        },
    }, async (req, reply) => {
        const { matchIds } = req.body;
        const redis = getRedis();
        if (!matchIds?.length) {
            return reply.status(400).send({ error: "matchIds required (non-empty array)" });
        }
        const keys = matchIds.map((id) => `${MATCHES_KEY_PREFIX}${id}`);
        const raws = await redis.mget(...keys);
        const matches = [];
        const validIds = [];
        for (let i = 0; i < matchIds.length; i++) {
            const raw = raws[i];
            if (!raw || typeof raw !== "string")
                continue;
            try {
                const obj = JSON.parse(raw);
                if (obj && typeof obj === "object" && obj.Teams) {
                    matches.push(obj);
                    validIds.push(matchIds[i]);
                }
            }
            catch {
                continue;
            }
        }
        const players = aggregatePlayersFromMatches(matches);
        const payload = {
            matchIds: validIds,
            players,
            updatedAt: new Date().toISOString(),
        };
        await setPublishedPayload(redis, payload);
        broadcastDisplay(payload);
        return reply.send(payload);
    });
}
