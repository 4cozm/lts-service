import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const r = spawnSync("dotnet", ["build", path.join(root, "ingest-bridge")], {
  stdio: "inherit",
  cwd: root,
});
if (r.status !== 0) {
  const err = new Error(r.error ? String(r.error) : `dotnet build exited with ${r.status}`);
  err.status = r.status;
  throw err;
}
