import fs from "node:fs";
import path from "node:path";
import {
  ERA_ORDER,
  ORGANIZATION_LABELS,
  TOPICAL_TAGS,
  descriptionProblems,
  parseFrontmatter as parseOkfFrontmatter,
  PROJECT_SCOPE_VALUES,
  loadProjectScopeOverrides,
  readConcepts,
  resolveProjectScope,
} from "./lib/okf-utils.mjs";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const errors = [];
const warnings = [];
let conceptCount = 0;
let indexCount = 0;
let linkCount = 0;
const canonicalForOwners = new Map();
const roleCounts = new Map();
const JAPANESE_FILENAME = /[ぁ-んァ-ヶ一-龠々ー]/u;
const FROZEN_REFERENCE_AUTHORITIES = new Set([
  "reference",
  "historical",
  "catalog",
]);
const TAG_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN_CLASSIFICATION_TAGS = new Set([
  "canon",
  "canonical",
  "catalog",
  "reference",
  "protected-draft",
  "historical",
  "draft",
  "stable",
  "deprecated",
]);

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else result.push(full);
  }
  return result;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function resolveLink(file, rawTarget) {
  const target = decodeURI(rawTarget.split("#")[0].split(/\s+"/)[0]);
  if (!target || /^(?:[a-z]+:|#)/i.test(target)) return null;
  let resolved;
  if (target.startsWith("/")) {
    resolved = path.join(BUNDLE, target.slice(1));
  } else {
    resolved = path.resolve(path.dirname(file), target);
  }
  if (target.endsWith("/")) resolved = path.join(resolved, "index.md");
  return resolved;
}

if (!fs.existsSync(BUNDLE)) {
  console.error("knowledge/ does not exist. Restore the canonical knowledge bundle before validation.");
  process.exit(1);
}

let projectScopeOverrides = {};
try {
  projectScopeOverrides = loadProjectScopeOverrides(BUNDLE);
} catch (error) {
  errors.push(`project-scope overrides: ${error.message}`);
}
const scopeRecords = readConcepts(BUNDLE);
const scopePaths = new Set(scopeRecords.map((record) => record.relative));
for (const [relative, scope] of Object.entries(projectScopeOverrides)) {
  if (!scopePaths.has(relative)) errors.push(`project-scope override points to missing concept: ${relative}`);
  if (!PROJECT_SCOPE_VALUES.includes(scope)) errors.push(`project-scope override has invalid value: ${relative}=${scope}`);
}
const scopeCounts = new Map(PROJECT_SCOPE_VALUES.map((scope) => [scope, 0]));
for (const record of scopeRecords) {
  const resolution = resolveProjectScope(record, projectScopeOverrides);
  if (!resolution.scope || !PROJECT_SCOPE_VALUES.includes(resolution.scope)) {
    errors.push(`project_scope unresolved or invalid: ${record.relative} (${resolution.reason})`);
  } else {
    scopeCounts.set(resolution.scope, scopeCounts.get(resolution.scope) + 1);
  }
}
for (const [relative, expected] of Object.entries({
  "world/46-カエラヴィ.md": "caelavi",
  "world/49-帝鷲系.md": "caelavi",
  "world/58-カエルムの対同盟債務.md": "caelavi",
  "world/59-カエルムの戦争依存経済.md": "caelavi",
  "world/60-カエラヴィ個人債務.md": "caelavi",
  "world/72-カエラヴィ民族主義.md": "caelavi",
  "world/73-総力進化戦争論.md": "caelavi",
  "design/59-バニラ優先カエラヴィ種族実装境界.md": "caelavi",
  "design/60-カエラヴィ標準身体の実装仕様.md": "caelavi",
  "world/55-カエルムと同盟の初期協定.md": "shared",
  "world/67-CreditとMarkの二国間清算.md": "shared",
  "design/67-Mark・Credit・債務・税のWorld台帳.md": "caelavi",
  "world/03-シオンという人類.md": "shion",
  "design/52-バニラ優先Shion種族実装境界.md": "shion",
  "kombinat/core/12-α完成条件.md": "shion",
})) {
  const record = scopeRecords.find((candidate) => candidate.relative === relative);
  if (!record) errors.push(`project_scope representative missing: ${relative}`);
  else if (resolveProjectScope(record, projectScopeOverrides).scope !== expected) {
    errors.push(`project_scope representative mismatch: ${relative}`);
  }
}

const backstoryScopeRecords = scopeRecords.filter((record) => record.type === "Backstory Record");
if (backstoryScopeRecords.length !== 838) {
  errors.push(`project_scope backstory count is ${backstoryScopeRecords.length}; expected 838`);
}
const backstoryScopeCounts = new Map(PROJECT_SCOPE_VALUES.map((scope) => [scope, 0]));
for (const record of backstoryScopeRecords) {
  const scope = resolveProjectScope(record, projectScopeOverrides).scope;
  if (scope) backstoryScopeCounts.set(scope, backstoryScopeCounts.get(scope) + 1);
}
if ([...backstoryScopeCounts.values()].reduce((sum, count) => sum + count, 0) !== backstoryScopeRecords.length) {
  errors.push("project_scope backstory scope totals do not equal backstory count");
}
const c001 = backstoryScopeRecords.find((record) => /\/SHION_C001\.md$/.test(record.relative));
if (!c001 || resolveProjectScope(c001, projectScopeOverrides).scope !== "shion") {
  errors.push("project_scope backstory representative SHION_C001 must be shion");
}
const backstoryNavigation = path.join(BUNDLE, "navigation", "backstories", "project-scope");
for (const scope of PROJECT_SCOPE_VALUES) {
  if (!fs.existsSync(path.join(backstoryNavigation, scope, "index.md"))) {
    errors.push(`missing backstory project_scope entry page: ${scope}`);
  }
}
if (fs.existsSync(backstoryNavigation)) {
  for (const file of walk(backstoryNavigation).filter((candidate) => candidate.endsWith(".md"))) {
    const entries = fs.readFileSync(file, "utf8").match(/^[-] \[[^\]]+\]\(\/[^)]+\.md\)/gm) || [];
    if (entries.length > 80) errors.push(`backstory project_scope page exceeds 80 entries: ${rel(file)}`);
  }
}

const markdownFiles = walk(BUNDLE).filter((file) => file.endsWith(".md"));
for (const file of markdownFiles) {
  const text = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const basename = path.basename(file);
  const isReserved = basename === "index.md" || basename === "log.md";

  if (isReserved) {
    indexCount += 1;
    if (basename === "log.md" && text.startsWith("---\n")) {
      errors.push(`${rel(file)}: log.md must not have frontmatter`);
    }
    if (
      basename === "index.md" &&
      file !== path.join(BUNDLE, "index.md") &&
      text.startsWith("---\n")
    ) {
      errors.push(`${rel(file)}: nested index.md must not have frontmatter`);
    }
    if (file === path.join(BUNDLE, "index.md")) {
      const rootFrontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
      if (!rootFrontmatter || !/^okf_version:\s*"0\.2"\s*$/m.test(rootFrontmatter[1])) {
        errors.push(`${rel(file)}: root index.md must declare okf_version 0.2`);
      }
      const otherKeys = rootFrontmatter
        ? rootFrontmatter[1]
            .split("\n")
            .filter((line) => line.trim() && !/^okf_version:/.test(line))
        : [];
      if (otherKeys.length) {
        errors.push(`${rel(file)}: root index.md frontmatter has unsupported keys`);
      }
    }
  } else {
    conceptCount += 1;
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (!frontmatter) {
      errors.push(`${rel(file)}: missing parseable frontmatter delimiters`);
    } else {
      const parsedMetadata = parseOkfFrontmatter(text).metadata;
      const tags = parsedMetadata.tags;
      if (!Array.isArray(tags) || tags.length === 0) {
        errors.push(`${rel(file)}: tags must be a non-empty list`);
      } else {
        const seenTags = new Set();
        for (const tag of tags) {
          if (typeof tag !== "string" || !TAG_ID.test(tag)) {
            errors.push(`${rel(file)}: invalid topical tag ${String(tag)}`);
            continue;
          }
          if (seenTags.has(tag)) errors.push(`${rel(file)}: duplicate tag ${tag}`);
          seenTags.add(tag);
          if (!TOPICAL_TAGS.has(tag)) {
            errors.push(`${rel(file)}: unknown topical tag ${tag}`);
          }
          if (FORBIDDEN_CLASSIFICATION_TAGS.has(tag)) {
            errors.push(
              `${rel(file)}: classification tag ${tag} must use authority, status, or knowledge_role`,
            );
          }
        }
      }
      if (
        !FROZEN_REFERENCE_AUTHORITIES.has(parsedMetadata.authority) &&
        !JAPANESE_FILENAME.test(path.basename(file, ".md"))
      ) {
        errors.push(`${rel(file)}: maintained concept filename must include Japanese text`);
      }
      const type = frontmatter[1].match(/^type:\s*(.+)\s*$/m)?.[1]?.trim();
      if (!type || type === '""' || type === "''") {
        errors.push(`${rel(file)}: missing non-empty type`);
      }
      const description = parsedMetadata.description || "";
      for (const problem of descriptionProblems(description)) {
        errors.push(`${rel(file)}: invalid description (${problem})`);
      }
      for (const key of [
        "title",
        "description",
        "tags:",
        "status",
        "authority",
        "knowledge_role",
        "granularity",
        "generated:",
      ]) {
        if (!frontmatter[1].includes(key)) {
          errors.push(`${rel(file)}: missing RIM metadata key ${key}`);
        }
      }
      const role = frontmatter[1].match(/^knowledge_role:\s*(.+)\s*$/m)?.[1]?.trim();
      const authority = frontmatter[1].match(/^authority:\s*(.+)\s*$/m)?.[1]?.trim();
      const canonicalFor = frontmatter[1]
        .match(/^canonical_for:\s*(.+)\s*$/m)?.[1]
        ?.replace(/^["']|["']$/g, "")
        .trim();
      const canonicalScope = frontmatter[1]
        .match(/^canonical_scope:\s*(.+)\s*$/m)?.[1]
        ?.replace(/^["']|["']$/g, "")
        .trim();
      const ownerBlock = frontmatter[1].match(
        /^canonical_owner:\n((?:  - .+(?:\n|$))*)/m,
      )?.[1];
      const owners = ownerBlock
        ? ownerBlock
            .split("\n")
            .map((line) => line.match(/^  -\s+(.+)$/)?.[1])
            .filter(Boolean)
            .map((owner) => owner.replace(/^["']|["']$/g, ""))
        : [];
      const basisBlock = frontmatter[1].match(
        /^normative_basis:\n((?:  - .+(?:\n|$))*)/m,
      )?.[1];
      const bases = basisBlock
        ? basisBlock
            .split("\n")
            .map((line) => line.match(/^  -\s+(.+)$/)?.[1])
            .filter(Boolean)
            .map((basis) => basis.replace(/^["']|["']$/g, ""))
        : [];

      if (role) roleCounts.set(role, (roleCounts.get(role) || 0) + 1);
      const eras = Array.isArray(parsedMetadata.eras) ? parsedMetadata.eras : [];
      const organizationGroups = Array.isArray(
        parsedMetadata.organization_groups,
      )
        ? parsedMetadata.organization_groups
        : [];
      for (const era of eras) {
        if (!ERA_ORDER.includes(era)) {
          errors.push(`${rel(file)}: unknown era facet ${era}`);
        }
      }
      for (const group of organizationGroups) {
        if (!Object.hasOwn(ORGANIZATION_LABELS, group)) {
          errors.push(`${rel(file)}: unknown organization group ${group}`);
        }
      }
      if (
        role === "catalog-record" &&
        /^reference\/backstories\/(?:formation|mastery)\//.test(
          rel(file).replace(/^knowledge\//, ""),
        ) &&
        eras.length !== 1
      ) {
        errors.push(`${rel(file)}: backstory record must declare exactly one era`);
      }
      if (["summary", "projection"].includes(role) && owners.length === 0) {
        errors.push(`${rel(file)}: ${role} must declare canonical_owner`);
      }
      if (
        !["summary", "reference", "draft-proposal"].includes(role) &&
        !canonicalFor
      ) {
        errors.push(`${rel(file)}: ${role} must declare canonical_for`);
      }
      if (!["reference", "draft-proposal"].includes(role) && !canonicalScope) {
        errors.push(`${rel(file)}: ${role} must declare canonical_scope`);
      }
      if (role === "source-of-truth" && authority !== "canonical") {
        errors.push(`${rel(file)}: source-of-truth must have canonical authority`);
      }
      if (role === "summary" && authority !== "reference") {
        errors.push(`${rel(file)}: summary must have reference authority`);
      }
      if (
        (authority === "historical" || role === "historical-record") &&
        !(authority === "historical" && role === "historical-record")
      ) {
        errors.push(
          `${rel(file)}: historical authority and historical-record role must be paired`,
        );
      }
      if (parsedMetadata.type === "Historical Record") {
        if (
          authority !== "historical" ||
          role !== "historical-record" ||
          parsedMetadata.content_mode !== "history"
        ) {
          errors.push(
            `${rel(file)}: Historical Record requires historical authority, historical-record role, and history content_mode`,
          );
        }
      }
      if (
        parsedMetadata.type === "Protected Draft" &&
        !(
          parsedMetadata.status === "draft" &&
          authority === "protected-draft" &&
          role === "draft-proposal"
        )
      ) {
        errors.push(
          `${rel(file)}: Protected Draft requires draft status, protected-draft authority, and draft-proposal role`,
        );
      }
      if (canonicalFor) {
        if (!canonicalForOwners.has(canonicalFor)) canonicalForOwners.set(canonicalFor, []);
        canonicalForOwners.get(canonicalFor).push(rel(file));
      }
      for (const owner of owners) {
        const resolvedOwner = owner.startsWith("/")
          ? path.join(BUNDLE, owner.slice(1))
          : path.resolve(path.dirname(file), owner);
        if (!fs.existsSync(resolvedOwner)) {
          errors.push(`${rel(file)}: missing canonical_owner ${owner}`);
        }
      }
      for (const basis of bases) {
        const resolvedBasis = basis.startsWith("/")
          ? path.join(BUNDLE, basis.slice(1))
          : path.resolve(path.dirname(file), basis);
        if (!fs.existsSync(resolvedBasis)) {
          errors.push(`${rel(file)}: missing normative_basis ${basis}`);
        }
      }
    }
    if (!text.includes("\n## 関連項目\n")) {
      errors.push(`${rel(file)}: missing related-items section`);
    }
  }

  const links = [...text.matchAll(/\]\(([^)]+)\)/g)];
  for (const match of links) {
    const rawTarget = match[1];
    const resolved = resolveLink(file, rawTarget);
    if (!resolved) continue;
    linkCount += 1;
    if (!fs.existsSync(resolved)) {
      errors.push(`${rel(file)}: broken link ${rawTarget}`);
    }
  }
}

const conceptPaths = new Set();
for (const file of markdownFiles) {
  const basename = path.basename(file);
  if (basename === "index.md" || basename === "log.md") continue;
  const id = path.relative(BUNDLE, file).replace(/\\/g, "/").replace(/\.md$/, "");
  if (conceptPaths.has(id)) errors.push(`duplicate concept id: ${id}`);
  conceptPaths.add(id);
}

for (const [subject, owners] of canonicalForOwners) {
  if (owners.length > 1) {
    errors.push(`canonical_for ${subject} has multiple owners: ${owners.join(", ")}`);
  }
}

const generatedOverviews = markdownFiles.filter(
  (file) =>
    path.basename(file) === "00-overview.md" &&
    !path
      .relative(BUNDLE, file)
      .split(path.sep)
      .join("/")
      .startsWith("reference/backstories/"),
);
if (generatedOverviews.length) {
  errors.push(
    `redundant generated overview files remain: ${generatedOverviews
      .map((file) => rel(file))
      .join(", ")}`,
  );
}

const backstories = [...conceptPaths].filter((id) =>
  /^reference\/backstories\/(?:formation|mastery)\/SHION_[CA]\d{3}$/.test(id),
);
if (backstories.length !== 838) {
  errors.push(`backstory count is ${backstories.length}; expected 838`);
}

if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (errors.length) {
  console.error(`OKF validation failed with ${errors.length} error(s):`);
  errors.slice(0, 100).forEach((error) => console.error(`- ${error}`));
  if (errors.length > 100) console.error(`... ${errors.length - 100} more`);
  process.exit(1);
}

console.log(
  `OKF validation passed: ${conceptCount} concepts, ${indexCount} reserved files, ${linkCount} checked links, ${backstories.length} backstories.`,
);
console.log(
  `Knowledge roles: ${[...roleCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([role, count]) => `${role}=${count}`)
    .join(", ")}`,
);
console.log(
  `Project scope: ${[...scopeCounts.entries()]
    .map(([scope, count]) => `${scope}=${count}`)
    .join(", ")} (total=${[...scopeCounts.values()].reduce((sum, count) => sum + count, 0)}).`,
);
console.log(
  `Backstory project scope: ${[...backstoryScopeCounts.entries()]
    .map(([scope, count]) => `${scope}=${count}`)
    .join(", ")} (total=${backstoryScopeRecords.length}).`,
);
