import type { PublishedPayload } from "./lib/boardPublished.js";
import { getPublishedPayload } from "./lib/boardPublished.js";
import { getRedis } from "./redis.js";

export type DisplaySocket = { send: (data: string) => void };

const clients = new Set<DisplaySocket>();

export function addDisplayClient(socket: DisplaySocket): void {
  clients.add(socket);
}

export function removeDisplayClient(socket: DisplaySocket): void {
  clients.delete(socket);
}

export function broadcastDisplay(payload: PublishedPayload): void {
  const msg = JSON.stringify(payload);
  for (const s of clients) {
    try {
      s.send(msg);
    } catch {
      clients.delete(s);
    }
  }
}

/** 연결 시 최신 board:published 전송 (Redis에서 로드) */
export async function sendLatestToDisplay(socket: DisplaySocket): Promise<void> {
  const redis = getRedis();
  const payload = await getPublishedPayload(redis);
  if (payload) {
    try {
      socket.send(JSON.stringify(payload));
    } catch {
      clients.delete(socket);
    }
  }
}
