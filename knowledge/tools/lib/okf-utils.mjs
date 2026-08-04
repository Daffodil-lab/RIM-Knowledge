import fs from "node:fs";
import path from "node:path";

export const GENERIC_DESCRIPTION_PATTERNS = [
  /切り出した知識項目/,
  /ゲーム用バックストーリー\s+SHION_[CA]\d{3}\s+の個別レコード/,
  /プロジェクト改訂履歴の確定#\d+。現行性は正本との照合が必要/,
  /について、主要な定義、境界、適用条件を示す/,
  /は、(?:項目|分類|要件|ID)：/,
  /[:：]。$/,
  /^SHION[CA]\d+\s/,
];

export const ERA_ORDER = [
  "ImperialPeak",
  "ImperialCivilWar",
  "PostCivilWarEmpire",
  "RevolutionaryWar",
  "LongTransition",
  "AscendantEra",
  "GrowthEra",
  "ColonizationEra",
  "JourneyEra",
  "ModernUnion",
  "EraIndependent",
];

export const ERA_LABELS = {
  ImperialPeak: "帝国最盛期",
  ImperialCivilWar: "帝国内戦",
  PostCivilWarEmpire: "内戦後帝国",
  RevolutionaryWar: "革命戦争",
  LongTransition: "長い過渡期",
  AscendantEra: "上昇期",
  GrowthEra: "成長期",
  ColonizationEra: "入植期",
  JourneyEra: "旅程期",
  ModernUnion: "現代同盟",
  EraIndependent: "時代非依存",
};

export const ORGANIZATION_LABELS = {
  empire: "帝国",
  "revolutionary-coalition": "革命連合",
  union: "同盟",
  "independent-frontier": "独立・辺境",
  "sofer-law": "ソフェル・律法機関",
  "red-star": "Red Star",
  "the-hive": "The Hive",
  "kombinat-communities": "Kombinat共同体",
  "other-named": "その他の固有組織",
  "unaffiliated-unknown": "無所属・不明",
};

export const TOPIC_DEFINITIONS = [
  {
    id: "world-canon",
    label: "世界観・正史",
    tags: ["world"],
    domains: ["world", "player-facing"],
  },
  {
    id: "personhood-body",
    label: "身体・人格",
    tags: ["pawn", "character"],
    pattern: /身体|人格|Clone|クローン|復活|同化|休眠/i,
  },
  {
    id: "technology-yetzirah",
    label: "技術・イェツィラー",
    tags: ["archotech"],
    pattern: /技術|イェツィラー|ソフェル|Cell|凝縮真空/i,
  },
  {
    id: "colony-red-star",
    label: "開拓・Red Star",
    tags: ["independent-colony", "red-star"],
    domains: ["colony"],
  },
  {
    id: "the-hive",
    label: "The Hive",
    tags: ["the-hive"],
  },
  {
    id: "kombinat-production",
    label: "Kombinat・生産物流",
    tags: ["kombinat", "production"],
    domains: ["kombinat"],
  },
  {
    id: "matter-network-integration",
    label: "Matter Network・外部連携",
    tags: ["matter-network", "integration"],
    domains: ["integrations"],
  },
  {
    id: "pawn-cloning",
    label: "Pawn・生産・複製",
    tags: ["pawn"],
    domains: ["pawn"],
  },
  {
    id: "equipment-military",
    label: "装備・軍事",
    tags: ["equipment"],
    pattern: /装備|武器|防具|軍事|戦闘|兵士/i,
  },
  {
    id: "gameplay-ui",
    label: "ゲームプレイ・UI",
    tags: ["gameplay", "ui", "player-practice"],
  },
  {
    id: "authoring-disclosure",
    label: "制作・開示",
    tags: ["authoring", "disclosure", "player-facing"],
    domains: ["authoring"],
  },
  {
    id: "release-implementation",
    label: "リリース・実装",
    tags: ["roadmap", "release", "implementation", "alpha", "beta"],
    domains: ["roadmap"],
  },
  {
    id: "characters-backstories",
    label: "人物・バックストーリー",
    tags: ["character", "anonymous-sofer", "backstory", "formation", "mastery"],
    domains: ["characters", "backstories"],
  },
  {
    id: "research-audit",
    label: "調査・監査",
    tags: ["research", "audit", "verification", "contradiction"],
    domains: ["research", "contradictions"],
  },
  {
    id: "governance-history",
    label: "運用・履歴",
    tags: ["governance", "decision-log", "historical"],
    domains: ["governance", "decisions"],
  },
];

