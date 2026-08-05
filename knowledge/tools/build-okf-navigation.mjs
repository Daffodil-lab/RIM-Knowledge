import fs from "node:fs";
import path from "node:path";
import {
  ERA_LABELS,
  ERA_ORDER,
  ORGANIZATION_LABELS,
  TOPIC_DEFINITIONS,
  readConcepts,
  recordTopics,
  toPosix,
  walk,
} from "./lib/okf-utils.mjs";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const NAVIGATION = path.join(BUNDLE, "navigation");
const PAGE_SIZE = 80;
const mode = process.argv.includes("--write")
  ? "write"
  : process.argv.includes("--check")
    ? "check"
    : null;

if (!mode) {
  console.error("Usage: node knowledge/tools/build-okf-navigation.mjs --write|--check");
  process.exit(2);
}

const records = readConcepts(BUNDLE).map((record) => ({
  ...record,
  topics: recordTopics(record),
}));
const output = new Map();
const managedIndexes = new Map();

function slug(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "other";
}

function entry(record, options = {}) {
  const details = options.showOrganizations && record.organizationNames.length
    ? ` （${record.organizationNames.join(" / ")}）`
    : "";
  return `- [${record.title}](/${encodeURI(record.relative)}) — ${record.description}${details}`;
}

function put(relative, lines) {
  output.set(toPosix(relative), `${lines.join("\n").trimEnd()}\n`);
}

function chunks(values, size = PAGE_SIZE) {
  const result = [];
  for (let index = 0; index < values.length; index += size) {
    result.push(values.slice(index, index + size));
  }
  return result;
}

function renderRecordSet(base, title, values, options = {}) {
  const sorted = [...values].sort((left, right) =>
    left.relative.localeCompare(right.relative, "ja"),
  );
  const pages = chunks(sorted);
  if (pages.length <= 1) {
    put(`${base}/index.md`, [
      `# ${title}`,
      "",
      `${sorted.length}件。`,
      "",
      "## 項目",
      "",
      ...sorted.map((record) => entry(record, options)),
    ]);
    return;
  }
  const hub = [
    `# ${title}`,
    "",
    `${sorted.length}件を${PAGE_SIZE}件以下の小索引へ分割しています。`,
    "",
    "## 小索引",
    "",
  ];
  pages.forEach((page, index) => {
    const number = String(index + 1).padStart(2, "0");
    const first = page[0].title;
    const last = page.at(-1).title;
    hub.push(
      `- [${number}: ${first}〜${last}](${number}/) — ${page.length}件`,
    );
    put(`${base}/${number}/index.md`, [
      `# ${title} ${number}`,
      "",
      `範囲: ${first}〜${last}`,
      "",
      "## 項目",
      "",
      ...page.map((record) => entry(record, options)),
    ]);
  });
  put(`${base}/index.md`, hub);
}

function groupBy(values, selector) {
  const groups = new Map();
  for (const value of values) {
    const keys = selector(value);
    for (const key of Array.isArray(keys) ? keys : [keys]) {
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(value);
    }
  }
  return groups;
}

function renderFacetDimension(base, title, groups, labels, order, options = {}) {
  const keys = order
    ? [...order].filter((key) => groups.has(key))
    : [...groups.keys()].sort((a, b) =>
        (labels[a] || a).localeCompare(labels[b] || b, "ja"),
      );
  const hub = [`# ${title}`, "", "## 小索引", ""];
  for (const key of keys) {
    const label = labels[key] || key;
    const values = groups.get(key);
    const target = `${base}/${slug(key)}`;
    hub.push(`- [${label}](${slug(key)}/) — ${values.length}件`);
    renderRecordSet(target, label, values, options);
  }
  put(`${base}/index.md`, hub);
}

const eraGroups = groupBy(records, (record) => record.eras);
renderFacetDimension(
  "era",
  "時代別索引",
  eraGroups,
  ERA_LABELS,
  ERA_ORDER,
);

