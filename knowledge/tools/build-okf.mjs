import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const MARKER = path.join(BUNDLE, ".generated-okf");
const GENERATED_AT = new Date().toISOString();
const REBUILD_FROM_SOURCES = process.argv.includes("--from-sources");
const LOG_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const retiredIntegratedSources = [
  "シオンShion_正史コア_v2.md",
  "シオンShion_統合資料_本文優先全体設計版_v2.md",
  "シオンShion_Core_最終仕様_更新計画_v1.md",
  "シオンShion_Core_独立開拓団_設定実装仕様_v1.md",
  "Kombinat_実装仕様書_v4.md",
  "Kombinat_発注多段生産_完成要件定義_v2.md",
  "Kombinat_追加層_仮想シミュレーション監査_v2.md",
  "シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md",
  "docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md",
  "docs/40_PLAYER_FACING_SETTING_CORE.md",
  "docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md",
];

const retiredRecordSources = [
  "シオンShion_匿名のソフェル_個人設定資料_v1.md",
  "シオンShion_改訂履歴ログ_v1.md",
  "docs/38_SHION_BACKSTORY_CATALOG.md",
];

const retiredSupplementSources = [
  "docs/39_THEME_TONE_AND_DISCLOSURE_OVERHAUL.md",
  "docs/42_KOMBINAT_REMOTE_LOGISTICS_PROTECTED_DRAFT.md",
];

const retiredLegacySources = [
  "Kombinat_倉庫物流生産_完成要件定義_v1.md",
  "Kombinat_完成図_仮想シミュレーション監査_v1.md",
];

const activeReferenceSources = [
  "アークナイツ_エンドフィールドAIC設計分析レポート_v1.md",
  "docs/10_REFERENCE_MOD_STRUCTURE_MATRIX.md",
  "docs/23_EXTERNAL_VIDEO_REFERENCES.md",
  "docs/23_FLESHBEAST_COLONY_DEEP_REFERENCE.md",
  "docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md",
  "docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md",
  "docs/27_VANILLA_ARCHOTECH_RUINS_VISUAL_REFERENCE.md",
  "docs/29_ANOMALY_MONOLITH_VISUAL_REFERENCE.md",
  "Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md",
  "Kombinat/README.md",
];

const concepts = [];
const sourceSequences = new Map();

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function read(relativePath) {
  return fs
    .readFileSync(path.join(ROOT, relativePath), "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n");
}

function ensureSource(relativePath) {
  const full = path.join(ROOT, relativePath);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing source: ${relativePath}`);
  }
}

function yamlString(value) {
  return JSON.stringify(String(value));
}

function cleanInline(value) {
  return String(value)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  const cleaned = cleanInline(value)
    .normalize("NFKC")
    .replace(/^[§#\s]+/, "")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/[（）()[\]{}「」『』【】]/g, "")
    .replace(/[、，,。．.＝=＋+＆&]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "");
  return (cleaned || "item").slice(0, 84);
}

function filenameFor(title, ordinal) {
  const backstory = title.match(/\b(SHION_[CA]\d{3})\b/i);
  if (backstory) return `${backstory[1].toUpperCase()}.md`;

  const decision = title.match(/確定#(\d+)/);
  if (decision) return `decision-${decision[1].padStart(4, "0")}.md`;

  const requirement = title.match(
    /\b(UX|PRD|INT|STA|CUR|CON|SAV|SAVE|PERF|GEN|REG|DOR|REC|ADV|KX)-\d{3}\b/i,
  );
  if (requirement) return `${requirement[0].toLowerCase()}.md`;

  const phase = title.match(/^Phase\s+([0-9A-Za-z]+)/i);
  if (phase) return `phase-${phase[1].toLowerCase()}-${slugify(title)}.md`;

  const section = title.match(/^(\d+(?:\.\d+)*)[.．]?\s*(.*)$/);
  if (section) {
    const number = section[1].replace(/\./g, "-").padStart(2, "0");
    return `${number}-${slugify(section[2] || "overview")}.md`;
  }

  return `${String(ordinal).padStart(3, "0")}-${slugify(title)}.md`;
}

function inferKeywordTags(text) {
  const rules = [
    [/Kombinat/i, "kombinat"],
    [/Matter Network/i, "matter-network"],
    [/\bPawn\b|個体|Clone|Foundry/i, "pawn"],
    [/Red Star/i, "red-star"],
    [/The Hive|\bHive\b/i, "the-hive"],
    [/独立開拓団/, "independent-colony"],
    [/バックストーリー/, "backstory"],
    [/装備|武器|防具/, "equipment"],
    [/正史|世界観/, "canon"],
    [/α|Alpha/i, "alpha"],
    [/β|Beta/i, "beta"],
  ];
  return rules.filter(([pattern]) => pattern.test(text)).map(([, tag]) => tag);
}

function inferType(title, fallback) {
  if (/\b(UX|PRD|INT|STA|CUR|CON|SAV|SAVE|PERF|GEN|REG|DOR|REC|ADV|KX)-\d{3}\b/i.test(title)) {
    return "Requirement";
  }
  if (/^Phase\s+/i.test(title)) return "Implementation Phase";
  if (/^[A-J][.．]\s/.test(title)) return "Acceptance Scenario";
  if (/Release Gate|Definition of Done|完成条件/.test(title)) return "Release Gate";
  return fallback;
}

function meaningfulBody(body) {
  return body
    .replace(/^---\s*$/gm, "")
    .replace(/^#+\s+.*$/gm, "")
    .replace(/\s/g, "").length > 0;
}

function rebaseHeadings(body, selectedLevel) {
  return body.replace(/^(#{1,6})\s+/gm, (match, hashes) => {
    if (hashes.length <= selectedLevel) return match;
    const newLevel = Math.min(6, hashes.length - selectedLevel + 1);
    return `${"#".repeat(newLevel)} `;
  });
}

function sourceTitle(relativePath) {
  const text = read(relativePath);
  return cleanInline(text.match(/^#\s+(.+)$/m)?.[1] || path.basename(relativePath, ".md"));
}

function addConcept({
  outDir,
  title,
  body,
  source = null,
  sourceHeading = null,
  type = "Concept",
  description = null,
  tags = [],
  status = "stable",
  authority = "canonical",
  knowledgeRole = null,
  canonicalFor = null,
  canonicalScope = null,
  canonicalOwner = null,
  normativeBasis = null,
  granularity = null,
  ordinal = 0,
  sequence = null,
  filename = null,
}) {
  const combined = `${title}\n${body}`;
  const resolvedType = inferType(title, type);
  const inferredRole =
    resolvedType === "Requirement"
      ? "requirement"
      : resolvedType === "Acceptance Scenario" ||
          resolvedType === "Release Gate" ||
          resolvedType.startsWith("Verification")
        ? "verification"
        : resolvedType === "Backstory Record"
          ? "catalog-record"
          : resolvedType === "Decision Log Entry"
            ? "historical-record"
            : resolvedType === "Research Reference"
              ? "reference"
              : resolvedType === "Protected Draft"
                ? "draft-proposal"
                : resolvedType === "Governance Rule"
                  ? "governance"
                  : "source-of-truth";
  const inferredGranularity =
    resolvedType === "Requirement"
      ? "requirement"
      : resolvedType === "Backstory Record"
        ? "record"
        : resolvedType === "Decision Log Entry"
          ? "decision"
          : resolvedType === "Document Overview"
            ? "overview"
            : "section";
  const record = {
    outDir: toPosix(outDir),
    filename: filename || filenameFor(title, ordinal),
    title: cleanInline(title),
    body: body.trim(),
    source,
    sourceHeading: sourceHeading || cleanInline(title),
    type: resolvedType,
    description:
      description || `${cleanInline(title)}について、出典文書から一件として切り出した知識項目。`,
    tags: [...new Set([...tags, ...inferKeywordTags(combined)])],
    status,
    authority,
    knowledgeRole: knowledgeRole || inferredRole,
    canonicalFor,
    canonicalScope,
    canonicalOwner,
    normativeBasis,
    granularity: granularity || inferredGranularity,
    ordinal,
    sequence,
  };
  record.bundlePath = toPosix(path.join(record.outDir, record.filename));
  if (
    !record.canonicalFor &&
    !["summary", "reference", "draft-proposal"].includes(record.knowledgeRole)
  ) {
    record.canonicalFor = record.bundlePath.replace(/\.md$/, "");
  }
  concepts.push(record);
  if (sequence) {
    if (!sourceSequences.has(sequence)) sourceSequences.set(sequence, []);
    sourceSequences.get(sequence).push(record);
  }
  return record;
}

function extractPreamble(text) {
  const lines = text.split("\n");
  const firstTitle = lines.findIndex((line) => /^#\s+/.test(line));
  if (firstTitle < 0) return "";
  let end = lines.length;
  for (let i = firstTitle + 1; i < lines.length; i += 1) {
    if (/^#{1,3}\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines
    .slice(firstTitle + 1, end)
    .filter((line) => !/^#\s+/.test(line))
    .join("\n")
    .trim();
}

function parseSections(text, selectedLevels) {
  const lines = text.split("\n");
  const headings = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*```/.test(lines[i])) inFence = !inFence;
    if (inFence) continue;
    const match = lines[i].match(/^(#{1,6})\s+(.+?)\s*$/);
    if (match) {
      headings.push({
        line: i,
        level: match[1].length,
        title: cleanInline(match[2]),
      });
    }
  }

  const selected = headings.filter((heading) => selectedLevels.includes(heading.level));
  return selected.map((heading, index) => {
    const laterHeadings = headings.filter((candidate) => candidate.line > heading.line);
    const nextSelected = selected[index + 1];
    const structuralBoundary = laterHeadings.find(
      (candidate) =>
        candidate.level < heading.level &&
        (!nextSelected || candidate.line < nextSelected.line),
    );
    const end = Math.min(
      nextSelected?.line ?? lines.length,
      structuralBoundary?.line ?? lines.length,
    );
    return {
      ...heading,
      body: rebaseHeadings(lines.slice(heading.line + 1, end).join("\n").trim(), heading.level),
    };
  });
}

