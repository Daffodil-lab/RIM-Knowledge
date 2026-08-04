import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const groups = ["formation", "mastery"];
const planned = [];

for (const group of groups) {
  const dir = path.join(root, "knowledge", "backstories", group);
  const files = fs.readdirSync(dir).filter((name) => /^SHION_[CA]\d{3}\.md$/.test(name));
  for (const name of files) {
    const file = path.join(dir, name);
    const text = fs.readFileSync(file, "utf8");
    if (text.includes("\n## 設定クラス\n") && text.includes("\n## 実装予約\n")) continue;

    const lines = text.split("\n");
    const slotIndex = lines.findIndex((line) => /^- Slot: .+ \/ Short: .+$/.test(line));
    const poolIndex = lines.findIndex((line) => /^- Pool: .+ \/ SourceModule: .+$/.test(line));
    const rarityIndex = lines.findIndex((line) => /^- Rarity: .+ \/ Tone: .+ \/ Status: .+$/.test(line));
    const skillIndex = lines.findIndex((line) => /^- 技能: /.test(line));
    const relatedIndex = lines.findIndex((line) => line === "## 関連項目");
    if ([slotIndex, poolIndex, rarityIndex, skillIndex, relatedIndex].some((index) => index < 0)) {
      throw new Error(`cannot separate layers in ${file}`);
    }

    const slotMatch = lines[slotIndex].match(/^- Slot: (.+) \/ Short: (.+)$/);
    const rarityMatch = lines[rarityIndex].match(/^- Rarity: (.+) \/ Tone: (.+) \/ Status: (.+)$/);
    const poolLine = lines[poolIndex];
    const slot = slotMatch[1];
    const short = slotMatch[2];
    const rarity = rarityMatch[1];
    const tone = rarityMatch[2];
    const reviewStatus = rarityMatch[3];

    lines[slotIndex] = `## 設定クラス\n\n- Short: ${short}`;
    lines[rarityIndex] = `- Tone: ${tone} / ReviewStatus: ${reviewStatus}`;
    lines[poolIndex] = "";
    lines[skillIndex] = `## 実装予約\n\n- Slot: ${slot}\n${poolLine}\n- Rarity: ${rarity}\n${lines[skillIndex]}`;

    const nextRelatedIndex = lines.findIndex((line) => line === "## 関連項目");
    const link = "- 設定と実装の分離: [設定本文と実装予約の分離](/backstories/09-設定本文と実装予約の分離.md)";
    lines.splice(nextRelatedIndex + 2, 0, link);

    let next = lines.join("\n");
    next = next.replace(/\n{3,}/g, "\n\n");
    planned.push([file, next]);
  }
}

for (const [file, text] of planned) {
  fs.writeFileSync(file, text, "utf8");
}

console.log(`BACKSTORY_LAYERS_SEPARATED files=${planned.length}`);