const organizationGroups = groupBy(
  records,
  (record) => record.organizationGroups,
);
renderFacetDimension(
  "organization",
  "組織別索引",
  organizationGroups,
  ORGANIZATION_LABELS,
  Object.keys(ORGANIZATION_LABELS),
  { showOrganizations: true },
);

const topicLabels = Object.fromEntries(
  TOPIC_DEFINITIONS.map((topic) => [topic.id, topic.label]),
);
topicLabels.other = "その他・領域固有";
const topicGroups = groupBy(records, (record) => record.topics);
renderFacetDimension(
  "subject",
  "主題別索引",
  topicGroups,
  topicLabels,
  [...TOPIC_DEFINITIONS.map((topic) => topic.id), "other"],
);

const lifecycleGroups = groupBy(records, (record) => record.metadata.status);
const authorityGroups = groupBy(records, (record) => record.metadata.authority);
const referenceReviewGroups = groupBy(
  records.filter((record) => record.metadata.reference_review),
  (record) => record.metadata.reference_review,
);
const overhaulGroups = groupBy(
  records.filter((record) => record.metadata.overhaul_state),
  (record) => record.metadata.overhaul_state,
);
renderFacetDimension(
  "state/lifecycle",
  "ライフサイクル別索引",
  lifecycleGroups,
  {},
);
renderFacetDimension(
  "state/authority",
  "権威別索引",
  authorityGroups,
  {},
);
renderFacetDimension(
  "state/reference-review",
  "参考審査状態別索引",
  referenceReviewGroups,
  {},
);
renderFacetDimension(
  "state/overhaul",
  "オーバーホール状態別索引",
  overhaulGroups,
  {},
);
put("state/index.md", [
  "# 状態別索引",
  "",
  "- [ライフサイクル](lifecycle/)",
  "- [権威](authority/)",
  "- [参考審査状態](reference-review/)",
  "- [オーバーホール状態](overhaul/)",
]);

const overhaulStates = {
  candidate: records.filter(
    (record) => record.metadata.reference_review === "candidate",
  ),
  "re-audit": records.filter(
    (record) => record.metadata.reference_review === "re-audit",
  ),
  "under-review": records.filter(
    (record) => record.metadata.overhaul_state === "under-review",
  ),
};
const overhaulLabels = {
  candidate: "candidate（参考候補）",
  "re-audit": "re-audit（参考再監査）",
  "under-review": "under-review（オーバーホール中）",
};

function renderOverhaulState(state, values) {
  const base = `overhaul/${state}`;
  renderRecordSet(`${base}/all`, overhaulLabels[state], values);
  const eras = groupBy(values, (record) => record.eras);
  const organizations = groupBy(values, (record) => record.organizationGroups);
  const topics = groupBy(values, (record) => record.topics);
  renderFacetDimension(
    `${base}/era`,
    `${overhaulLabels[state]}・時代別`,
    eras,
    ERA_LABELS,
    ERA_ORDER,
  );
  renderFacetDimension(
    `${base}/organization`,
    `${overhaulLabels[state]}・組織別`,
    organizations,
    ORGANIZATION_LABELS,
    Object.keys(ORGANIZATION_LABELS),
    { showOrganizations: true },
  );
  renderFacetDimension(
    `${base}/subject`,
    `${overhaulLabels[state]}・主題別`,
    topics,
    topicLabels,
    [...TOPIC_DEFINITIONS.map((topic) => topic.id), "other"],
  );
  const domainCounts = [...groupBy(values, (record) => record.relative.split("/")[0])]
    .map(([domain, domainRecords]) => [domain, domainRecords.length])
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  put(`${base}/index.md`, [
    `# ${overhaulLabels[state]}`,
    "",
    `${values.length}件。`,
    "",
    "## 絞り込み",
    "",
    "- [全件](all/)",
    "- [時代別](era/)",
    "- [組織別](organization/)",
    "- [主題別](subject/)",
    "",
    "## 領域別内訳",
    "",
    "| 領域 | 件数 |",
    "|---|---:|",
    ...domainCounts.map(([domain, count]) => `| ${domain} | ${count} |`),
  ]);
}

