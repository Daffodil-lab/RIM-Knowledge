import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const CASES = path.join(BUNDLE, "contradictions");
const INDEX = path.join(CASES, "index.md");
const args = new Set(process.argv.slice(2));
const unknownArgs = [...args].filter(
  (arg) => !new Set(["--write", "--check"]).has(arg),
);
const mode = args.has("--write") ? "write" : "check";
const errors = [];
const warnings = [];
const classCounts = new Map();
const stateCounts = new Map();
let concepts = 0;
let underReview = 0;
let cases = 0;
let unresolvedBlocking = 0;
const referenceReviewCounts = new Map();

if (unknownArgs.length || (args.has("--write") && args.has("--check"))) {
  console.error(
    "Usage: node knowledge/tools/audit-okf-contradictions.mjs [--write|--check]",
  );
  process.exit(2);
}

const allowedClasses = new Set([
  "hard-conflict",
  "projection-drift",
  "overhaul-divergence",
  "protected-unresolved",
  "implementation-reservation",
  "historical-difference",
]);
const allowedStates = new Set([
  "active",
  "quarantined",
  "resolved",
  "accepted-unresolved",
]);

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

function relative(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

function metadata(text) {
  const block = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] || "";
  const result = {};
  for (const line of block.split("\n")) {
    const match = line.match(/^([a-z_]+):\s*(.+)$/i);
    if (match) result[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return result;
}

if (!fs.existsSync(BUNDLE) || !fs.existsSync(CASES)) {
  console.error("knowledge/contradictions/ does not exist.");
  process.exit(1);
}

for (const file of walk(BUNDLE)) {
  if (["index.md", "log.md"].includes(path.basename(file))) continue;
  concepts += 1;
  const text = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const meta = metadata(text);

  if (meta.overhaul_state === "under-review") {
    underReview += 1;
    const expected = {
      status: "draft",
      authority: "protected-draft",
      knowledge_role: "draft-proposal",
    };
    for (const [key, value] of Object.entries(expected)) {
      if (meta[key] !== value) {
        errors.push(
          `${relative(file)}: under-review requires ${key}: ${value}`,
        );
      }
    }
  }

  if (
    meta.knowledge_role === "catalog-record" &&
    meta.canonical_scope?.startsWith("backstory-")
  ) {
    const allowedReviewStates = new Set([
      "candidate",
      "re-audit",
      "reference-only",
      "accepted",
      "rejected",
    ]);
    if (!allowedReviewStates.has(meta.reference_review)) {
      errors.push(
        `${relative(file)}: backstory catalog record requires a valid reference_review`,
      );
    } else {
      referenceReviewCounts.set(
        meta.reference_review,
        (referenceReviewCounts.get(meta.reference_review) || 0) + 1,
      );
    }
  }

  if (path.dirname(file) === CASES) {
    cases += 1;
    if (!allowedClasses.has(meta.conflict_class)) {
      errors.push(
        `${relative(file)}: invalid conflict_class ${meta.conflict_class || "(missing)"}`,
      );
    }
    if (!allowedStates.has(meta.conflict_state)) {
      errors.push(
        `${relative(file)}: invalid conflict_state ${meta.conflict_state || "(missing)"}`,
      );
    }
    if (!["true", "false"].includes(meta.blocking)) {
      errors.push(`${relative(file)}: blocking must be true or false`);
    }
    if (meta.conflict_class) {
      classCounts.set(
        meta.conflict_class,
        (classCounts.get(meta.conflict_class) || 0) + 1,
      );
    }
    if (meta.conflict_state) {
      stateCounts.set(
        meta.conflict_state,
        (stateCounts.get(meta.conflict_state) || 0) + 1,
      );
    }
    if (meta.conflict_state === "active" && meta.blocking === "true") {
      unresolvedBlocking += 1;
      errors.push(`${relative(file)}: unresolved blocking contradiction`);
    }
  }

  const isActiveCanon =
    meta.status === "stable" &&
    meta.authority === "canonical" &&
    meta.knowledge_role === "source-of-truth";
  if (
    isActiveCanon &&
    /^\|\s*種族\s*\|\s*シオン[／/]ソフェル\s*\|/m.test(text)
  ) {
    errors.push(
      `${relative(file)}: active canon conflates the Shion species with the Sofer profession`,
    );
  }
}

if (cases === 0) errors.push("no contradiction cases found");
if (underReview === 0) warnings.push("no concepts are marked under-review");

function countSummary(counts) {
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `\`${key}\` ${value}件`)
    .join("、");
}

const summary = [
  "<!-- contradiction-summary:start -->",
  `- 登録済みケース: ${cases}件`,
  `- 状態: ${countSummary(stateCounts)}`,
  `- 分類: ${countSummary(classCounts)}`,
  `- 完成を阻害する未解決矛盾: ${unresolvedBlocking}件`,
  "<!-- contradiction-summary:end -->",
].join("\n");
const indexText = fs.readFileSync(INDEX, "utf8").replace(/\r\n?/g, "\n");
const summaryPattern =
  /<!-- contradiction-summary:start -->[\s\S]*?<!-- contradiction-summary:end -->/;
const currentSummary = indexText.match(summaryPattern)?.[0];

if (!currentSummary) {
  errors.push(`${relative(INDEX)}: contradiction summary markers are missing`);
} else if (currentSummary !== summary) {
  if (mode === "write") {
    fs.writeFileSync(INDEX, indexText.replace(summaryPattern, summary), "utf8");
  } else {
    errors.push(
      `${relative(INDEX)}: contradiction summary is stale; run maintain-okf.mjs --write`,
    );
  }
}

console.log("# OKF contradiction audit");
console.log(`Concepts inspected: ${concepts}`);
console.log(`Contradiction cases: ${cases}`);
console.log(`Concepts quarantined for overhaul: ${underReview}`);
console.log(
  `Backstory reference review: ${[...referenceReviewCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join(", ")}`,
);
console.log(
  `Classes: ${[...classCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join(", ")}`,
);
console.log(
  `States: ${[...stateCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join(", ")}`,
);
if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error(`Contradiction audit failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Contradiction index summary: ${mode} passed.`);
console.log("Contradiction audit passed: no unresolved blocking contradiction.");
