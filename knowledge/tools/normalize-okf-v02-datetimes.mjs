import fs from "node:fs";
import path from "node:path";
import { toPosix, walk } from "./lib/okf-utils.mjs";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const args = new Set(process.argv.slice(2));
const allowedArgs = new Set(["--check", "--write", "--self-test"]);
const unknownArgs = [...args].filter((arg) => !allowedArgs.has(arg));

if (
  unknownArgs.length ||
  (args.has("--check") && args.has("--write")) ||
  (args.has("--self-test") && args.size > 1)
) {
  console.error(
    "使用法: node knowledge/tools/normalize-okf-v02-datetimes.mjs [--check | --write | --self-test]",
  );
  if (unknownArgs.length) console.error(`不明な引数です: ${unknownArgs.join(", ")}`);
  process.exit(2);
}

const mode = args.has("--write") ? "write" : "check";
const issues = [];
const changes = [];

function relative(file) {
  return toPosix(path.relative(ROOT, file));
}

function normalizeGeneratedBlock(file, text) {
  const end = text.indexOf("\n---\n", 4);
  if (!text.startsWith("---\n") || end < 0) return text;

  const frontmatter = text.slice(4, end);
  let updated = frontmatter.replace(
    /^([ \t]+precision:[ \t]*["']date["'])[ \t]*sources:[ \t]*$/m,
    "$1\nsources:",
  );
  const blockMatch = updated.match(/^generated:[ \t]*\n((?:[ \t]+.*(?:\n|$))*)/m);
  const inlineMatch = updated.match(/^generated:[ \t]*\{([^\n{}]*)\}[ \t]*$/m);

  if (blockMatch) {
    const block = blockMatch[1];
    const at = block.match(/^([ \t]+)at:[ \t]*["']?(\d{4}-\d{2}-\d{2})["']?[ \t]*$/m);
    const precision = block.match(
      /^([ \t]+)precision:[ \t]*["']?([^"'\s]+)["']?[ \t]*$/m,
    );
    const normalizedAt = block.match(
      /^([ \t]+)at:[ \t]*["']?(\d{4}-\d{2}-\d{2}T00:00:00Z)["']?[ \t]*$/m,
    );

    if (precision && precision[2] !== "date") {
      issues.push(`${relative(file)}: generated.precisionはdateだけを使用できます: ${precision[2]}`);
      return text;
    }
    if (precision?.[2] === "date" && !at && !normalizedAt) {
      issues.push(
        `${relative(file)}: generated.precision: dateにはYYYY-MM-DDT00:00:00Z形式のgenerated.atが必要です`,
      );
      return text;
    }
    if (at) {
      let replacement = `${at[1]}at: "${at[2]}T00:00:00Z"`;
      if (!precision) replacement += `\n${at[1]}precision: "date"`;
      const normalizedBlock = block.replace(at[0], replacement);
      updated = updated.replace(blockMatch[0], `generated:\n${normalizedBlock}`);
    }
  } else if (inlineMatch) {
    const mapping = inlineMatch[1];
    const at = mapping.match(
      /\bat:[ \t]*(?:["'](\d{4}-\d{2}-\d{2})["']|(\d{4}-\d{2}-\d{2})(?=[ \t]*(?:,|$)))/,
    );
    const precision = mapping.match(/\bprecision:\s*["']?([^,"'\s}]+)["']?/);
    const normalizedAt = mapping.match(/\bat:\s*["']?(\d{4}-\d{2}-\d{2}T00:00:00Z)["']?/);

    if (precision && precision[1] !== "date") {
      issues.push(`${relative(file)}: generated.precisionはdateだけを使用できます: ${precision[1]}`);
      return text;
    }
    if (precision?.[1] === "date" && !at && !normalizedAt) {
      issues.push(
        `${relative(file)}: generated.precision: dateにはYYYY-MM-DDT00:00:00Z形式のgenerated.atが必要です`,
      );
      return text;
    }
    if (at) {
      const date = at[1] || at[2];
      let normalizedMapping = mapping.replace(at[0], `at: "${date}T00:00:00Z"`);
      if (!precision) normalizedMapping = `${normalizedMapping.trimEnd()}, precision: "date"`;
      updated = updated.replace(inlineMatch[0], `generated: {${normalizedMapping}}`);
    }
  }

  if (updated === frontmatter) return text;
  return `${text.slice(0, 4)}${updated}${text.slice(end)}`;
}

if (args.has("--self-test")) {
  const fixturePath = path.join(ROOT, "okf-v02-datetime-self-test.md");
  const blockFixture = [
    "---",
    'type: "Reference"',
    "generated:",
    '  by: "process:test"',
    '  at: "2026-07-26"',
    "sources:",
    '  - resource: "https://example.invalid/source"',
    "---",
    "",
    "# Test",
    "",
  ].join("\n");
  const blockResult = normalizeGeneratedBlock(fixturePath, blockFixture);
  if (!blockResult.includes('  at: "2026-07-26T00:00:00Z"\n  precision: "date"\nsources:')) {
    throw new Error("ブロック形式のgeneratedと後続sourcesの境界を保持できませんでした。");
  }
  if (normalizeGeneratedBlock(fixturePath, blockResult) !== blockResult) {
    throw new Error("ブロック形式の正規化が冪等ではありません。");
  }

  const inlineFixture = [
    "---",
    'type: "Reference"',
    'generated: { by: "process:test", at: "2026-07-27" }',
    "---",
    "",
    "# Test",
    "",
  ].join("\n");
  const inlineResult = normalizeGeneratedBlock(fixturePath, inlineFixture);
  if (!inlineResult.includes('at: "2026-07-27T00:00:00Z", precision: "date"')) {
    throw new Error("インライン形式のgeneratedを正規化できませんでした。");
  }
  if (normalizeGeneratedBlock(fixturePath, inlineResult) !== inlineResult) {
    throw new Error("インライン形式の正規化が冪等ではありません。");
  }
  if (issues.length) throw new Error(`自己試験中に${issues.length}件の問題を検出しました。`);
  console.log("OKF日時精度正規化の自己試験に合格しました（ブロック、sources境界、インライン、冪等性）。");
  process.exit(0);
}

if (!fs.existsSync(BUNDLE)) {
  console.error("knowledge/がありません。プロジェクトルートから実行してください。");
  process.exit(1);
}

for (const file of walk(BUNDLE).filter((candidate) => candidate.endsWith(".md"))) {
  const basename = path.basename(file);
  if (basename === "index.md" || basename === "log.md") continue;
  const original = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const updated = normalizeGeneratedBlock(file, original);
  if (updated !== original) changes.push({ file, updated });
}

if (issues.length) {
  console.error(`OKF日時精度の正規化に失敗しました: ${issues.length}件`);
  for (const issue of issues.slice(0, 100)) console.error(`- ${issue}`);
  if (issues.length > 100) console.error(`- ほか${issues.length - 100}件`);
  process.exit(1);
}

if (mode === "write") {
  for (const change of changes) fs.writeFileSync(change.file, change.updated, "utf8");
  console.log(`日付精度を保持して${changes.length}概念のgenerated.atをISO 8601日時へ正規化しました。`);
} else if (changes.length) {
  console.error(`OKF日時精度チェックに失敗しました: 日付だけのgenerated.atが${changes.length}概念に残っています。`);
  for (const change of changes.slice(0, 30)) console.error(`- ${relative(change.file)}`);
  if (changes.length > 30) console.error(`- ほか${changes.length - 30}件`);
  console.error("修正: node knowledge/tools/normalize-okf-v02-datetimes.mjs --write");
  process.exit(1);
} else {
  console.log("OKF日時精度チェックに合格しました。日付だけのgenerated.atはありません。");
}
