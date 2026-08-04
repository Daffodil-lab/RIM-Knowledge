import fs from "node:fs";
import path from "node:path";

const reviewState = process.argv[2];
const expectedCount = Number(process.argv[3]);
if (!["candidate", "re-audit"].includes(reviewState) || !Number.isInteger(expectedCount)) {
  throw new Error("usage: node knowledge/tools/finalize-backstory-review.mjs <candidate|re-audit> <expected-count>");
}

const root = process.cwd();
const planned = [];
for (const group of ["formation", "mastery"]) {
  const dir = path.join(root, "knowledge", "backstories", group);
  for (const name of fs.readdirSync(dir).filter((entry) => /^SHION_[CA]\d{3}\.md$/.test(entry))) {
    const file = path.join(dir, name);
    const text = fs.readFileSync(file, "utf8");
    if (!text.includes(`canon_review: ${reviewState}`)) continue;
    let next = text.replace(`canon_review: ${reviewState}`, "canon_review: accepted");
    next = next.replace(/ReviewStatus: (?:新規正史候補|既存稿再監査)/, "ReviewStatus: 採用済み");
    planned.push([file, next]);
  }
}

if (planned.length !== expectedCount) {
  throw new Error(`expected ${expectedCount} ${reviewState} records, found ${planned.length}`);
}

for (const [file, text] of planned) {
  fs.writeFileSync(file, text, "utf8");
}

console.log(`BACKSTORY_REVIEW_FINALIZED state=${reviewState} files=${planned.length}`);