function addGenericSource(config) {
  ensureSource(config.source);
  const text = read(config.source);
  const sequence = config.sequence || config.source;
  let ordinal = 0;

  for (const section of parseSections(text, config.levels)) {
    if (!meaningfulBody(section.body)) continue;
    const pointer = config.pointerRules?.[section.title];
    const relation = config.relationRules?.[section.title];
    const pointerBody = pointer
      ? [
          "この項目は移行元の統合説明を保持していたが、OKFでは同じ事実を重複保有しない。",
          "",
          "現行内容は次の所有者を参照する。",
          "",
          ...pointer.owners.map(
            (owner) => `- ${owner.label}: [${owner.label}](${owner.path})`,
          ),
          "",
          "このファイルは旧見出しからの導線と出典追跡のために残す。",
        ].join("\n")
      : section.body;
    addConcept({
      ...config,
      title: section.title,
      body: pointerBody,
      sourceHeading: section.title,
      type: pointer ? "Summary Pointer" : config.type,
      description: pointer
        ? `${section.title}の重複本文を除き、唯一の知識所有者へ案内する項目。`
        : null,
      tags: pointer
        ? [...(config.tags || []), "summary-pointer"]
        : config.tags,
      status: pointer ? "stable" : config.status,
      authority: pointer ? "reference" : config.authority,
      knowledgeRole: pointer ? "summary" : config.knowledgeRole,
      canonicalFor: pointer ? null : config.canonicalFor,
      canonicalOwner: pointer
        ? pointer.owners.map((owner) => owner.path)
        : config.canonicalOwner,
      normativeBasis: relation?.normativeBasis || config.normativeBasis,
      granularity: pointer ? "pointer" : config.granularity,
      ordinal: ordinal++,
      sequence,
    });
  }
}

