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
// 인자 배열로 넘겨 경로 공백(예: EDGE 6.1)이 깨지지 않음. shell 사용 시 따옴표 이스케이프 필요.
execSync("dotnet", [...args], { stdio: "inherit", cwd: root });
