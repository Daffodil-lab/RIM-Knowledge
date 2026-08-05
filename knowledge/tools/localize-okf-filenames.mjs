import fs from "node:fs";
import path from "node:path";
import { parseFrontmatter } from "./lib/okf-utils.mjs";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const args = new Set(process.argv.slice(2));
const allowedArgs = new Set(["--write", "--check", "--plan"]);
const unknownArgs = [...args].filter((arg) => !allowedArgs.has(arg));
const mode = args.has("--write")
  ? "write"
  : args.has("--plan")
    ? "plan"
    : "check";
const JAPANESE = /[ぁ-んァ-ヶ一-龠々ー]/u;
const TEXT_EXTENSIONS = new Set([".md", ".mjs", ".js", ".json", ".yml", ".yaml", ".txt"]);
const MAX_BASENAME_LENGTH = 120;
const MAX_SUFFIX_LENGTH = 32;

if (unknownArgs.length || args.size !== 1) {
  console.error(
    "使用法: node knowledge/tools/localize-okf-filenames.mjs --write|--check|--plan",
  );
  process.exit(2);
}

if (!fs.existsSync(BUNDLE)) {
  console.error("knowledge/がありません。プロジェクトルートから実行してください。");
  process.exit(1);
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function bundleRelative(file) {
  return path.relative(BUNDLE, file).split(path.sep).join("/");
}

function isConcept(file) {
  if (path.extname(file) !== ".md") return false;
  if (["index.md", "log.md"].includes(path.basename(file))) return false;
  return bundleRelative(file).split("/")[0] !== "navigation";
}

function fallbackSuffix(record, relative) {
  const title = String(record.metadata.title || "");
  const basename = path.basename(relative, ".md");
  const exact = [
    [/Definition(?:-| )of(?:-| )Done/i, "完成条件"],
    [/Release(?:-| )Gate/i, "公開判定"],
    [/\bUI\b/i, "操作画面"],
    [/\bStasis\b/i, "保管中時間進行"],
    [/\bEphemeral Pawn\b/i, "一時個体"],
    [/\bRegistered Individual\b/i, "登録個体"],
    [/\bSaved Pawn Design\b/i, "保存個体設計"],
    [/\bClone Colony\b/i, "複製個体コロニー"],
    [/\bClone\b/i, "複製個体"],
    [/\bID\b/i, "識別子"],
    [/\bThe Hive\b/i, "ザ・ハイヴ"],
    [/\bCell\b/i, "セル"],
    [/\bImperialPeak\b/i, "帝国最盛期"],
    [/\bImperialCivilWar\b/i, "帝国内戦"],
    [/\bPostCivilWarEmpire\b/i, "内戦後帝国"],
    [/\bRevolutionaryWar\b/i, "革命戦争"],
    [/\bLongTransition\b/i, "長期移行期"],
    [/\bModernUnion\b/i, "現代同盟"],
    [/^\s*(?:13[.]?\s*)?β\s*$/i, "ベータ版"],
  ];
  for (const [pattern, suffix] of exact) {
    if (pattern.test(`${title} ${basename}`)) return suffix;
  }

  const [domain, collection] = relative.split("/");
  if (domain === "research") {
    const labels = {
      "anomaly-monolith": "異常モノリス参考",
      "archotech-ruins": "アルコテック遺跡参考",
      "endfield-aic": "エンドフィールド工業参考",
      "external-videos": "外部映像参考",
      fleshbeast: "フレッシュビースト参考",
      "known-code": "既知コード参考",
      "kombinat-prototype": "コンビナート試作参考",
      "monolyn-practice": "モノリン運用参考",
      "monolyn-ui": "モノリン操作画面参考",
      "reference-mods": "参考MOD調査",
    };
    return labels[collection] || "参考資料";
  }
  if (domain === "decisions") return "決定記録";
  if (domain === "backstories") {
    return collection === "formation" ? "形成記録" : "熟達記録";
  }

  const labels = {
    requirement: "要件",
    verification: "検証",
    reference: "参考資料",
    "historical-record": "履歴記録",
    "source-of-truth": "現行仕様",
    governance: "運用規則",
    "catalog-record": "参考記録",
    "catalog-guide": "参考案内",
    summary: "参照案内",
    projection: "表示資料",
    "draft-proposal": "保護案",
  };
  return labels[record.metadata.knowledge_role] || "資料";
}

function japaneseSuffix(record, relative) {
  const title = String(record.metadata.title || "").normalize("NFC");
  const pieces = title.match(/[ぁ-んァ-ヶ一-龠々ー]+/gu) || [];
  let suffix = pieces.join("-");
  if (!suffix) suffix = fallbackSuffix(record, relative);
  suffix = suffix
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .normalize("NFC");

  const oldBase = path.basename(relative, ".md");
  const available = Math.max(
    2,
    Math.min(MAX_SUFFIX_LENGTH, MAX_BASENAME_LENGTH - oldBase.length - 1),
  );
  if ([...suffix].length > available) {
    suffix = [...suffix].slice(0, available).join("").replace(/-+$/g, "");
  }
  if (!JAPANESE.test(suffix)) suffix = fallbackSuffix(record, relative);
  return suffix;
}

function buildPlan() {
  const planned = [];
  for (const file of walk(BUNDLE).filter(isConcept)) {
    const basename = path.basename(file, ".md");
    if (JAPANESE.test(basename)) continue;
    const text = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
    const record = parseFrontmatter(text);
    const relative = bundleRelative(file);
    const suffix = japaneseSuffix(record, relative);
    const target = path.join(path.dirname(file), `${basename}-${suffix}.md`);
    planned.push({
      file,
      target,
      oldRelative: relative,
      newRelative: bundleRelative(target),
    });
  }
  return planned.sort((a, b) => a.oldRelative.localeCompare(b.oldRelative));
}

function replaceAll(text, before, after) {
  return before && before !== after ? text.split(before).join(after) : text;
}

function rewriteMarkdownLinks(text, sourceFile, targetByAbsolute) {
  return text.replace(/\]\(([^)]+)\)/g, (whole, raw) => {
    const titled = raw.match(/^(.*?)(\s+"[^"]*")$/);
    const targetAndFragment = titled ? titled[1] : raw;
    const linkTitle = titled ? titled[2] : "";
    const hashIndex = targetAndFragment.indexOf("#");
    const rawTarget = hashIndex >= 0
      ? targetAndFragment.slice(0, hashIndex)
      : targetAndFragment;
    const fragment = hashIndex >= 0 ? targetAndFragment.slice(hashIndex) : "";
    if (!rawTarget || /^(?:[a-z]+:|#)/i.test(rawTarget)) return whole;

    let decoded;
    try {
      decoded = decodeURI(rawTarget);
    } catch {
      return whole;
    }
    const resolved = decoded.startsWith("/")
      ? path.join(BUNDLE, decoded.slice(1))
      : path.resolve(path.dirname(sourceFile), decoded);
    const replacement = targetByAbsolute.get(path.resolve(resolved).toLowerCase());
    if (!replacement) return whole;

    let nextTarget;
    if (decoded.startsWith("/")) {
      nextTarget = `/${bundleRelative(replacement)}`;
    } else {
      nextTarget = path.relative(path.dirname(sourceFile), replacement).split(path.sep).join("/");
      if (decoded.startsWith("./") && !nextTarget.startsWith(".")) {
        nextTarget = `./${nextTarget}`;
      }
    }
    if (rawTarget.includes("%")) nextTarget = encodeURI(nextTarget);
    return `](${nextTarget}${fragment}${linkTitle})`;
  });
}

function rewriteTextFiles(plan) {
  const targetByAbsolute = new Map(
    plan.map((item) => [path.resolve(item.file).toLowerCase(), item.target]),
  );
  const variants = plan
    .flatMap((item) => {
      const oldEncoded = encodeURI(item.oldRelative);
      const newEncoded = encodeURI(item.newRelative);
      return [
        [`/${item.oldRelative}`, `/${item.newRelative}`],
        [`knowledge/${item.oldRelative}`, `knowledge/${item.newRelative}`],
        [`/${oldEncoded}`, `/${newEncoded}`],
        [`knowledge/${oldEncoded}`, `knowledge/${newEncoded}`],
      ];
    })
    .sort((a, b) => b[0].length - a[0].length);

  let updated = 0;
  for (const file of walk(BUNDLE).filter((candidate) =>
    TEXT_EXTENSIONS.has(path.extname(candidate)),
  )) {
    const original = fs.readFileSync(file, "utf8");
    let next = rewriteMarkdownLinks(original, file, targetByAbsolute);
    for (const [before, after] of variants) {
      next = replaceAll(next, before, after);
    }
    if (next !== original) {
      fs.writeFileSync(file, next, "utf8");
      updated += 1;
    }
  }
  return updated;
}

const plan = buildPlan();
const targets = new Set();
const errors = [];
for (const item of plan) {
  const key = path.resolve(item.target).toLowerCase();
  if (targets.has(key)) errors.push(`改名先が重複: ${item.newRelative}`);
  targets.add(key);
  if (fs.existsSync(item.target) && path.resolve(item.target) !== path.resolve(item.file)) {
    errors.push(`改名先が既に存在: ${item.newRelative}`);
  }
  if (!JAPANESE.test(path.basename(item.target))) {
    errors.push(`日本語を含まない改名先: ${item.newRelative}`);
  }
}

if (errors.length) {
  console.error(`日本語ファイル名計画に${errors.length}件の問題があります。`);
  errors.slice(0, 100).forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

if (mode === "plan") {
  console.log(`日本語を追加する概念ファイル: ${plan.length}件`);
  const samples = new Map();
  for (const item of plan) {
    const domain = item.oldRelative.split("/")[0];
    if (!samples.has(domain)) samples.set(domain, []);
    if (samples.get(domain).length < 8) samples.get(domain).push(item);
  }
  for (const [domain, items] of samples) {
    console.log(`\n[${domain}]`);
    items.forEach((item) =>
      console.log(`- ${item.oldRelative} -> ${item.newRelative}`),
    );
  }
  process.exit(0);
}

if (mode === "check") {
  if (plan.length) {
    console.error(`日本語を含まない概念ファイル名が${plan.length}件あります。`);
    plan.slice(0, 40).forEach((item) => console.error(`- ${item.oldRelative}`));
    if (plan.length > 40) console.error(`... 残り${plan.length - 40}件`);
    process.exit(1);
  }
  console.log("概念ファイル名の日本語併記チェックに合格しました。");
  process.exit(0);
}

const updatedTextFiles = rewriteTextFiles(plan);
for (const item of plan) fs.renameSync(item.file, item.target);
console.log(
  `概念ファイル${plan.length}件へ日本語名を追加し、参照元${updatedTextFiles}ファイルを更新しました。`,
);