function addBackstories() {
  const source = "docs/38_SHION_BACKSTORY_CATALOG.md";
  ensureSource(source);
  const text = read(source);
  const sections = parseSections(text, [2, 4]);
  let ordinal = 0;

  for (const section of sections) {
    const id = section.title.match(/\bSHION_([CA])(\d{3})\b/i);
    if (id) {
      const lane = id[1].toUpperCase() === "C" ? "formation" : "mastery";
      addConcept({
        outDir: `backstories/${lane}`,
        title: section.title,
        body: section.body,
        source,
        sourceHeading: section.title,
        type: "Backstory Record",
        description: `ゲーム用バックストーリー ${id[0].toUpperCase()} の個別レコード。`,
      tags: ["shion", "backstory", lane],
      status: "stable",
      authority: "catalog",
      knowledgeRole: "catalog-record",
      canonicalScope: `backstory-${lane}`,
      ordinal: ordinal++,
        sequence: `backstories/${lane}`,
      });
    } else if (meaningfulBody(section.body)) {
      addConcept({
        outDir: "backstories",
        title: section.title,
        body: section.body,
        source,
        sourceHeading: section.title,
        type: "Backstory Catalog Guide",
        tags: ["shion", "backstory", "catalog-guide"],
        status: "stable",
        authority: "catalog",
        knowledgeRole: "catalog-guide",
        canonicalScope: "backstory-catalog-guidance",
        ordinal: ordinal++,
        sequence: "backstories/guides",
      });
    }
  }
}

function addDecisions() {
  const source = "シオンShion_改訂履歴ログ_v1.md";
  ensureSource(source);
  const text = read(source);
  const lines = text.split("\n");
  const decisions = new Map();

  const firstPartStart = lines.findIndex((line) => /^## 第1部：/.test(line));
  const secondPartStart = lines.findIndex((line) => /^## 第2部：/.test(line));
  if (firstPartStart >= 0 && secondPartStart > firstPartStart) {
    let current = null;
    for (const line of lines.slice(firstPartStart + 1, secondPartStart)) {
      const match = line.match(/^(\d+)\.\s+(.+)$/);
      if (match) {
        if (current) decisions.set(current.number, current);
        current = {
          number: Number(match[1]),
          title: `確定#${match[1]}：${cleanInline(match[2]).slice(0, 72)}`,
          body: match[2],
        };
      } else if (current && line.trim()) {
        current.body += `\n${line}`;
      }
    }
    if (current) decisions.set(current.number, current);
  }

  const headingPattern = /^(#{2,3})\s+確定#(\d+)[：:]\s*(.+?)\s*$/;
  const headingIndexes = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*```/.test(lines[i])) inFence = !inFence;
    if (inFence) continue;
    const match = lines[i].match(headingPattern);
    if (match) {
      headingIndexes.push({
        line: i,
        level: match[1].length,
        number: Number(match[2]),
        title: `確定#${match[2]}：${cleanInline(match[3])}`,
      });
    }
  }

  for (let i = 0; i < headingIndexes.length; i += 1) {
    const heading = headingIndexes[i];
    const next = headingIndexes[i + 1]?.line ?? lines.length;
    const body = rebaseHeadings(
      lines.slice(heading.line + 1, next).join("\n").trim(),
      heading.level,
    ).replace(/\n---\n\n\*この改訂履歴ログ[\s\S]*$/, "");
    decisions.set(heading.number, {
      number: heading.number,
      title: heading.title,
      body,
    });
  }

  for (const decision of [...decisions.values()].sort((a, b) => a.number - b.number)) {
    const warning =
      "> 履歴項目です。現行仕様との競合時は、正史コアと現在の仕様概念を優先してください。";
    addConcept({
      outDir: "decisions",
      title: decision.title,
      body: `${warning}\n\n${decision.body}`,
      source,
      sourceHeading: `確定#${decision.number}`,
      type: "Decision Log Entry",
      description: `プロジェクト改訂履歴の確定#${decision.number}。現行性は正本との照合が必要。`,
      tags: ["decision-log", "historical"],
      status: "stable",
      authority: "historical",
      knowledgeRole: "historical-record",
      canonicalScope: "decision-history",
      ordinal: decision.number,
      sequence: "decisions",
    });
  }
}

