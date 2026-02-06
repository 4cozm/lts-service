import { config } from "./config.js";
import { buildApp } from "./app.js";
import { startIngestPoll } from "./ingest/poll.js";

async function main() {
  const app = await buildApp();
  const log = app.log;
  startIngestPoll(log);
  await app.listen({ port: config.PORT, host: config.BIND_HOST });
  log.info({ port: config.PORT, host: config.BIND_HOST }, "LTS local server listening");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
