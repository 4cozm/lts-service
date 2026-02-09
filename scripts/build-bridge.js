import "dotenv/config";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dllPath = process.env.LITEDB_DLL_PATH?.trim();
const args = ["build", path.join(root, "ingest-bridge")];
if (dllPath) {
  // 경로에 공백이 있으면 MSBuild가 한 인자로 인식하도록 따옴표로 감쌈 (Windows에서 공백 시 인자가 쪼개져 dotnet Usage 출력됨)
  const quoted = dllPath.includes(" ") ? `"${dllPath.replace(/"/g, '""')}"` : dllPath;
  args.push(`-p:LiteDBDllPath=${quoted}`);
}
execSync("dotnet", [...args], { stdio: "inherit", cwd: root });
