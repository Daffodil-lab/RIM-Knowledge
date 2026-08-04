import fs from "node:fs";
import path from "node:path";
import {
  GENERIC_DESCRIPTION_PATTERNS,
  deriveDescription,
  deriveFacets,
  descriptionProblems,
  parseFrontmatter,
  readConcepts,
  setListField,
  setScalarField,
} from "./lib/okf-utils.mjs";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const OVERRIDES_PATH = path.join(ROOT, "tools", "description-overrides.json");
const mode = process.argv.includes("--write")
  ? "write"
  : process.argv.includes("--check")
    ? "check"
    : null;

if (!mode) {
  console.error("Usage: node knowledge/tools/refine-okf-descriptions.mjs --write|--check");
  process.exit(2);
}

const overrides = fs.existsSync(OVERRIDES_PATH)
  ? JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8"))
  : {};
const records = readConcepts(BUNDLE);
const changes = [];
const errors = [];
const domainSamples = new Map();

for (const record of records) {
  const generic = GENERIC_DESCRIPTION_PATTERNS.some((pattern) =>
    pattern.test(record.description),
  );
  const nonNeutralBackstory =
    record.type === "Backstory Record" &&
    /(?:私|わたし|僕|ください|でした)/.test(
      record.description,
    );
  const generatedBackstoryCandidate =
    record.type === "Backstory Record" &&
    record.metadata.canon_review === "candidate";
  const currentProblems = descriptionProblems(record.description);
  const description =
    generic ||
    nonNeutralBackstory ||
    generatedBackstoryCandidate ||
    currentProblems.length
      ? deriveDescription(record, overrides)
      : record.description;
  const facets = deriveFacets(record);
  let updated = record.text;
  updated = setScalarField(updated, "description", description);
  updated = setListField(updated, "eras", facets.eras);
  updated = setListField(
    updated,
    "organization_groups",
    facets.organizationGroups,
  );
  updated = setListField(
    updated,
    "organization_names",
    facets.organizationNames,
  );
  const reparsed = parseFrontmatter(updated);
  const problems = descriptionProblems(reparsed.metadata.description || "");
  if (problems.length) {
    errors.push(`${record.relative}: ${problems.join(", ")}`);
  }
  if (updated !== record.text) {
    changes.push({ ...record, updated, description });
    const domain = record.relative.split("/")[0];
    if (!domainSamples.has(domain)) domainSamples.set(domain, []);
    if (domainSamples.get(domain).length < 3) {
      domainSamples
        .get(domain)
        .push(`${record.relative}: ${description}`);
    }
  }
}

for (const key of Object.keys(overrides)) {
  if (!records.some((record) => record.relative === key)) {
    errors.push(`description override points to missing concept: ${key}`);
  }
}

if (errors.length) {
  console.error(`Description refinement failed with ${errors.length} error(s):`);
  errors.slice(0, 100).forEach((error) => console.error(`- ${error}`));
  if (errors.length > 100) console.error(`... ${errors.length - 100} more`);
  process.exit(1);
}

if (mode === "write") {
  for (const change of changes) {
    fs.writeFileSync(change.file, change.updated, "utf8");
  }
  console.log(`Updated ${changes.length} concept file(s).`);
} else if (changes.length) {
  console.error(
    `Description/facet check failed: ${changes.length} concept file(s) need regeneration.`,
  );
  changes.slice(0, 50).forEach((change) =>
    console.error(`- ${change.relative}`),
  );
  if (changes.length > 50) console.error(`... ${changes.length - 50} more`);
  process.exit(1);
} else {
  console.log(`Description/facet check passed: ${records.length} concepts.`);
}

if (mode === "write") {
  console.log("Samples:");
  for (const [domain, samples] of [...domainSamples].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    console.log(`- ${domain}`);
    samples.forEach((sample) => console.log(`  ${sample}`));
  }
}