function addGovernance() {
  const governance = [
    {
      filename: "authority-and-lifecycle.md",
      title: "知識の権威順位とライフサイクル",
      body: `このOKFバンドルはRIMプロジェクト知識の入口であり、原子的な概念ファイルを現行の参照単位とする。

## 判定順

同じ主題が複数ファイルに現れる場合、まず\`knowledge_role\`と\`canonical_for\`で所有者を判定する。\`summary\`、\`projection\`、\`reference\`は、その本文だけで事実を確定せず\`canonical_owner\`を辿る。

同じ役割・同じ主題で競合した場合に限り、次の権威順位を使う。

1. \`authority: canonical\` の概念。
2. \`authority: catalog\` の個別レコード。
3. \`authority: reference\` の調査・参照資料。
4. \`authority: protected-draft\` の保護された未確定案。
5. \`authority: historical\` の決定履歴。

元の大型文書は移行時点の出典として残す。OKF概念と元文書が競合する場合は、OKF側の権威順位と\`status\`を優先する。\`_to_delete/\`と\`archive/\`は現行判断に使用しない。

## ライフサイクル

- \`stable\`: 現在参照してよい。
- \`draft\`: 未確定または保護延期中。
- \`deprecated\`: リンクと履歴のためだけに残す。`,
    },
    {
      filename: "metadata-contract.md",
      title: "RIM OKFメタデータ契約",
      body: `各概念ファイルの先頭にはYAML frontmatterを置く。

## 必須

- \`type\`: OKF必須の概念種別。

## RIM標準

- \`title\`: 表示名。
- \`description\`: 一文要約。
- \`tags\`: 横断分類。
- \`status\`: \`draft | stable | deprecated\`。
- \`authority\`: RIM内の権威区分。
- \`knowledge_role\`: 所有者、要約、投影、要件、検証、記録等の役割。
- \`canonical_for\`: このファイルが正本として所有する主題。
- \`canonical_scope\`: 所有する上位領域。
- \`canonical_owner\`: 要約・投影・参照が従う唯一の所有者。
- \`normative_basis\`: 要件や検証が具体化する上位規範。
- \`granularity\`: section、requirement、record、decision、pointer等の粒度。
- \`source_section\`: 元文書内の見出しまたはレコードID。
- \`generated\`: 移行処理の実行主体と時刻。
- \`sources\`: 出典ファイル。

未知の追加キーは保持し、\`type\`がない概念ファイルを作らない。`,
    },
    {
      filename: "ownership-map.md",
      title: "知識所有者マップ",
      body: `同じ事実を複数の正本へ持たせない。詳細度の違う説明が必要な場合、事実は一つの所有者へ置き、他は要約または投影としてリンクする。

## 所有者

| 主題 | 唯一の所有者 | 他領域で許される形 |
|---|---|---|
| 世界内の確定事実 | [正史・世界観](/world/index.md) | 制作上の要約、プレイヤー向け投影 |
| 製品構造・モジュール境界 | [全体設計](/design/index.md) | ロードマップや個別仕様からの参照 |
| α・β・1.0、版運用、現在地 | [リリース計画](/roadmap/index.md) | 各仕様のRelease Gate |
| 独立開拓団固有の設定とゲーム設計 | [独立開拓団](/colony/index.md) | 正史の一般原則への参照 |
| Kombinatの追加層境界 | [Kombinat中核仕様](/kombinat/core/index.md) | 全体設計の要約 |
| Kombinatの機能要件 | [Kombinat要件](/kombinat/requirements/index.md) | 中核仕様の要約 |
| Kombinatの検証 | [Kombinat監査](/kombinat/audit/index.md) | 要件への検証リンク |
| Matter Network上流境界 | [Matter Network境界](/integrations/matter-network/index.md) | Kombinat側からの参照 |
| Pawn生産・保管・再生 | [Pawn仕様](/pawn/index.md) | 全体設計の高位境界 |
| 制作・開示規則 | [制作・開示](/authoring/index.md) | プレイヤー文面への適用 |
| 公開用の文面と説明順 | [プレイヤー向け設定](/player-facing/index.md) | 世界事実の投影のみ |
| 匿名のソフェル個人設定 | [匿名のソフェル](/characters/anonymous-sofer/index.md) | 全体設計からの参照 |
| 個別バックストーリー | [バックストーリー](/backstories/index.md) | 正史・制作規則への参照 |
| 判断の経緯 | [決定履歴](/decisions/index.md) | 現行仕様の根拠。現行事実の所有は禁止 |
| 外部調査 | [調査・参照](/research/index.md) | 設計判断の根拠。製品仕様の所有は禁止 |

## 更新規則

1. 事実を変更するときは所有者だけを変更する。
2. 要約・投影は事実を再定義せず、所有者へリンクする。
3. 所有者を移すときは旧ファイルを\`summary\`または\`deprecated\`へ変更する。
4. 同じ\`canonical_for\`を複数の\`source-of-truth\`へ付けない。`,
    },
    {
      filename: "duplication-policy.md",
      title: "重複と異なる粒度の管理規則",
      body: `同じ内容を異なる粒度で必要とする場合でも、事実の所有者は一つにする。

## 許される重なり

- \`projection\`: プレイヤー向け表現。必ず\`canonical_owner\`へ従う。
- \`summary\`: 索引や旧見出しからの導線。本文を複製せず所有者へリンクする。
- \`requirement\`: 上位設計を実装可能なMUSTへ具体化する。重なりが大きい場合は\`normative_basis\`を付ける。
- \`verification\`: 要件を試験可能なシナリオへ変換する。
- \`historical-record\`と\`reference\`: 経緯と外部根拠。現行事実を所有しない。

## 禁止

- 同じ事実を二つの\`source-of-truth\`へ記載する。
- Summary Pointerへ元の説明本文を残す。
- 文書ごとの定型的な「概要」を概念として量産する。
- \`canonical_owner\`なしに投影や要約を作る。

## 監査

\`node tools/audit-okf-overlap.mjs\`は異なる領域間の本文を7文字shingleで比較し、小さい側の30%以上が一致する組を報告する。\`normative_basis\`で明示された具体化は管理済みとして除外する。監査結果は0組を保つ。`,
    },
    {
      filename: "atomicity-and-links.md",
      title: "一件一ファイルとリンク規則",
      body: `知識は、単独で参照・更新・廃止できる最小単位へ分ける。

## 分割単位

- 正史・全体設計: 一つの章題。
- 要件: \`UX-001\`、\`KX-001\`等の一つのID。
- 決定履歴: 一つの\`確定#N\`。
- バックストーリー: 一つの\`SHION_CNNN\`または\`SHION_ANNN\`。
- 調査資料: 一つの調査主題。

## リンク

標準Markdownリンクを使う。概念間リンクはバンドルルート相対の\`/path/to/concept.md\`を使い、関係の意味をリンク周辺の文章で明記する。各概念は上位索引、同じ出典の前後項目、関係する領域索引、移行元の出典へ接続する。`,
    },
    {
      filename: "editing-workflow.md",
      title: "OKF知識の更新手順",
      body: `1. [ルート索引](/index.md)から対象領域を選ぶ。
2. 一件の変更は一つの概念ファイルへ行う。
3. 関連する概念へ標準Markdownリンクを追加する。
4. 意味が変わった場合は\`generated.at\`を更新する。
5. 人が出典と照合した場合だけ\`verified: { by: human:<id>, at: <ISO 8601> }\`を追加する。
6. \`node tools/validate-okf.mjs\`でfrontmatterとリンクを検証する。
7. 元の大型文書へ逆同期する必要がある場合は、同じ変更で明示的に行う。
8. 元文書から全件を再移行するときだけ\`node tools/build-okf.mjs --from-sources\`を使う。`,
    },
  ];

  governance.forEach((item, index) =>
    addConcept({
      outDir: "governance",
      ...item,
      body: item.body,
      type: "Governance Rule",
      description: item.title,
      tags: ["okf", "governance"],
      status: "stable",
      authority: "canonical",
      knowledgeRole: "governance",
      canonicalScope: "okf-governance",
      ordinal: index,
      sequence: "governance",
    }),
  );
}

function relationshipTargets(record) {
  const text = `${record.title}\n${record.body}`;
  const rules = [
    [/Matter Network/i, "/integrations/matter-network/index.md", "連携境界"],
    [/Kombinat/i, "/kombinat/index.md", "Kombinat領域"],
    [/\bPawn\b|個体|Clone|Foundry/i, "/pawn/index.md", "Pawn領域"],
    [/バックストーリー/, "/backstories/index.md", "バックストーリー群"],
    [/独立開拓団/, "/colony/index.md", "独立開拓団"],
    [/Red Star|The Hive|\bHive\b|正史|シオン\/Shion/, "/world/index.md", "正史"],
    [/α|β|Alpha|Beta|1\.0|リリース/i, "/roadmap/index.md", "リリース計画"],
    [/開示|語り|プレイヤー向け/, "/authoring/index.md", "制作・開示規則"],
  ];

  const ownIndex = `/${record.outDir.split("/")[0]}/index.md`;
  const targets = [];
  for (const [pattern, target, label] of rules) {
    if (!pattern.test(text) || target === ownIndex) continue;
    if (!targets.some((item) => item.target === target)) targets.push({ target, label });
    if (targets.length >= 4) break;
  }
  return targets;
}

