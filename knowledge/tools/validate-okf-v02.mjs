import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BUNDLE = path.join(ROOT, "knowledge");
const args = new Set(process.argv.slice(2));
const allowedArgs = new Set(["--strict", "--json", "--verbose"]);
const unknownArgs = [...args].filter((arg) => !allowedArgs.has(arg));
const strict = args.has("--strict");
const json = args.has("--json");
const verbose = args.has("--verbose");

if (unknownArgs.length) {
  console.error(`不明な引数です: ${unknownArgs.join(", ")}`);
  console.error("使用法: node knowledge/tools/validate-okf-v02.mjs [--strict] [--json] [--verbose]");
  process.exit(2);
}

const errors = [];
const warnings = [];
const coverage = {
  concepts: 0,
  reservedFiles: 0,
  generated: 0,
  generatedDatePrecision: 0,
  sourceConcepts: 0,
  sourceEntries: 0,
  verifiedConcepts: 0,
  humanVerifiedConcepts: 0,
  processVerifiedConcepts: 0,
  staleAfter: 0,
  attestedComputations: 0,
};

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}

function issue(target, file, code, message) {
  target.push({ file: rel(file), code, message });
}

function unquote(value = "") {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function splitFlow(value) {
  const items = [];
  let start = 0;
  let quote = null;
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (char === quote && value[index - 1] !== "\\") quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "{" || char === "[") depth += 1;
    if (char === "}" || char === "]") depth -= 1;
    if (char === "," && depth === 0) {
      items.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  items.push(value.slice(start).trim());
  return items.filter(Boolean);
}

function parseFlowMapping(value) {
  const trimmed = value.trim().replace(/^\{/, "").replace(/\}$/, "");
  const result = {};
  for (const item of splitFlow(trimmed)) {
    const colon = item.indexOf(":");
    if (colon < 1) continue;
    result[item.slice(0, colon).trim()] = unquote(item.slice(colon + 1));
  }
  return result;
}

function parseIndentedMapping(lines) {
  const result = {};
  for (const line of lines) {
    const match = line.match(/^\s*(?:-\s*)?([A-Za-z_][\w-]*):\s*(.*)$/);
    if (match) result[match[1]] = unquote(match[2]);
  }
  return result;
}

function extractDocument(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) return null;
  return {
    frontmatter: match[1],
    body: text.slice(match[0].length),
  };
}

function parseTopLevel(frontmatter) {
  const lines = frontmatter.split("\n");
  const entries = new Map();
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!match) continue;
    let end = index + 1;
    while (end < lines.length && !/^[A-Za-z_][\w-]*:\s*/.test(lines[end])) end += 1;
    entries.set(match[1], {
      value: match[2].trim(),
      lines: lines.slice(index + 1, end),
    });
    index = end - 1;
  }
  return entries;
}

function basicYamlProblems(frontmatter) {
  const problems = [];
  const seenTopLevel = new Set();
  let quote = null;
  const stack = [];

  for (const [lineIndex, line] of frontmatter.split("\n").entries()) {
    if (/^ +\t|^\t/.test(line)) {
      problems.push(`${lineIndex + 1}行目のインデントにタブがあります`);
    }
    if (line && !/^\s/.test(line) && !/^\s*#/.test(line)) {
      const key = line.match(/^([A-Za-z_][\w-]*):/);
      if (!key) problems.push(`${lineIndex + 1}行目がトップレベルのkey: value形式ではありません`);
      else if (seenTopLevel.has(key[1])) problems.push(`${lineIndex + 1}行目でキー${key[1]}が重複しています`);
      else seenTopLevel.add(key[1]);
    }

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (quote) {
        if (char === quote && line[index - 1] !== "\\") quote = null;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        continue;
      }
      if (char === "{" || char === "[") stack.push(char);
      if (char === "}" || char === "]") {
        const expected = char === "}" ? "{" : "[";
        if (stack.pop() !== expected) problems.push(`${lineIndex + 1}行目のフロー記号${char}が対応していません`);
      }
    }
  }
  if (quote) problems.push("引用符が閉じていません");
  if (stack.length) problems.push("フロー形式の括弧が閉じていません");
  return [...new Set(problems)];
}

