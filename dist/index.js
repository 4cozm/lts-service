import "dotenv/config";
import path from "path";
import { spawn } from "child_process";
import { config } from "./config.js";
import { buildApp } from "./app.js";
import { startIngestFromStream } from "./ingest/streamIngest.js";
const DEBUG_ENDPOINT = "http://127.0.0.1:7242/ingest/f5f9e2b5-6e29-44c2-98b6-e53c33291b35";
async function main() {
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "index.ts:main", message: "main started", data: {}, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H2" }) }).catch(() => { });
    // #endregion
    const app = await buildApp();
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "index.ts:after buildApp", message: "buildApp done", data: {}, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H2" }) }).catch(() => { });
    // #endregion
    const log = app.log;
    startIngestFromStream(log);
    const bridgePath = path.join(process.cwd(), "ingest-bridge");
    const child = spawn("dotnet", ["run", "--project", bridgePath], {
        cwd: process.cwd(),
        stdio: "inherit",
        env: { ...process.env },
    });
    child.on("error", (err) => log.warn({ err: String(err), message: "ingest-bridge spawn error" }));
    child.on("exit", (code, signal) => {
        if (code != null && code !== 0)
            log.warn({ code, message: "ingest-bridge exited" });
        if (signal)
            log.warn({ signal, message: "ingest-bridge killed" });
    });
    process.on("exit", () => {
        child.kill();
    });
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "index.ts:before listen", message: "before app.listen", data: { port: config.PORT }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H5" }) }).catch(() => { });
    // #endregion
    await app.listen({ port: config.PORT, host: config.BIND_HOST });
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "index.ts:after listen", message: "listen done", data: {}, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H5" }) }).catch(() => { });
    // #endregion
    log.info({ port: config.PORT, host: config.BIND_HOST }, "LTS local server listening");
}
main().catch((err) => {
    // #region agent log
    fetch(DEBUG_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: "index.ts:main.catch", message: "main error", data: { err: String(err), stack: err?.stack }, timestamp: Date.now(), sessionId: "debug-session", hypothesisId: "H2" }) }).catch(() => { });
    // #endregion
    console.error(err);
    process.exit(1);
});