function relativeSourceLink(record) {
  if (!record.source) return null;
  const conceptDir = path.dirname(path.join(BUNDLE, record.bundlePath));
  return toPosix(path.relative(conceptDir, path.join(ROOT, record.source))) || ".";
}

function rewriteRelativeLinks(body, record) {
  if (!record.source) return body;
  const sourceDir = path.dirname(path.join(ROOT, record.source));
  const conceptDir = path.dirname(path.join(BUNDLE, record.bundlePath));
  return body.replace(/\]\(([^)]+)\)/g, (whole, rawTarget) => {
    const parts = rawTarget.match(/^(\S+)(.*)$/);
    if (!parts) return whole;
    const target = parts[1];
    const suffix = parts[2] || "";
    if (/^(?:[a-z]+:|#|\/)/i.test(target)) return whole;
    const [withoutAnchor, anchor = ""] = target.split("#", 2);
    const resolved = path.resolve(sourceDir, decodeURIComponent(withoutAnchor));
    if (!fs.existsSync(resolved)) return whole;
    const rewritten = toPosix(path.relative(conceptDir, resolved));
    return `](${encodeURI(rewritten)}${anchor ? `#${anchor}` : ""}${suffix})`;
  });
}

function frontmatter(record) {
  const lines = [
    "---",
    `type: ${yamlString(record.type)}`,
    `title: ${yamlString(record.title)}`,
    `description: ${yamlString(record.description)}`,
    "tags:",
    ...record.tags.map((tag) => `  - ${yamlString(tag)}`),
    `status: ${record.status}`,
    `authority: ${record.authority}`,
    `knowledge_role: ${record.knowledgeRole}`,
    `granularity: ${record.granularity}`,
  ];

  if (record.canonicalFor) {
    lines.push(`canonical_for: ${yamlString(record.canonicalFor)}`);
  }
  if (record.canonicalScope) {
    lines.push(`canonical_scope: ${yamlString(record.canonicalScope)}`);
  }
  if (record.canonicalOwner) {
    const owners = Array.isArray(record.canonicalOwner)
      ? record.canonicalOwner
      : [record.canonicalOwner];
    lines.push("canonical_owner:");
    owners.forEach((owner) => lines.push(`  - ${yamlString(owner)}`));
  }
  if (record.normativeBasis) {
    const bases = Array.isArray(record.normativeBasis)
      ? record.normativeBasis
      : [record.normativeBasis];
    lines.push("normative_basis:");
    bases.forEach((basis) => lines.push(`  - ${yamlString(basis)}`));
  }
  if (record.sourceHeading) {
    lines.push(`source_section: ${yamlString(record.sourceHeading)}`);
  }
  lines.push("generated:");
  lines.push(`  by: ${yamlString("process:rim-okf-migration")}`);
  lines.push(`  at: ${yamlString(GENERATED_AT)}`);

  if (record.source) {
    lines.push("sources:");
    lines.push(`  - id: ${yamlString("migration-source")}`);
    lines.push(`    resource: ${yamlString(relativeSourceLink(record))}`);
    lines.push(`    title: ${yamlString(sourceTitle(record.source))}`);
  }
  lines.push("---");
  return lines.join("\n");
}

function renderConcept(record) {
  const sequence = sourceSequences.get(record.sequence) || [];
  const index = sequence.indexOf(record);
  const previous = index > 0 ? sequence[index - 1] : null;
  const next = index >= 0 && index < sequence.length - 1 ? sequence[index + 1] : null;
  const indexTarget = `/${record.outDir}/index.md`;
  const related = [
    `- 上位索引: [${record.outDir}](${indexTarget})`,
    ...(previous
      ? [`- 同じ出典の前項: [${previous.title}](/${previous.bundlePath})`]
      : []),
    ...(next ? [`- 同じ出典の次項: [${next.title}](/${next.bundlePath})`] : []),
    ...relationshipTargets(record).map(
      ({ target, label }) => `- ${label}: [${label}](${target})`,
    ),
    ...(record.normativeBasis
      ? Array.isArray(record.normativeBasis)
        ? record.normativeBasis
        : [record.normativeBasis]
      : []
    ).map(
      (basis) => `- 規範上の根拠: [${path.posix.basename(basis, ".md")}](${basis})`,
    ),
  ];

  const source = record.source
    ? `\n\n## 出典\n\n- [${sourceTitle(record.source)}](${encodeURI(relativeSourceLink(record))}) — \`${record.sourceHeading}\``
    : "";

  const body = rewriteRelativeLinks(record.body, record);
  return `${frontmatter(record)}

# ${record.title}

${body}

## 関連項目

${related.join("\n")}${source}
`;
}

function writeConcepts() {
  for (const record of concepts) {
    const full = path.join(BUNDLE, record.bundlePath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, renderConcept(record), "utf8");
  }
}

function allDirectories() {
  const dirs = new Set(concepts.map((concept) => concept.outDir));
  for (const dir of [...dirs]) {
    const parts = dir.split("/");
    for (let i = 1; i < parts.length; i += 1) {
      dirs.add(parts.slice(0, i).join("/"));
    }
  }
  dirs.add("sources");
  return [...dirs].sort((a, b) => b.split("/").length - a.split("/").length || a.localeCompare(b));
}

function displayDirectory(dir) {
  const names = {
    governance: "運用規則",
    world: "正史・世界観",
    design: "全体設計",
    roadmap: "リリース計画",
    colony: "独立開拓団",
    kombinat: "Kombinat",
    "kombinat/core": "Kombinat中核仕様",
    "kombinat/requirements": "Kombinat要件",
    "kombinat/audit": "Kombinat監査",
    pawn: "Pawn生産・保管・再生",
    authoring: "制作・開示",
    "player-facing": "プレイヤー向け設定",
    integrations: "外部連携境界",
    "integrations/matter-network": "Matter Network境界",
    characters: "人物",
    "characters/anonymous-sofer": "匿名のソフェル",
    backstories: "バックストーリー",
    "backstories/formation": "Formationレコード",
    "backstories/mastery": "Masteryレコード",
    decisions: "決定履歴",
    research: "調査・参照",
    sources: "移行元カタログ",
  };
  return names[dir] || path.basename(dir);
}

