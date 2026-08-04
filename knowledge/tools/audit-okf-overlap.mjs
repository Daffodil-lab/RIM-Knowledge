import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const unknownArgs = [...args].filter((arg) => arg !== "--check");
if (unknownArgs.length) {
  console.error(`不明な引数です: ${unknownArgs.join(", ")}`);
  console.error("使用法: node knowledge/tools/audit-okf-overlap.mjs [--check]");
  process.exit(2);
}

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const INCLUDED_ROOTS = new Set([
  "world",
  "design",
  "roadmap",
  "colony",
  "kombinat",
  "pawn",
  "authoring",
  "player-facing",
  "integrations",
  "characters",
]);

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".md") && !["index.md", "log.md"].includes(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split("\n")) {
    const item = line.match(/^([a-z_]+):\s*(.+)$/i);
    if (!item) continue;
    result[item[1]] = item[2].replace(/^["']|["']$/g, "");
  }
  return result;
}

function parseListField(text, key) {
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] || "";
  const block = frontmatter.match(
    new RegExp(`^${key}:\\n((?:  - .+(?:\\n|$))*)`, "m"),
  )?.[1];
  if (!block) return [];
  return block
    .split("\n")
    .map((line) => line.match(/^  -\s+(.+)$/)?.[1])
    .filter(Boolean)
    .map((value) => value.replace(/^["']|["']$/g, ""));
}

function normalize(text) {
  const body = text
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .split(/\n## 関連項目\n/)[0]
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_>#|:\-–—―・。、，．！？!?（）()[\]{}「」『』【】\s]/g, "")
    .toLowerCase();
  return body;
}

function shingles(text, width = 7) {
  const values = new Set();
  if (text.length < width) return values;
  for (let i = 0; i <= text.length - width; i += 1) {
    values.add(text.slice(i, i + width));
  }
  return values;
}

function containment(left, right) {
  if (!left.size || !right.size) return 0;
  const smaller = left.size <= right.size ? left : right;
  const larger = left.size <= right.size ? right : left;
  let common = 0;
  for (const item of smaller) {
    if (larger.has(item)) common += 1;
  }
  return common / smaller.size;
}

const records = walk(BUNDLE)
  .map((file) => {
    const relative = path.relative(BUNDLE, file).replace(/\\/g, "/");
    const domain = relative.split("/")[0];
    const text = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
    const metadata = parseFrontmatter(text);
    const normalized = normalize(text);
    return {
      file,
      relative,
      domain,
      title: metadata.title || relative,
      authority: metadata.authority || "",
      normativeBasis: parseListField(text, "normative_basis"),
      normalized,
      shingles: shingles(normalized),
    };
  })
  .filter(
    (record) =>
      INCLUDED_ROOTS.has(record.domain) &&
      record.normalized.length >= 120 &&
      record.authority !== "historical",
  );

const matches = [];
for (let i = 0; i < records.length; i += 1) {
  for (let j = i + 1; j < records.length; j += 1) {
    const left = records[i];
    const right = records[j];
    if (left.domain === right.domain) continue;
    const controlled =
      left.normativeBasis.includes(`/${right.relative}`) ||
      right.normativeBasis.includes(`/${left.relative}`);
    if (controlled) continue;
    const score = containment(left.shingles, right.shingles);
    if (score >= 0.3) matches.push({ left, right, score });
  }
}

matches.sort((a, b) => b.score - a.score);

console.log(`# Cross-domain overlap audit`);
console.log(`Concepts inspected: ${records.length}`);
console.log(`Pairs at or above 30% containment: ${matches.length}`);
console.log("");

for (const match of matches.slice(0, 80)) {
  console.log(
    `${(match.score * 100).toFixed(1)}%\t${match.left.relative}\t${match.right.relative}`,
  );
}

if (args.has("--check") && matches.length > 0) {
  console.error("領域横断重複監査に失敗しました: 30%以上の包含ペアが残っています。");
  process.exit(1);
}
