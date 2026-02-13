import type { FastifyInstance } from "fastify";
import { addDisplayClient, removeDisplayClient, sendLatestToDisplay } from "../displayWs.js";

export async function displayWsRoutes(app: FastifyInstance): Promise<void> {
  app.get("/ws/display", { websocket: true }, (socket, _req) => {
    addDisplayClient(socket);
    socket.on("close", () => removeDisplayClient(socket));
    sendLatestToDisplay(socket).catch(() => removeDisplayClient(socket));
  });
}
