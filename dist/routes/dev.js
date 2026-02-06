import { getRecentLogs } from "../lib/logBuffer.js";
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
export async function devRoutes(app) {
    app.addHook("preHandler", requireLocalhost);
    app.get("/api/dev/logs", {
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
    }, async (req, reply) => {
        const limit = req.query.limit ? Math.min(500, parseInt(req.query.limit, 10) || 200) : 200;
        const logs = getRecentLogs(limit);
        return reply.send({ logs });
    });
}
