import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "knowledge/tools/okf-upstream.json");
const args = new Set(process.argv.slice(2));
const allowed = new Set(["--check", "--self-test"]);
const unknown = [...args].filter((arg) => !allowed.has(arg));

function fail(message, code = 1) {
  console.error(`OKF上流チェック失敗: ${message}`);
  process.exit(code);
}

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) fail("設定ファイルがありません");
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (error) {
    fail(`設定JSONを読めません: ${error.message}`);
  }
  const required = ["repo", "branch", "specPath", "viewerPaths", "pinnedCommit", "checkedAt"];
  const missing = required.filter((key) => !(key in config));
  if (missing.length) fail(`設定キーが不足しています: ${missing.join(", ")}`);
  if (!/^[^/]+\/[^/]+$/.test(config.repo)) fail("repoはowner/name形式で指定してください");
  if (config.branch !== "main") fail("branchはmainで指定してください");
  if (!/^okf\/SPEC\.md$/.test(config.specPath)) fail("specPathはokf/SPEC.mdで指定してください");
  if (!Array.isArray(config.viewerPaths) || config.viewerPaths.length === 0) fail("viewerPathsは空でない配列が必要です");
  if (!config.viewerPaths.every((item) => typeof item === "string" && item.length > 0)) fail("viewerPathsに不正な値があります");
  if (!/^[0-9a-f]{40}$/.test(config.pinnedCommit)) fail("pinnedCommitは40桁のhex SHAです");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.checkedAt)) fail("checkedAtはYYYY-MM-DDです");
  return config;
}

if (unknown.length || (args.size !== 1)) {
  console.error("使用法: node knowledge/tools/check-okf-upstream.mjs --check|--self-test");
  process.exit(2);
}

const config = readConfig();
if (args.has("--self-test")) {
  console.log(`OKF上流設定self-testに合格しました: ${config.repo}@${config.pinnedCommit}`);
  process.exit(0);
}

const endpoint = `https://api.github.com/repos/${config.repo}/commits/${encodeURIComponent(config.branch)}`;
let response;
try {
  response = await fetch(endpoint, {
    headers: { accept: "application/vnd.github+json", "user-agent": "RIM-Knowledge-okf-check" },
  });
} catch (error) {
  fail(`GitHub APIへ接続できません（ネットワーク不通）: ${error.message}`);
}
if (!response.ok) fail(`GitHub APIがHTTP ${response.status}を返しました: ${endpoint}`);
let payload;
try {
  payload = await response.json();
} catch (error) {
  fail(`GitHub API応答をJSONとして読めません: ${error.message}`);
}
const current = payload?.sha;
if (!/^[0-9a-f]{40}$/.test(current || "")) fail("GitHub API応答に有効なcommit SHAがありません");
console.log(`OKF上流main: ${current}`);
console.log(`RIM固定commit: ${config.pinnedCommit}`);
if (current !== config.pinnedCommit) {
  console.error("上流差分を検出しました。人レビュー後に固定commitを更新してください。");
  process.exit(1);
}
console.log("OKF上流チェックに合格しました。上流mainと固定commitは一致しています。");