for (const [state, values] of Object.entries(overhaulStates)) {
  renderOverhaulState(state, values);
}

put("overhaul/index.md", [
  "# 改稿ダッシュボード",
  "",
  "採用判断または再設計が必要な三状態だけを表示します。",
  "",
  "## 現在の件数",
  "",
  "| 状態 | 件数 |",
  "|---|---:|",
  ...Object.entries(overhaulStates).map(
    ([state, values]) =>
      `| [${overhaulLabels[state]}](${state}/) | ${values.length} |`,
  ),
]);

const byDirectory = groupBy(records, (record) =>
  path.posix.dirname(record.relative),
);
for (const [directory, values] of byDirectory) {
  if (values.length <= PAGE_SIZE) continue;
  const collectionBase = `collection/${slug(directory)}`;
  renderRecordSet(
    collectionBase,
    `${directory} 小索引`,
    values,
  );
  const existingPath = path.join(BUNDLE, directory, "index.md");
  if (!fs.existsSync(existingPath)) continue;
  const existing = fs.readFileSync(existingPath, "utf8").replace(/\r\n?/g, "\n");
  const title = existing.match(/^#\s+(.+)$/m)?.[1] || directory;
  const relativeTarget = toPosix(
    path.relative(path.dirname(existingPath), path.join(NAVIGATION, collectionBase)),
  );
  const crossLinks = [
    "- [時代別索引](/navigation/era/)",
    "- [組織別索引](/navigation/organization/)",
    "- [状態別索引](/navigation/state/)",
    "- [主題別索引](/navigation/subject/)",
  ];
  managedIndexes.set(
    existingPath,
    [
      `# ${title}`,
      "",
      `${values.length}件を${PAGE_SIZE}件以下の小索引へ分割しています。概念ファイルのURLは変更していません。`,
      "",
      "## 小索引",
      "",
      `- [ID・ファイル順の小索引](${encodeURI(relativeTarget)}/)`,
      "",
      "## 横断ビュー",
      "",
      ...crossLinks,
      "",
    ].join("\n"),
  );
}

function refreshedIndex(file) {
  const original = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const indexDirectory = path.dirname(file);
  return original.replace(
    /^-\s+\[([^\]]+)\]\(([^)]+)\)\s+—\s+(.*)$/gm,
    (whole, label, rawTarget, summary) => {
      if (/^(?:[a-z]+:|#)/i.test(rawTarget)) return whole;
      const target = decodeURI(rawTarget.split("#")[0]);
      const resolved = target.startsWith("/")
        ? path.join(BUNDLE, target.slice(1))
        : path.resolve(indexDirectory, target);
      if (
        /^\d+件$/.test(summary.trim()) &&
        fs.existsSync(resolved) &&
        fs.statSync(resolved).isDirectory()
      ) {
        const prefix = `${path.resolve(resolved)}${path.sep}`;
        const count = records.filter((candidate) => candidate.file.startsWith(prefix)).length;
        return `- [${label}](${rawTarget}) — ${count}件`;
      }
      const record = records.find((candidate) => candidate.file === resolved);
      if (!record) return whole;
      return `- [${record.title}](${rawTarget}) — ${record.description}`;
    },
  );
}

for (const file of walk(BUNDLE).filter(
  (candidate) =>
    path.basename(candidate) === "index.md" &&
    !toPosix(path.relative(BUNDLE, candidate)).startsWith("navigation/") &&
    !managedIndexes.has(candidate),
)) {
  const refreshed = refreshedIndex(file);
  const current = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  if (refreshed !== current) managedIndexes.set(file, refreshed);
}

put("index.md", [
  "# 横断ナビゲーション",
  "",
  "荷札から自動生成した派生ビューです。ここに現行事実の正本は置きません。",
  "",
  "- [改稿ダッシュボード](overhaul/)",
  "- [時代別索引](era/)",
  "- [組織別索引](organization/)",
  "- [状態別索引](state/)",
  "- [主題別索引](subject/)",
  "- [長大領域の小索引](collection/)",
]);

const collectionEntries = [...byDirectory]
  .filter(([, values]) => values.length > PAGE_SIZE)
  .sort((a, b) => a[0].localeCompare(b[0], "ja"));
put("collection/index.md", [
  "# 長大領域の小索引",
  "",
  ...collectionEntries.map(
    ([directory, values]) =>
      `- [${directory}](${slug(directory)}/) — ${values.length}件`,
  ),
]);

const expectedNavigation = new Map(
  [...output].map(([relative, content]) => [
    path.join(NAVIGATION, ...relative.split("/")),
    content,
  ]),
);
const errors = [];

if (mode === "write") {
  const resolvedNavigation = path.resolve(NAVIGATION);
  const resolvedBundle = path.resolve(BUNDLE);
  if (
    resolvedNavigation === resolvedBundle ||
    !resolvedNavigation.startsWith(`${resolvedBundle}${path.sep}`)
  ) {
    throw new Error(`Refusing to replace unsafe navigation path: ${resolvedNavigation}`);
  }
  if (fs.existsSync(resolvedNavigation)) {
    fs.rmSync(resolvedNavigation, { recursive: true, force: true });
  }
  for (const [file, content] of expectedNavigation) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, "utf8");
  }
  for (const [file, content] of managedIndexes) {
    fs.writeFileSync(file, content, "utf8");
  }
} else {
  const actualFiles = fs.existsSync(NAVIGATION)
    ? walk(NAVIGATION).filter((file) => file.endsWith(".md"))
    : [];
  const expectedFiles = new Set(expectedNavigation.keys());
  for (const file of actualFiles) {
    if (!expectedFiles.has(file)) errors.push(`unexpected navigation file: ${file}`);
  }
  for (const [file, content] of expectedNavigation) {
    if (!fs.existsSync(file)) {
      errors.push(`missing navigation file: ${file}`);
    } else if (fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n") !== content) {
      errors.push(`stale navigation file: ${file}`);
    }
  }
  for (const [file, content] of managedIndexes) {
    if (fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n") !== content) {
      errors.push(`stale managed index: ${file}`);
    }
  }
}