export function toPosix(value) {
  return value.split(path.sep).join("/");
}

export function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else result.push(full);
  }
  return result;
}

export function parseFrontmatter(text) {
  const normalized = text.replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { metadata: {}, frontmatter: "", body: normalized };
  const metadata = {};
  const lines = match[1].split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const scalar = lines[index].match(/^([a-z_]+):\s*(.*)$/i);
    if (!scalar) continue;
    const [, key, rawValue] = scalar;
    if (rawValue.trim()) {
      metadata[key] = unquote(rawValue.trim());
      continue;
    }
    const list = [];
    let cursor = index + 1;
    while (cursor < lines.length) {
      const item = lines[cursor].match(/^  -\s+(.+)$/);
      if (!item) break;
      list.push(unquote(item[1].trim()));
      cursor += 1;
    }
    if (list.length) {
      metadata[key] = list;
      index = cursor - 1;
    }
  }
  return {
    metadata,
    frontmatter: match[1],
    body: normalized.slice(match[0].length),
  };
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    try {
      if (value.startsWith('"')) return JSON.parse(value);
    } catch {
      // Fall through to conservative quote removal.
    }
    return value.slice(1, -1);
  }
  return value;
}

export function yamlString(value) {
  return JSON.stringify(String(value));
}

export function setScalarField(text, key, value) {
  const normalized = text.replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error(`Cannot set ${key}: missing frontmatter`);
  const lines = match[1].split("\n");
  const index = lines.findIndex((line) =>
    new RegExp(`^${escapeRegex(key)}:`).test(line),
  );
  const rendered = `${key}: ${yamlString(value)}`;
  if (index >= 0) {
    lines[index] = rendered;
  } else {
    const statusIndex = lines.findIndex((line) => /^status:/.test(line));
    lines.splice(statusIndex >= 0 ? statusIndex : lines.length, 0, rendered);
  }
  return `---\n${lines.join("\n")}\n---\n${normalized.slice(match[0].length)}`;
}

