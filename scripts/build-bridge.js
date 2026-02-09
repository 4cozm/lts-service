import "dotenv/config";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dllPath = process.env.LITEDB_DLL_PATH?.trim();
const args = ["build", path.join(root, "ingest-bridge")];
if (dllPath) {
  args.push(`-p:LiteDBDllPath=${dllPath}`);
}
execSync(`dotnet ${args.join(" ")}`, { stdio: "inherit", cwd: root, shell: true });