function writeDirectoryIndexes() {
  const dirs = allDirectories();
  for (const dir of dirs) {
    if (dir === "sources") continue;
    const directConcepts = concepts
      .filter((concept) => concept.outDir === dir);
    const children = dirs
      .filter(
        (candidate) =>
          candidate !== dir &&
          path.posix.dirname(candidate) === dir,
      )
      .sort((a, b) => a.localeCompare(b, "ja"));
    const lines = [`# ${displayDirectory(dir)}`];

    if (children.length) {
      lines.push("", "## 下位領域", "");
      for (const child of children) {
        const count = concepts.filter(
          (concept) =>
            concept.outDir === child || concept.outDir.startsWith(`${child}/`),
        ).length;
        lines.push(
          `- [${displayDirectory(child)}](${path.posix.basename(child)}/) — ${count}件`,
        );
      }
    }

    if (directConcepts.length) {
      lines.push("", "## 項目", "");
      for (const concept of directConcepts) {
        lines.push(
          `- [${concept.title}](${encodeURI(concept.filename)}) — ${concept.description}`,
        );
      }
    }
    lines.push("");
    const indexPath = path.join(BUNDLE, dir, "index.md");
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    fs.writeFileSync(indexPath, lines.join("\n"), "utf8");
  }
}

function walkFiles(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "knowledge", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walkFiles(full));
    else result.push(full);
  }
  return result;
}

function sourceCategory(relativePath) {
  const normalized = toPosix(relativePath);
  if (retiredIntegratedSources.includes(normalized)) return "退役済み統合原本（凍結スナップショット）";
  if (retiredRecordSources.includes(normalized)) return "退役済みカタログ・履歴原本";
  if (retiredSupplementSources.includes(normalized)) return "退役済み補助原本（凍結スナップショット）";
  if (retiredLegacySources.includes(normalized)) return "退役済み旧版・統合スナップショット";
  if (activeReferenceSources.includes(normalized)) return "現役の調査・実装参照（非正史）";
  if (normalized.startsWith("_to_delete/")) return "廃止候補（参照禁止）";
  if (normalized.startsWith("archive/")) return "アーカイブ";
  if (/(_v3|MVP|テーマ再設計|AI向け単一参照版)/i.test(normalized)) return "退役済み旧版・統合スナップショット";
  if (normalized.startsWith("Kombinat/")) return "Kombinatコード・資産";
  if (/\.(png|svg|html|mermaid)$/i.test(normalized)) return "図版・視覚資料";
  if (normalized.startsWith("tools/")) return "OKF保守ツール";
  return "その他（権威なし）";
}

function writeSourceIndex() {
  const files = walkFiles(ROOT)
    .map((full) => toPosix(path.relative(ROOT, full)))
    .filter((relative) => !["AGENTS.md", "CLAUDE.md"].includes(relative))
    .sort((a, b) => a.localeCompare(b, "ja"));
  const groups = new Map();
  for (const relative of files) {
    const category = sourceCategory(relative);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(relative);
  }

  const order = [
    "退役済み統合原本（凍結スナップショット）",
    "退役済みカタログ・履歴原本",
    "退役済み補助原本（凍結スナップショット）",
    "現役の調査・実装参照（非正史）",
    "Kombinatコード・資産",
    "図版・視覚資料",
    "退役済み旧版・統合スナップショット",
    "アーカイブ",
    "廃止候補（参照禁止）",
    "OKF保守ツール",
    "その他（権威なし）",
  ];
  const lines = [
    "# 移行元・プロジェクト資産カタログ",
    "",
    "この索引はOKF外に残した凍結原本・調査資料・コード・図版を辿るための台帳です。現行判断には`knowledge/`内の正規所有者だけを使用し、退役済み原本へのリンクは出典追跡に限ってください。",
  ];
  for (const category of order) {
    const entries = groups.get(category) || [];
    if (!entries.length) continue;
    lines.push("", `## ${category}`, "");
    for (const relative of entries) {
      const href = encodeURI(toPosix(path.relative(path.join(ROOT, "knowledge", "sources"), path.join(ROOT, relative))));
      lines.push(`- [${relative}](${href})`);
    }
  }
  lines.push("");
  const output = path.join(BUNDLE, "sources", "index.md");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, lines.join("\n"), "utf8");
}

function writeRootFiles() {
  const topDirs = allDirectories()
    .filter((dir) => !dir.includes("/"))
    .sort((a, b) => a.localeCompare(b, "ja"));
  const lines = [
    "---",
    'okf_version: "0.2"',
    "---",
    "",
    "# RIM Project Knowledge",
    "",
    "Shion Race: Core、Kombinat、関連する世界設定・仕様・履歴を一件一ファイルで収めたOKFバンドルです。",
    "",
    "## 読み始め",
    "",
    "1. [権威順位とライフサイクル](governance/authority-and-lifecycle.md)",
    "2. [横断ナビゲーション](navigation/)",
    "3. [改稿ダッシュボード](navigation/overhaul/)",
    "4. [知識所有者マップ](governance/ownership-map.md)",
    "5. [正史・世界観](world/)",
    "6. [全体設計](design/)",
    "7. [リリース計画](roadmap/)",
    "",
    "## 領域",
    "",
  ];

  for (const dir of topDirs) {
    const count = concepts.filter(
      (concept) => concept.outDir === dir || concept.outDir.startsWith(`${dir}/`),
    ).length;
    const summary = dir === "sources" ? "原本・コード・図版" : `${count}件`;
    lines.push(`- [${displayDirectory(dir)}](${dir}/) — ${summary}`);
  }
  lines.push(
    "",
    "## 使い方",
    "",
    "- ファイル先頭の荷札（YAML frontmatter）で種別・状態・権威・出典を判定する。",
    "- 同じ主題が複数に現れる場合は、`knowledge_role`と`canonical_owner`から唯一の所有者を辿る。",
    "- 本文末尾の「関連項目」からグラフを辿る。",
    "- 大型の元文書やコードは[移行元カタログ](sources/)から確認する。",
    "- 現行仕様と履歴が競合する場合は、`authority`と`status`を優先する。",
    "- 時代、組織、状態、主題から探す場合は[横断ナビゲーション](navigation/)を使う。",
    "",
  );
  fs.writeFileSync(path.join(BUNDLE, "index.md"), lines.join("\n"), "utf8");

  const log = `# RIM Knowledge Update Log

## ${LOG_DATE}

- **Migration**: 現行正本を章・要件ID単位のOKF概念へ分割。
- **Migration**: 838件のバックストーリーを個別レコード化。
- **Migration**: 改訂履歴の確定事項を個別の履歴概念化。
- **Creation**: 権威順位、メタデータ契約、リンク規則、更新手順を追加。
- **Creation**: 全領域索引と移行元カタログを生成。
- **Deduplication**: 重複していた文書概要を除去し、統合説明を唯一の知識所有者へ向けたSummary Pointerへ変更。
- **Audit**: 異なる領域間の無管理な本文重複を20組から0組へ削減。
- **Governance**: \`knowledge_role\`、\`canonical_for\`、\`canonical_scope\`、\`canonical_owner\`を導入。
`;
  fs.writeFileSync(path.join(BUNDLE, "log.md"), log, "utf8");
  fs.writeFileSync(MARKER, `generated_at=${GENERATED_AT}\n`, "utf8");
}