export function setListField(text, key, values) {
  const normalized = text.replace(/\r\n?/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error(`Cannot set ${key}: missing frontmatter`);
  const lines = match[1].split("\n");
  const start = lines.findIndex((line) =>
    new RegExp(`^${escapeRegex(key)}:\\s*$`).test(line),
  );
  if (start >= 0) {
    let end = start + 1;
    while (end < lines.length && /^  -\s+/.test(lines[end])) end += 1;
    lines.splice(start, end - start);
  }
  if (values.length) {
    const statusIndex = lines.findIndex((line) => /^status:/.test(line));
    const insertAt = statusIndex >= 0 ? statusIndex : lines.length;
    lines.splice(
      insertAt,
      0,
      `${key}:`,
      ...values.map((value) => `  - ${yamlString(value)}`),
    );
  }
  return `---\n${lines.join("\n")}\n---\n${normalized.slice(match[0].length)}`;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function stripMarkdown(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/[`*_~]/g, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanTitle(title) {
  return stripMarkdown(
    String(title).replace(/^SHION_[CA]\d{3}\s+/i, ""),
  )
    .replace(/^確定#\d+[：:]\s*/, "")
    .replace(/^\d+(?:\.\d+)*[.．]?\s*/, "")
    .trim();
}

function firstSentence(value) {
  const cleaned = stripMarkdown(value);
  if (!cleaned) return "";
  const match = cleaned.match(/^(.+?[。！？])/);
  return match ? match[1] : cleaned;
}

function firstTwoSentences(value) {
  const cleaned = stripMarkdown(value);
  const matches = [...cleaned.matchAll(/(.+?)[。！？]/g)].map((match) =>
    match[1].trim(),
  );
  if (!matches.length) return cleaned;
  if (matches[0].length >= 24 || matches.length === 1) return matches[0];
  const first = matches[0]
    .replace(/です$/g, "であり")
    .replace(/ます$/g, "")
    .replace(/である$/g, "であり");
  return `${first}、また${matches[1]}`;
}

function ensureSentence(value) {
  let cleaned = stripMarkdown(value)
    .replace(/\[([^\]]+)\]/g, "$1")
    .replace(/#/g, "番号")
    .replace(/\|/g, "・")
    .replace(/[。！？]+$/g, "")
    .trim();
  const internalEnd = cleaned.search(/[。！？]/);
  if (internalEnd >= 0) cleaned = cleaned.slice(0, internalEnd);
  if (!cleaned) return "";
  if (cleaned.length > 139) {
    const slice = cleaned.slice(0, 136);
    const boundary = Math.max(
      slice.lastIndexOf("、"),
      slice.lastIndexOf("。"),
      slice.lastIndexOf("；"),
      slice.lastIndexOf(" "),
    );
    cleaned = `${slice.slice(0, boundary >= 40 ? boundary : 136).trim()}…`;
  }
  return `${cleaned}。`;
}

function contentCandidates(body) {
  const relevant = body
    .split(/\n## 関連項目\n/)[0]
    .split(/\n## 出典\n/)[0]
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#.*$/gm, "")
    .replace(/^---\s*$/gm, "")
    .trim();
  const paragraphs = relevant
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
  const prose = [];
  const listItems = [];
  const tableCells = [];
  for (const paragraph of paragraphs) {
    if (/^\|/.test(paragraph)) {
      const rows = paragraph.split("\n");
      const hasHeader =
        rows.length >= 2 &&
        /^\|(?:\s*[-:]+\s*\|)+\s*$/.test(rows[1]);
      for (const [rowIndex, row] of rows.entries()) {
        if (hasHeader && rowIndex < 2) continue;
        if (/^\|\s*[-:]+\s*\|/.test(row)) continue;
        const cells = row
          .split("|")
          .slice(1, -1)
          .map(stripMarkdown)
          .filter(Boolean);
        if (cells.length) tableCells.push(cells.join("："));
      }
      continue;
    }
    const lines = paragraph.split("\n");
    const items = lines
      .map((line) => line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.+)$/)?.[1])
      .filter(Boolean)
      .map(stripMarkdown);
    if (items.length === lines.filter((line) => line.trim()).length) {
      listItems.push(...items);
      continue;
    }
    prose.push(stripMarkdown(paragraph.replace(/\n/g, " ")));
  }
  return { prose, listItems, tableCells };
}

function genericDescription(title, body) {
  const { prose, listItems, tableCells } = contentCandidates(body);
  const items = listItems.length ? listItems : tableCells;
  const meaningful = prose.find((candidate) => candidate.length >= 12);
  if (
    meaningful &&
    /[:：]\s*$|次の(?:通り|とおり|事項|いずれか)|以下(?:を|の)/.test(
      meaningful,
    ) &&
    items.length
  ) {
    const lead = meaningful.replace(/[:：]\s*$/, "");
    const selected = items
      .slice(0, 2)
      .map((item) => item.replace(/[。！？]+$/g, ""));
    const combined = `${lead}、具体的には${selected.join("と")}を扱う`;
    return ensureSentence(combined);
  }
  if (meaningful) return ensureSentence(firstTwoSentences(meaningful));
  if (items.length >= 2) {
    const selected = items
      .slice(0, 2)
      .map((item) => item.replace(/[。！？]+$/g, ""));
    return ensureSentence(
      `${cleanTitle(title)}は、${selected[0]}と${selected[1]}を扱う`,
    );
  }
  if (items.length === 1) {
    return ensureSentence(`${cleanTitle(title)}は、${items[0]}を扱う`);
  }
  const fallback = prose[0] || cleanTitle(title);
  return ensureSentence(
    `${cleanTitle(title)}の定義、境界、参照関係を示す${fallback ? `資料` : "項目"}`,
  );
}

function backstoryDescription(title, body) {
  const preserved = body.match(
    /^-\s*PreservedCanonPoints:\s*(.+)$/m,
  )?.[1];
  const points = preserved
    ? preserved
        .split(/\s+\/\s+/)
        .map((point) => stripMarkdown(point).replace(/^本人は/, ""))
        .filter(Boolean)
    : [];
  if (points.length && !/^新規稿のため該当なし/.test(points[0])) {
    let content = points[0].replace(/[。！？]+$/g, "");
    if (content.length < 24 && points[1]) {
      content = `${content}、また${points[1].replace(/[。！？]+$/g, "")}`;
    }
    return ensureSentence(content);
  }
  const quotation = body.match(/^>\s*(.+)$/m)?.[1];
  if (quotation) {
    let neutral = firstSentence(quotation)
      .replace(/[。！？]+$/g, "")
      .replace(/私は|わたしは|僕は/g, "本人は")
      .replace(/私の|わたしの|僕の/g, "本人の")
      .replace(/私|わたし|僕/g, "本人")
      .replace(/^あの/, "その")
      .replace(/でした$/g, "だった")
      .replace(/です$/g, "である")
      .replace(/ください$/g, "求めた");
    if (neutral.length < 24) {
      neutral = `${cleanTitle(title)}では、${neutral}`;
    }
    return ensureSentence(neutral);
  }
  return genericDescription(title, body);
}

function decisionDescription(title, body) {
  const subject = cleanTitle(title)
    .replace(/[。！？]+$/g, "")
    .replace(/(?:と確定|を確定|とすることを確定)$/g, "");
  if (subject.length >= 18) {
    return ensureSentence(`${subject}を確定した決定履歴`);
  }
  const generated = genericDescription(title, body).replace(/[。！？]+$/g, "");
  return ensureSentence(`${generated}を確定した決定履歴`);
}

export function deriveDescription(record, overrides = {}) {
  const key = record.relative || record.canonicalFor || "";
  if (overrides[key]) return ensureSentence(overrides[key]);
  let description;
  if (
    record.type === "Backstory Record" ||
    /^backstories\/(?:formation|mastery)\//.test(key)
  ) {
    description = backstoryDescription(record.title, record.body);
  } else if (
    record.type === "Decision Log Entry" ||
    /^decisions\/decision-\d+\.md$/.test(key)
  ) {
    description = decisionDescription(record.title, record.body);
  } else {
    description = genericDescription(record.title, record.body);
  }
  if (description.length < 24) {
    const base = description.replace(/[。！？]+$/g, "");
    if (
      record.type === "Backstory Record" ||
      /^backstories\/(?:formation|mastery)\//.test(key)
    ) {
      description = ensureSentence(`${base}という経験を持つ経歴`);
    } else if (
      record.type === "Decision Log Entry" ||
      /^decisions\/decision-\d+\.md$/.test(key)
    ) {
      description = ensureSentence(`${base}を現行方針として確定した決定履歴`);
    } else {
      description = ensureSentence(`${base}という方針の適用範囲と条件を定める`);
    }
  }
  return description;
}

export function descriptionProblems(description) {
  const problems = [];
  if (description.length < 24 || description.length > 140) {
    problems.push(`length=${description.length}`);
  }
  if (/[\n\r]|[`*#|]|\[[^\]]*\]\(/.test(description)) {
    problems.push("contains Markdown or a newline");
  }
  if (GENERIC_DESCRIPTION_PATTERNS.some((pattern) => pattern.test(description))) {
    problems.push("generic description");
  }
  const sentenceMarks = [...description].filter((char) =>
    "。！？".includes(char),
  ).length;
  if (sentenceMarks !== 1 || !/[。！？]$/.test(description)) {
    problems.push("must be one sentence");
  }
  return problems;
}

function structuredBackstoryFields(body) {
  const match = body.match(
    /^-\s*Era:\s*([^/\n]+)\s*\/\s*Origin:\s*([^/\n]+)\s*\/\s*Relation:\s*(.+)$/m,
  );
  if (!match) return null;
  return {
    era: match[1].trim(),
    origin: match[2].trim(),
    relation: match[3].trim(),
  };
}

function organizationGroupsFromText(value) {
  const groups = new Set();
  if (/Red\s*Star/i.test(value)) groups.add("red-star");
  if (/The\s*Hive|\bHive\b/i.test(value)) groups.add("the-hive");
  if (/Kombinat/i.test(value)) groups.add("kombinat-communities");
  if (/ソフェル|律法|イェツィラー|文字院|マソレット|ティクーン|学舎|修道院/.test(value)) {
    groups.add("sofer-law");
  }
  if (/帝国|Imperial/.test(value)) groups.add("empire");
  if (/革命/.test(value)) groups.add("revolutionary-coalition");
  if (/同盟|評議会|本国|ModernUnion/.test(value)) groups.add("union");
  if (/独立|辺境|開拓|植民|入植|旅団|船団|キャラバン/.test(value)) {
    groups.add("independent-frontier");
  }
  return groups;
}

export function deriveFacets(record) {
  const eras = new Set(Array.isArray(record.metadata.eras) ? record.metadata.eras : []);
  const organizationGroups = new Set(
    Array.isArray(record.metadata.organization_groups)
      ? record.metadata.organization_groups
      : [],
  );
  const organizationNames = new Set(
    Array.isArray(record.metadata.organization_names)
      ? record.metadata.organization_names
      : [],
  );
  const structured = structuredBackstoryFields(record.body);
  if (structured) {
    if (ERA_ORDER.includes(structured.era)) eras.add(structured.era);
    organizationNames.add(structured.origin);
    organizationNames.add(structured.relation);
    for (const group of organizationGroupsFromText(
      `${structured.origin} ${structured.relation}`,
    )) {
      organizationGroups.add(group);
    }
    if (
      organizationGroups.size === 0 &&
      /^(?:無党派|不明|未形成|NotApplicable)$/.test(structured.origin) &&
      /^(?:無党派|不明|未形成|NotApplicable)$/.test(structured.relation)
    ) {
      organizationGroups.add("unaffiliated-unknown");
    } else if (organizationGroups.size === 0) {
      organizationGroups.add("other-named");
    }
  } else {
    const titleEra = cleanTitle(record.title);
    if (ERA_ORDER.includes(titleEra)) eras.add(titleEra);
    const tags = new Set(record.tags || []);
    const pathAndTitle = `${record.relative || ""} ${record.title}`;
    if (tags.has("red-star") || /Red\s*Star/i.test(pathAndTitle)) {
      organizationGroups.add("red-star");
    }
    if (tags.has("the-hive") || /The\s*Hive/i.test(pathAndTitle)) {
      organizationGroups.add("the-hive");
    }
    if (tags.has("kombinat")) organizationGroups.add("kombinat-communities");
    if (tags.has("independent-colony")) {
      organizationGroups.add("independent-frontier");
    }
    if (tags.has("anonymous-sofer")) organizationGroups.add("sofer-law");
  }
  return {
    eras: [...eras].sort(
      (left, right) => ERA_ORDER.indexOf(left) - ERA_ORDER.indexOf(right),
    ),
    organizationGroups: [...organizationGroups].sort(),
    organizationNames: [...organizationNames].filter(Boolean).sort((a, b) =>
      a.localeCompare(b, "ja"),
    ),
  };
}

export function recordTopics(record) {
  const tags = new Set(record.tags || []);
  const domain = record.relative.split("/")[0];
  const searchable = `${record.title} ${record.description}`;
  const topics = TOPIC_DEFINITIONS.filter((topic) => {
    if (topic.domains?.includes(domain)) return true;
    if (topic.tags?.some((tag) => tags.has(tag))) return true;
    return topic.pattern?.test(searchable) || false;
  }).map((topic) => topic.id);
  return topics.length ? [...new Set(topics)] : ["other"];
}

export function readConcepts(bundle) {
  return walk(bundle)
    .filter(
      (file) =>
        file.endsWith(".md") &&
        !["index.md", "log.md"].includes(path.basename(file)) &&
        !toPosix(path.relative(bundle, file)).startsWith("navigation/"),
    )
    .map((file) => {
      const text = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
      const parsed = parseFrontmatter(text);
      const relative = toPosix(path.relative(bundle, file));
      return {
        file,
        relative,
        text,
        body: parsed.body,
        metadata: parsed.metadata,
        title: parsed.metadata.title || path.basename(file, ".md"),
        description: parsed.metadata.description || "",
        type: parsed.metadata.type || "",
        tags: Array.isArray(parsed.metadata.tags) ? parsed.metadata.tags : [],
        eras: Array.isArray(parsed.metadata.eras) ? parsed.metadata.eras : [],
        organizationGroups: Array.isArray(parsed.metadata.organization_groups)
          ? parsed.metadata.organization_groups
          : [],
        organizationNames: Array.isArray(parsed.metadata.organization_names)
          ? parsed.metadata.organization_names
          : [],
      };
    })
    .sort((left, right) => left.relative.localeCompare(right.relative, "ja"));
}
