import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const TOOLS = path.join(BUNDLE, "tools");
const args = new Set(process.argv.slice(2));
const allowedArgs = new Set(["--write", "--check", "--help"]);
const unknownArgs = [...args].filter((arg) => !allowedArgs.has(arg));

function usage(exitCode = 0) {
  const output = exitCode === 0 ? console.log : console.error;
  output(
    "使用法: node knowledge/tools/maintain-okf.mjs --write|--check\n" +
      "  --write  派生資料を更新した後、全検査を実行する\n" +
      "  --check  ファイルを変更せず、全検査を実行する",
  );
  process.exit(exitCode);
}

if (args.has("--help")) usage();
if (
  unknownArgs.length ||
  args.size !== 1 ||
  (args.has("--write") && args.has("--check"))
) {
  if (unknownArgs.length) {
    console.error(`不明な引数です: ${unknownArgs.join(", ")}`);
  }
  usage(2);
}

if (!fs.existsSync(BUNDLE) || !fs.existsSync(TOOLS)) {
  console.error("knowledge/がありません。プロジェクトルートから実行してください。");
  process.exit(1);
}

function run(label, script, scriptArgs) {
  console.log(`\n==> ${label}`);
  const result = spawnSync(
    process.execPath,
    [path.join(TOOLS, script), ...scriptArgs],
    {
      cwd: ROOT,
      stdio: "inherit",
    },
  );

  if (result.error) {
    console.error(`${label}を開始できませんでした: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`${label}に失敗しました。終了コード: ${result.status ?? "不明"}`);
    process.exit(result.status ?? 1);
  }
}

if (args.has("--write")) {
  run("OKF日時精度の更新", "normalize-okf-v02-datetimes.mjs", ["--write"]);
  run("説明とファセットの更新", "refine-okf-descriptions.mjs", ["--write"]);
  run("横断ナビゲーションの更新", "build-okf-navigation.mjs", ["--write"]);
  run("退役済み出典識別子の更新", "normalize-retired-source-links.mjs", ["--write"]);
  run("矛盾監査台帳集計の更新", "audit-okf-contradictions.mjs", ["--write"]);
}

run("OKF日時精度正規化の自己試験", "normalize-okf-v02-datetimes.mjs", [
  "--self-test",
]);
run("OKF日時精度の検査", "normalize-okf-v02-datetimes.mjs", ["--check"]);
run("説明とファセットの検査", "refine-okf-descriptions.mjs", ["--check"]);
run("横断ナビゲーションの検査", "build-okf-navigation.mjs", ["--check"]);
run("退役済み出典識別子の検査", "normalize-retired-source-links.mjs", [
  "--check",
]);
run("公式OKF 0.2互換性検査", "validate-okf-v02.mjs", []);
run("RIM OKF構造検査", "validate-okf.mjs", []);

run("領域横断重複監査", "audit-okf-overlap.mjs", ["--check"]);
run("設定矛盾監査", "audit-okf-contradictions.mjs", ["--check"]);

console.log(
  `\nOKF統合保守に合格しました（${args.has("--write") ? "更新・検査" : "検査のみ"}）。`,
);
