import fs from "node:fs";
import path from "node:path";
import {
  ERA_ORDER,
  ORGANIZATION_LABELS,
  TOPICAL_TAGS,
  descriptionProblems,
  parseFrontmatter as parseOkfFrontmatter,
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