function mappingFromEntry(entry) {
  if (!entry) return null;
  if (entry.value.startsWith("{")) return parseFlowMapping(entry.value);
  if (!entry.value && entry.lines.length) return parseIndentedMapping(entry.lines);
  return null;
}

function listMappingsFromEntry(entry) {
  if (!entry) return [];
  if (entry.value.startsWith("{")) return [parseFlowMapping(entry.value)];
  if (entry.value.startsWith("[")) {
    return [...entry.value.matchAll(/\{([^{}]*)\}/g)].map((match) =>
      parseFlowMapping(`{${match[1]}}`),
    );
  }
  if (entry.value) return [];

  const groups = [];
  let current = [];
  for (const line of entry.lines) {
    if (/^\s*-\s*/.test(line)) {
      if (current.length) groups.push(current);
      current = [line];
    } else if (current.length) {
      current.push(line);
    }
  }
  if (current.length) groups.push(current);
  if (groups.length) {
    return groups.map((group) => {
      const inline = group[0].match(/^\s*-\s*(\{.*\})\s*$/);
      return inline ? parseFlowMapping(inline[1]) : parseIndentedMapping(group);
    });
  }
  const mapping = parseIndentedMapping(entry.lines);
  return Object.keys(mapping).length ? [mapping] : [];
}

function parseSources(entry) {
  return listMappingsFromEntry(entry);
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function isValidDateTime(value) {
  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/.test(value) &&
    !Number.isNaN(Date.parse(value))
  );
}

function isActor(value, allowTeam = false) {
  if (/^(?:human|process):\S+$/.test(value)) return true;
  if (/^[^\s/:]+\/[^\s/]+$/.test(value)) return true;
  return allowTeam && /^team:\S+$/.test(value);
}

function scalar(entries, key) {
  const entry = entries.get(key);
  return entry ? unquote(entry.value) : "";
}

