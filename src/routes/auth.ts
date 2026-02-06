import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { config } from "../config.js";

const bodySchema = { body: { type: "object", required: ["id", "password"], properties: { id: { type: "string" }, password: { type: "string" } } } };

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: { id: string; password: string } }>(
    "/api/auth/staff/login",
    { schema: bodySchema },
    async (req: FastifyRequest<{ Body: { id: string; password: string } }>, reply: FastifyReply) => {
      const { id, password } = req.body;
      if (id !== config.STAFF_ID || password !== config.STAFF_PW) {
        return reply.status(401).send({ error: "Invalid credentials" });
      }
      const token = app.jwt.sign({ sub: id, type: "staff" });
      return reply.send({ token, expiresIn: config.JWT_EXPIRES_IN });
    }
  );
}
