import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const mode = process.argv[2];

if (!["--write", "--check"].includes(mode)) {
  console.error(
    "Usage: node knowledge/tools/normalize-retired-source-links.mjs --write|--check",
  );
  process.exit(1);
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function resolveLocal(file, rawTarget) {
  const pathPart = rawTarget.split("#")[0].split(/\s+"/)[0];
  if (!pathPart || /^(?:[a-z]+:|#)/i.test(pathPart)) return null;
  const decoded = decodeURI(pathPart);
  if (decoded.startsWith("/")) {
    return path.join(BUNDLE, decoded.slice(1));
  }
  return path.resolve(path.dirname(file), decoded);
}

function retiredId(resolved) {
  const relative = path.relative(ROOT, resolved).split(path.sep).join("/");
  if (!relative.startsWith("../") && relative !== "..") {
    return `retired-source://project/${relative}`;
  }
  return `retired-source://external/${encodeURI(relative)}`;
}

function transform(file, original) {
  let replacements = 0;
  let text = original.replace(
    /^(\s*resource:\s*)"([^"]+)"\s*$/gm,
    (whole, prefix, rawTarget) => {
      const resolved = resolveLocal(file, rawTarget);
      if (
        !resolved ||
        fs.existsSync(resolved) ||
        isWithin(BUNDLE, resolved)
      ) {
        return whole;
      }
      replacements += 1;
      return `${prefix}"${retiredId(resolved)}"`;
    },
  );

  text = text.replace(
    /\[([^\]\n]+)\]\(([^)\n]+)\)/g,
    (whole, label, rawTarget) => {
      const resolved = resolveLocal(file, rawTarget);
      if (
        !resolved ||
        fs.existsSync(resolved) ||
        isWithin(BUNDLE, resolved)
      ) {
        return whole;
      }
      replacements += 1;
      return `${label}（退役済み原本: \`${retiredId(resolved)}\`）`;
    },
  );

  return { text, replacements };
}

const changed = [];
let replacementCount = 0;
for (const file of walk(BUNDLE).filter((candidate) => candidate.endsWith(".md"))) {
  const original = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const result = transform(file, original);
  if (result.text === original) continue;
  changed.push(path.relative(ROOT, file).split(path.sep).join("/"));
  replacementCount += result.replacements;
  if (mode === "--write") fs.writeFileSync(file, result.text, "utf8");
}

if (mode === "--check" && changed.length) {
  console.error(
    `Retired-source normalization required: ${replacementCount} occurrence(s) in ${changed.length} file(s).`,
  );
  changed.slice(0, 50).forEach((file) => console.error(`- ${file}`));
  if (changed.length > 50) console.error(`... ${changed.length - 50} more`);
  process.exit(1);
}

console.log(
  mode === "--write"
    ? `Normalized ${replacementCount} retired-source occurrence(s) in ${changed.length} file(s).`
    : "Retired-source normalization check passed.",
);