function validateReserved(file, text) {
  coverage.reservedFiles += 1;
  const basename = path.basename(file);
  const document = extractDocument(text);
  const startsWithFrontmatter = text.startsWith("---\n");
  const isRootIndex = file === path.join(BUNDLE, "index.md");

  if (basename === "log.md" && startsWithFrontmatter) {
    issue(errors, file, "reserved-log-frontmatter", "log.mdにfrontmatterは置けません。本文だけにしてください。");
  }
  if (basename === "index.md" && !isRootIndex && startsWithFrontmatter) {
    issue(errors, file, "reserved-index-frontmatter", "下位index.mdにfrontmatterは置けません。");
  }
  if (isRootIndex && startsWithFrontmatter && !document) {
    issue(errors, file, "invalid-root-frontmatter", "ルートindex.mdのfrontmatterを正しく閉じてください。");
  }
  if (isRootIndex && document) {
    const entries = parseTopLevel(document.frontmatter);
    const otherKeys = [...entries.keys()].filter((key) => key !== "okf_version");
    if (otherKeys.length) {
      issue(
        errors,
        file,
        "root-index-extra-frontmatter",
        `ルートindex.mdのfrontmatterにはokf_version以外を置けません: ${otherKeys.join(", ")}`,
      );
    }
    const version = scalar(entries, "okf_version");
    if (version && version !== "0.2") {
      issue(errors, file, "unsupported-version", `この検証器が対応するokf_versionは0.2です: ${version}`);
    }
  }

  if (basename === "log.md") {
    const dates = [...text.matchAll(/^#{1,6}\s+(\d{4}-\d{2}-\d{2})(?:\s|$)/gm)].map(
      (match) => match[1],
    );
    for (const date of dates) {
      if (!isValidDate(date)) {
        issue(errors, file, "invalid-log-date", `ログ見出しの日付がYYYY-MM-DDの実在日ではありません: ${date}`);
      }
    }
    for (let index = 1; index < dates.length; index += 1) {
      if (dates[index] > dates[index - 1]) {
        issue(warnings, file, "log-order", "log.mdの日付見出しは新しい順を推奨します。");
        break;
      }
    }
  }
}

function validateConcept(file, text) {
  coverage.concepts += 1;
  const document = extractDocument(text);
  if (!document) {
    issue(errors, file, "missing-frontmatter", "概念Markdownには先頭YAML frontmatterが必要です。");
    return;
  }

  const entries = parseTopLevel(document.frontmatter);
  for (const problem of basicYamlProblems(document.frontmatter)) {
    issue(errors, file, "invalid-yaml", `frontmatterのYAML基本構文が不正です: ${problem}。`);
  }
  const type = scalar(entries, "type");
  if (!type) issue(errors, file, "missing-type", "OKF 0.2で常に必須のtypeがありません。");

  const status = scalar(entries, "status");
  if (status && !["draft", "stable", "deprecated"].includes(status)) {
    issue(warnings, file, "invalid-status", `statusはdraft、stable、deprecatedのいずれかを推奨します: ${status}`);
  }

  const generatedEntry = entries.get("generated");
  if (generatedEntry) {
    coverage.generated += 1;
    const generated = mappingFromEntry(generatedEntry);
    if (!generated || !generated.by) {
      issue(errors, file, "generated-by-required", "generatedを置く場合はgenerated.byが必須です。");
    } else if (!isActor(generated.by)) {
      issue(warnings, file, "invalid-generated-actor", `generated.byの主体表記をOKF規約へ合わせてください: ${generated.by}`);
    }
    if (generated?.at && !isValidDateTime(generated.at)) {
      issue(
        warnings,
        file,
        "generated-at-datetime",
        `generated.atはISO 8601日時を推奨します: ${generated.at}`,
      );
    }
    if (generated?.precision) {
      if (generated.precision !== "date") {
        issue(
          warnings,
          file,
          "generated-precision",
          `RIM拡張のgenerated.precisionはdateだけを使用します: ${generated.precision}`,
        );
      } else {
        coverage.generatedDatePrecision += 1;
        if (!/^\d{4}-\d{2}-\d{2}T00:00:00Z$/.test(generated.at || "")) {
          issue(
            warnings,
            file,
            "generated-date-precision",
            "generated.precision: dateにはYYYY-MM-DDT00:00:00Z形式のgenerated.atが必要です。",
          );
        }
      }
    }
  }

  const sourceEntry = entries.get("sources");
  if (sourceEntry) {
    coverage.sourceConcepts += 1;
    const sources = parseSources(sourceEntry);
    if (!sources.length) {
      issue(errors, file, "invalid-sources", "sourcesは出典マッピングのリストにしてください。");
    }
    coverage.sourceEntries += sources.length;
    const sourceIds = new Set();
    for (const [index, source] of sources.entries()) {
      const label = source.id || `#${index + 1}`;
      if (!source.resource) {
        issue(errors, file, "source-resource-required", `出典${label}に必須のresourceがありません。`);
      }
      if (source.id) sourceIds.add(source.id);
      if (source.usage_count && !/^\d+$/.test(source.usage_count)) {
        issue(warnings, file, "source-usage-count", `出典${label}のusage_countは0以上の整数にしてください。`);
      }
      if (source.last_modified && !isValidDate(source.last_modified)) {
        issue(warnings, file, "source-last-modified", `出典${label}のlast_modifiedはYYYY-MM-DDにしてください。`);
      }
      if (source.author && !isActor(source.author, true)) {
        issue(warnings, file, "source-author-actor", `出典${label}のauthorはOKFの主体表記に合わせてください: ${source.author}`);
      }
      if (source.usage_count && !source.usage_window && !entries.has("usage_window")) {
        issue(warnings, file, "usage-window-recommended", `出典${label}にusage_countがあるためusage_windowも記録してください。`);
      }
    }

    const citationIds = new Set(
      [...document.body.matchAll(/\[\^([^\]]+)\](?!:)/g)].map((match) => match[1]),
    );
    for (const citationId of citationIds) {
      if (!sourceIds.has(citationId)) {
        issue(warnings, file, "citation-source-missing", `脚注[^${citationId}]に対応するsources.idがありません。`);
      }
    }
  }

  const verifiedEntry = entries.get("verified");
  if (verifiedEntry) {
    coverage.verifiedConcepts += 1;
    const events = listMappingsFromEntry(verifiedEntry);
    if (!events.length) {
      issue(warnings, file, "invalid-verified", "verifiedは検証イベントのマッピングまたはリストを推奨します。");
    }
    let human = false;
    let process = false;
    for (const [index, event] of events.entries()) {
      if (!event.by || !event.at) {
        issue(warnings, file, "verified-fields-recommended", `verifiedの第${index + 1}イベントにはbyとatを記録してください。`);
        continue;
      }
      if (!isActor(event.by)) {
        issue(warnings, file, "invalid-verified-actor", `verified.byの主体表記をOKF規約へ合わせてください: ${event.by}`);
      }
      if (!isValidDateTime(event.at)) {
        issue(warnings, file, "invalid-verified-datetime", `verified.atはISO 8601日時を推奨します: ${event.at}`);
      }
      human ||= event.by.startsWith("human:");
      process ||= !event.by.startsWith("human:");
    }
    if (human) coverage.humanVerifiedConcepts += 1;
    if (process) coverage.processVerifiedConcepts += 1;
  }

  const staleAfter = scalar(entries, "stale_after");
  if (entries.has("stale_after")) {
    coverage.staleAfter += 1;
    if (!isValidDate(staleAfter)) {
      issue(warnings, file, "invalid-stale-after", `stale_afterはYYYY-MM-DDを推奨します: ${staleAfter}`);
    } else if (staleAfter <= new Date().toISOString().slice(0, 10)) {
      issue(warnings, file, "stale", `stale_after（${staleAfter}）を過ぎています。内容を再確認してください。`);
    }
  }

  if (type === "Attested Computation") {
    coverage.attestedComputations += 1;
    const runtime = entries.get("runtime");
    if (!runtime || (!runtime.value && !runtime.lines.some((line) => line.trim()))) {
      issue(errors, file, "attested-runtime-required", "Attested Computationにはruntimeが必須です。");
    }
    const hasInlineComputation = /^#\s+Computation\s*$/m.test(document.body) && /```[\s\S]*?```/m.test(document.body);
    if (!entries.has("computation") && !hasInlineComputation) {
      issue(warnings, file, "attested-computation-recommended", "computationパスまたは本文の# Computationコードブロックを記録してください。");
    }
    for (const key of ["executor", "attester"]) {
      if (!entries.has(key)) issue(warnings, file, `attested-${key}-recommended`, `Attested Computationには${key}の記録を推奨します。`);
    }
  }
}