function prepareBundle() {
  throw new Error(
    "Retired migration tool: the original import sources were deleted after OKF migration. Full re-import is disabled to protect the canonical knowledge bundle.",
  );
}

prepareBundle();

addGovernance();

const designPointerRules = {
  "最初に読む：今回のオーバーホールで何を変えたか": {
    owners: [
      { label: "知識所有者マップ", path: "/governance/ownership-map-知識所有者マップ.md" },
      { label: "移行元カタログ", path: "/sources/index.md" },
    ],
  },
  "0. 権威順位と状態語": {
    owners: [
      {
        label: "知識の権威順位とライフサイクル",
        path: "/governance/authority-and-lifecycle-知識の権威順位とライフサイクル.md",
      },
      { label: "知識所有者マップ", path: "/governance/ownership-map-知識所有者マップ.md" },
    ],
  },
  "1. 中心命題": {
    owners: [
      { label: "作品の中心命題", path: "/world/01-作品の中心命題.md" },
      { label: "帝国から同盟へ", path: "/world/02-帝国から同盟へ.md" },
    ],
  },
  "2. 帝国と同盟：同一文明の二形態": {
    owners: [
      { label: "帝国から同盟へ", path: "/world/02-帝国から同盟へ.md" },
      { label: "同盟社会", path: "/world/04-同盟社会.md" },
    ],
  },
  "3. シオンの人格と身体": {
    owners: [
      { label: "シオンという人類", path: "/world/03-シオンという人類.md" },
      {
        label: "人格記録、復活、同化",
        path: "/world/06-人格記録-復活-同化.md",
      },
      { label: "Pawn仕様", path: "/pawn/index.md" },
    ],
  },
  "4. 善意の非対称性を物語へ変換する": {
    owners: [
      {
        label: "一件の物語の構造",
        path: "/authoring/04-一件の物語の構造.md",
      },
      { label: "善意の非対称性", path: "/world/05-善意の非対称性.md" },
    ],
  },
  "5. 技術体系と文明的制約": {
    owners: [
      { label: "技術体系", path: "/world/07-技術体系.md" },
      {
        label: "車輌と改良動物",
        path: "/world/10-車輌と改良動物.md",
      },
    ],
  },
  "9. Kombinat内部Runtime": {
    owners: [
      { label: "Kombinat中核仕様", path: "/kombinat/core/index.md" },
      { label: "Kombinat要件", path: "/kombinat/requirements/index.md" },
      {
        label: "Matter Network境界",
        path: "/integrations/matter-network/index.md",
      },
    ],
  },
  "17. 匿名のソフェル": {
    owners: [
      {
        label: "匿名のソフェル個人設定",
        path: "/characters/anonymous-sofer/index.md",
      },
    ],
  },
  "19. 現在のリポジトリ事実": {
    owners: [
      { label: "現在地", path: "/roadmap/08-現在地.md" },
      { label: "移行元カタログ", path: "/sources/index.md" },
    ],
  },
  "21. 保存と版間互換": {
    owners: [
      { label: "バージョン運用", path: "/roadmap/07-バージョン運用.md" },
    ],
  },
  "22. リリース段階": {
    owners: [{ label: "リリース計画", path: "/roadmap/index.md" }],
  },
  "26. 旧31章クロスウォーク": {
    owners: [{ label: "移行元カタログ", path: "/sources/index.md" }],
  },
  "27. 今回の廃止・変更台帳": {
    owners: [{ label: "決定履歴", path: "/decisions/index.md" }],
  },
  "28. 旧資料の利用手順": {
    owners: [
      {
        label: "知識の権威順位とライフサイクル",
        path: "/governance/authority-and-lifecycle-知識の権威順位とライフサイクル.md",
      },
      { label: "移行元カタログ", path: "/sources/index.md" },
    ],
  },
  "29. 文書責務": {
    owners: [
      { label: "知識所有者マップ", path: "/governance/ownership-map-知識所有者マップ.md" },
    ],
  },
  "31. 完成条件": {
    owners: [
      {
        label: "β終了／1.0完成条件",
        path: "/roadmap/06-β終了-1-0完成条件.md",
      },
    ],
  },
};

const pawnRelationRules = {
  "INT-004 装備ファミリー": {
    normativeBasis: ["/design/14-装備-軍事-バランス.md"],
  },
  "REC-004 Ephemeral最終削除": {
    normativeBasis: ["/design/13-個体設計.md"],
  },
};

