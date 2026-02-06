import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getRedis } from "../redis.js";
import { toNickKey } from "../lib/nickKey.js";
import { getTodayBoardKey } from "../lib/boardKey.js";

const NICK_KEY_SET = "nickname:keys";
const PHONE_SET = "phone:set";
const GUEST_PREFIX = "guest:";
const MEMBER_KEY_PREFIX = "member:";
const MEMBER_ID_PREFIX = "mem_";

async function requireStaff(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await req.jwtVerify();
    const payload = req.user as { type?: string };
    if (payload.type !== "staff") {
      return reply.status(403).send({ error: "Staff only" });
    }
  } catch {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireStaff);

  app.post<{
    Body: { nickname: string };
  }>(
    "/api/register/guest",
    {
      schema: {
        body: { type: "object", required: ["nickname"], properties: { nickname: { type: "string" } } },
      },
    },
    async (req: FastifyRequest<{ Body: { nickname: string } }>, reply: FastifyReply) => {
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
    }
  );

  app.post<{
    Body: { phone: string; code: string };
  }>(
    "/api/register/member-login",
    {
      schema: {
        body: {
          type: "object",
          required: ["phone", "code"],
          properties: { phone: { type: "string" }, code: { type: "string" } },
        },
      },
    },
    async (req: FastifyRequest<{ Body: { phone: string; code: string } }>, reply: FastifyReply) => {
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
      const member = memberJson ? (JSON.parse(memberJson) as { nickname: string }) : { nickname: phoneTrim };
      const nickname = member.nickname || phoneTrim;
      const boardKey = getTodayBoardKey();
      const createdAt = new Date().toISOString();
      await redis.sadd(`${boardKey}:waiting`, memberId);
      await redis.set(`${boardKey}:entry:${memberId}`, JSON.stringify({ id: memberId, nickname, createdAt }));
      return reply.send({ userRef: memberId, message: "등록 완료(대기열 들어감)" });
    }
  );

  app.post<{
    Body: { phone: string; code: string; nickname: string };
  }>(
    "/api/register/member",
    {
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
    },
    async (req: FastifyRequest<{ Body: { phone: string; code: string; nickname: string } }>, reply: FastifyReply) => {
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
    }
  );
}