for (const [file, content] of expectedNavigation) {
  if ((content.match(/^-\s+\[[^\]]+\]\(\/[^)]+\.md\)/gm) || []).length > PAGE_SIZE) {
    errors.push(`page exceeds ${PAGE_SIZE} concept entries: ${file}`);
  }
}

const eraBackstories = records.filter(
  (record) =>
    /^reference\/backstories\/(?:formation|mastery)\/SHION_[CA]\d{3}\.md$/.test(
      record.relative,
    ),
);
if (
  eraBackstories.length !== 838 ||
  eraBackstories.some((record) => record.eras.length !== 1)
) {
  errors.push(
    `backstory era coverage invalid: ${eraBackstories.length} records, ` +
      `${eraBackstories.filter((record) => record.eras.length === 1).length} with one era`,
  );
}

for (const record of records) {
  if (!record.topics.length) errors.push(`concept has no subject: ${record.relative}`);
}

if (errors.length) {
  console.error(`Navigation ${mode} failed with ${errors.length} error(s):`);
  errors.slice(0, 100).forEach((error) => console.error(`- ${error}`));
  if (errors.length > 100) console.error(`... ${errors.length - 100} more`);
  process.exit(1);
}

console.log(
  `Navigation ${mode} passed: ${expectedNavigation.size} generated indexes, ` +
    `${managedIndexes.size} refreshed source indexes, ${records.length} concepts.`,
);
console.log(
  `Overhaul dashboard: candidate=${overhaulStates.candidate.length}, ` +
    `re-audit=${overhaulStates["re-audit"].length}, ` +
    `under-review=${overhaulStates["under-review"].length}.`,
);