[
  {
    source: "シオンShion_正史コア_v2.md",
    outDir: "world",
    levels: [2],
    type: "Canonical Lore",
    tags: ["shion", "canon", "world"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "world-lore",
  },
  {
    source: "シオンShion_統合資料_本文優先全体設計版_v2.md",
    outDir: "design",
    levels: [2],
    type: "Product Design",
    tags: ["shion", "design", "architecture"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "product-architecture",
    pointerRules: designPointerRules,
  },
  {
    source: "シオンShion_Core_最終仕様_更新計画_v1.md",
    outDir: "roadmap",
    levels: [2],
    type: "Release Plan",
    tags: ["shion", "roadmap", "release"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "release-and-versioning",
  },
  {
    source: "シオンShion_Core_独立開拓団_設定実装仕様_v1.md",
    outDir: "colony",
    levels: [2],
    type: "Gameplay Specification",
    tags: ["shion", "independent-colony", "gameplay"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "independent-colony",
  },
  {
    source: "Kombinat_実装仕様書_v4.md",
    outDir: "kombinat/core",
    levels: [2],
    type: "Implementation Specification",
    tags: ["kombinat", "implementation"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "kombinat-component-boundary",
  },
  {
    source: "Kombinat_発注多段生産_完成要件定義_v2.md",
    outDir: "kombinat/requirements",
    levels: [2, 3],
    type: "Requirement Group",
    tags: ["kombinat", "requirements", "production"],
    authority: "canonical",
    canonicalScope: "kombinat-requirements",
  },
  {
    source: "Kombinat_追加層_仮想シミュレーション監査_v2.md",
    outDir: "kombinat/audit",
    levels: [2, 3],
    type: "Verification Specification",
    tags: ["kombinat", "audit", "verification"],
    authority: "canonical",
    canonicalScope: "kombinat-verification",
  },
  {
    source: "シオンShion_Core_β版_Pawn生産保管再生_仕様_v1.md",
    outDir: "pawn",
    levels: [2, 3],
    type: "Pawn System Specification",
    tags: ["shion", "pawn", "beta"],
    authority: "canonical",
    canonicalScope: "pawn-system",
    relationRules: pawnRelationRules,
  },
  {
    source: "docs/41_CANON_AUTHORING_AND_DISCLOSURE_GUIDE.md",
    outDir: "authoring",
    levels: [2, 3],
    type: "Authoring Rule",
    tags: ["shion", "canon", "authoring", "disclosure"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "authoring-and-disclosure",
  },
  {
    source: "docs/40_PLAYER_FACING_SETTING_CORE.md",
    outDir: "player-facing",
    levels: [2, 3],
    type: "Player-facing Reference",
    tags: ["shion", "player-facing", "disclosure"],
    authority: "canonical",
    knowledgeRole: "projection",
    canonicalScope: "player-facing-copy",
    canonicalOwner: ["/world/index.md", "/authoring/index.md"],
  },
  {
    source: "docs/43_MATTER_NETWORK_UPSTREAM_BOUNDARY.md",
    outDir: "integrations/matter-network",
    levels: [2],
    type: "Integration Boundary",
    tags: ["kombinat", "matter-network", "integration"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "matter-network-integration-boundary",
  },
  {
    source: "シオンShion_匿名のソフェル_個人設定資料_v1.md",
    outDir: "characters/anonymous-sofer",
    levels: [2],
    type: "Character Specification",
    tags: ["shion", "character", "anonymous-sofer"],
    authority: "canonical",
    knowledgeRole: "source-of-truth",
    canonicalScope: "anonymous-sofer",
  },
].forEach(addGenericSource);

const researchConfigs = [
  {
    source: "アークナイツ_エンドフィールドAIC設計分析レポート_v1.md",
    outDir: "research/endfield-aic",
    tags: ["research", "endfield", "aic"],
  },
  {
    source: "docs/10_REFERENCE_MOD_STRUCTURE_MATRIX.md",
    outDir: "research/reference-mods",
    tags: ["research", "reference-mod"],
  },
  {
    source: "docs/23_EXTERNAL_VIDEO_REFERENCES.md",
    outDir: "research/external-videos",
    tags: ["research", "video"],
  },
  {
    source: "docs/23_FLESHBEAST_COLONY_DEEP_REFERENCE.md",
    outDir: "research/fleshbeast",
    tags: ["research", "fleshbeast"],
  },
  {
    source: "docs/24_MONOLYN_PLAYER_PRACTICE_REFERENCE.md",
    outDir: "research/monolyn-practice",
    tags: ["research", "monolyn", "player-practice"],
  },
  {
    source: "docs/25_MONOLYN_UI_SYSTEMS_REFERENCE.md",
    outDir: "research/monolyn-ui",
    tags: ["research", "monolyn", "ui"],
  },
  {
    source: "docs/27_VANILLA_ARCHOTECH_RUINS_VISUAL_REFERENCE.md",
    outDir: "research/archotech-ruins",
    tags: ["research", "visual", "archotech"],
  },
  {
    source: "docs/29_ANOMALY_MONOLITH_VISUAL_REFERENCE.md",
    outDir: "research/anomaly-monolith",
    tags: ["research", "visual", "anomaly"],
  },
  {
    source: "docs/39_THEME_TONE_AND_DISCLOSURE_OVERHAUL.md",
    outDir: "research/theme-overhaul",
    tags: ["research", "theme", "tone"],
  },
  {
    source: "docs/42_KOMBINAT_REMOTE_LOGISTICS_PROTECTED_DRAFT.md",
    outDir: "research/remote-logistics",
    tags: ["kombinat", "remote-logistics", "protected-draft"],
    status: "draft",
    authority: "protected-draft",
    type: "Protected Draft",
  },
  {
    source: "Kombinat/Docs/implementation/KNOWN_CODE_EXTRACTION.md",
    outDir: "research/known-code",
    tags: ["kombinat", "implementation", "code-reference"],
  },
  {
    source: "Kombinat/README.md",
    outDir: "research/kombinat-prototype",
    tags: ["kombinat", "prototype", "implementation"],
  },
];

for (const config of researchConfigs) {
  addGenericSource({
    levels: [2],
    type: config.type || "Research Reference",
    status: config.status || "stable",
    authority: config.authority || "reference",
    ...config,
  });
}

addBackstories();
addDecisions();
writeConcepts();
writeDirectoryIndexes();
writeSourceIndex();
writeRootFiles();
execFileSync(
  process.execPath,
  [path.join(ROOT, "tools", "refine-okf-descriptions.mjs"), "--write"],
  { cwd: ROOT, stdio: "inherit" },
);
execFileSync(
  process.execPath,
  [path.join(ROOT, "tools", "build-okf-navigation.mjs"), "--write"],
  { cwd: ROOT, stdio: "inherit" },
);

const counts = concepts.reduce((map, concept) => {
  const key = concept.outDir.split("/")[0];
  map.set(key, (map.get(key) || 0) + 1);
  return map;
}, new Map());

console.log(`Generated ${concepts.length} OKF concepts in ${BUNDLE}`);
for (const [key, value] of [...counts.entries()].sort()) {
  console.log(`${key}: ${value}`);
}