if (!fs.existsSync(BUNDLE)) {
  console.error("knowledge/がありません。OKFバンドルをプロジェクトルートへ配置してください。");
  process.exit(1);
}

const markdownFiles = walk(BUNDLE).filter((file) => file.endsWith(".md"));
for (const file of markdownFiles) {
  const text = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const basename = path.basename(file);
  if (basename === "index.md" || basename === "log.md") validateReserved(file, text);
  else validateConcept(file, text);
}

const result = {
  okfVersion: "0.2",
  mode: strict ? "strict" : "normal",
  passed: errors.length === 0 && (!strict || warnings.length === 0),
  coverage: {
    ...coverage,
    unverifiedConcepts: coverage.concepts - coverage.verifiedConcepts,
  },
  errors,
  warnings,
};

if (json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`OKF 0.2互換性検証（${strict ? "厳格" : "通常"}モード）`);
  console.log(`概念: ${coverage.concepts} / 予約ファイル: ${coverage.reservedFiles}`);
  console.log(
    `来歴: generated ${coverage.generated}（日付精度 ${coverage.generatedDatePrecision}）/ sources ${coverage.sourceConcepts}概念・${coverage.sourceEntries}件`,
  );
  console.log(
    `信頼・鮮度: verified ${coverage.verifiedConcepts}（人 ${coverage.humanVerifiedConcepts} / 処理 ${coverage.processVerifiedConcepts}）/ 未検証 ${coverage.concepts - coverage.verifiedConcepts} / stale_after ${coverage.staleAfter}`,
  );
  console.log(`実行証明: Attested Computation ${coverage.attestedComputations}`);

  const printIssues = (label, items) => {
    if (!items.length) return;
    console.log(`\n${label}: ${items.length}件`);
    const visible = verbose ? items : items.slice(0, 30);
    for (const item of visible) console.log(`- ${item.file} [${item.code}] ${item.message}`);
    if (visible.length < items.length) {
      console.log(`- ほか${items.length - visible.length}件（全件表示は--verbose）`);
    }
  };

  printIssues("エラー", errors);
  printIssues("警告", warnings);
  console.log(
    `\n判定: ${result.passed ? "合格" : "不合格"}${strict && warnings.length ? "（厳格モードでは警告も不合格）" : ""}`,
  );
}

process.exit(result.passed ? 0 : 1);
