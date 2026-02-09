import "dotenv/config";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dllPath = process.env.LITEDB_DLL_PATH?.trim();
const args = ["build", path.join(root, "ingest-bridge")];
if (dllPath) {
  const quoted = dllPath.includes(" ") ? `"${dllPath.replace(/"/g, '""')}"` : dllPath;
  args.push(`-p:LiteDBDllPath=${quoted}`);
}
const r = spawnSync("dotnet", args, { stdio: "inherit", cwd: root, shell: false });
if (r.status !== 0) {
  const err = new Error(r.error ? String(r.error) : `dotnet build exited with ${r.status}`);
  err.status = r.status;
  throw err;
}
