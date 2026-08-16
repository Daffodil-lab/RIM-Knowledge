const SCHEMA_VERSION = 1;
const ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function uniqueSorted(values, label) {
  if (!Array.isArray(values) || values.some((value) => typeof value !== 'string' || !value)) {
    throw new Error(`${label} must be a string array`);
  }
  return [...new Set(values)].sort(compareText);
}

function requirePositiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${label} must be a positive integer`);
}

function keyOf(item) {
  return `${item.repositoryId}:${item.path}`;
}

function publicFile(item, selectionReasons) {
  return {
    repositoryId: item.repositoryId,
    path: item.path,
    bytes: item.bytes,
    sha256: item.sha256,
    domain: item.domain,
    title: item.title,
    kind: item.documentRole ? 'owner-document' : 'concept',
    knowledgeRole: item.knowledgeRole ?? null,
    canonicalFor: item.canonicalFor ?? null,
    canonicalScope: item.canonicalScope ?? null,
    authority: item.authority ?? null,
    status: item.status ?? null,
    selectionReasons: [...selectionReasons].sort(compareText),
  };
}

function allowedKeys(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  const missing = [...keys].filter((key) => !Object.hasOwn(value, key));
  if (missing.length) throw new Error(`${label} is missing properties: ${missing.join(', ')}`);
  const unknown = Object.keys(value).filter((key) => !keys.has(key));
  if (unknown.length) throw new Error(`${label} has unknown properties: ${unknown.join(', ')}`);
}

function stringValue(value, label, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !value) throw new Error(`${label} must be a non-empty string`);
}

function nonNegativeInteger(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
}

function requireArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
}

function requireUnique(values, label) {
  if (new Set(values.map((value) => JSON.stringify(value))).size !== values.length) throw new Error(`${label} must contain unique items`);
}

export function validateContextPack(pack) {
  const rootKeys = new Set(['schemaVersion', 'taskId', 'objective', 'atlasDigest', 'limits', 'unresolvedSelectors', 'excludedCount', 'files', 'coverage']);
  allowedKeys(pack, rootKeys, 'Context Pack');
  if (pack.schemaVersion !== SCHEMA_VERSION) throw new Error('invalid Context Pack schemaVersion');
  if (!ID.test(pack.taskId ?? '') || typeof pack.objective !== 'string' || !pack.objective.trim()) throw new Error('invalid Context Pack identity');
  if (typeof pack.atlasDigest !== 'string' || !/^[a-f0-9]{64}$/.test(pack.atlasDigest)) throw new Error('invalid Context Pack atlasDigest');
  if (!Array.isArray(pack.files) || !Array.isArray(pack.unresolvedSelectors)) throw new Error('invalid Context Pack file lists');
  pack.unresolvedSelectors.forEach((value) => stringValue(value, 'unresolved selector'));
  requireUnique(pack.unresolvedSelectors, 'unresolvedSelectors');
  nonNegativeInteger(pack.excludedCount, 'excludedCount');
  requirePositiveInteger(pack.limits?.maxFiles, 'maxFiles');
  requirePositiveInteger(pack.limits?.maxBytes, 'maxBytes');
  allowedKeys(pack.limits, new Set(['maxFiles', 'maxBytes']), 'Context Pack limits');
  const fileKeys = new Set(['repositoryId', 'path', 'bytes', 'sha256', 'domain', 'title', 'kind', 'knowledgeRole', 'canonicalFor', 'canonicalScope', 'authority', 'status', 'selectionReasons']);
  for (const file of pack.files) {
    allowedKeys(file, fileKeys, 'Context Pack file');
    for (const key of ['repositoryId', 'path', 'domain', 'title']) stringValue(file[key], `file ${key}`);
    nonNegativeInteger(file.bytes, 'file bytes');
    if (typeof file.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error('file sha256 is invalid');
    if (!['concept', 'owner-document'].includes(file.kind)) throw new Error('file kind is invalid');
    for (const key of ['knowledgeRole', 'canonicalFor', 'canonicalScope', 'authority', 'status']) stringValue(file[key], `file ${key}`, true);
    if (!Array.isArray(file.selectionReasons) || !file.selectionReasons.length) throw new Error('file selectionReasons are required');
    file.selectionReasons.forEach((value) => stringValue(value, 'selection reason'));
  }
  const coverage = pack.coverage;
  const coverageKeys = new Set(['requestedDomains', 'requestedSelectors', 'resolvedSelectors', 'matchedFiles', 'includedFiles', 'includedBytes', 'followedOwners', 'excludedByLimit', 'excludedByOwner', 'truncated']);
  allowedKeys(coverage, coverageKeys, 'Context Pack coverage');
  for (const key of ['requestedDomains', 'requestedSelectors', 'resolvedSelectors', 'followedOwners', 'excludedByLimit', 'excludedByOwner']) requireArray(coverage[key], `coverage ${key}`);
  coverage.requestedDomains.forEach((value) => stringValue(value, 'requested domain'));
  coverage.requestedSelectors.forEach((value) => stringValue(value, 'requested selector'));
  coverage.followedOwners.forEach((value) => stringValue(value, 'followed owner'));
  requireUnique(coverage.requestedDomains, 'requestedDomains');
  requireUnique(coverage.requestedSelectors, 'requestedSelectors');
  requireUnique(coverage.followedOwners, 'followedOwners');
  for (const resolved of coverage.resolvedSelectors) {
    allowedKeys(resolved, new Set(['selector', 'matchedBy', 'paths']), 'resolved selector');
    stringValue(resolved.selector, 'resolved selector value');
    if (!['canonical_for', 'path'].includes(resolved.matchedBy)) throw new Error('resolved selector matchedBy is invalid');
    if (!Array.isArray(resolved.paths) || !resolved.paths.length) throw new Error('resolved selector paths are required');
    resolved.paths.forEach((value) => stringValue(value, 'resolved selector path'));
  }
  for (const exclusion of coverage.excludedByLimit) {
    allowedKeys(exclusion, new Set(['repositoryId', 'path', 'reason']), 'limit exclusion');
    stringValue(exclusion.repositoryId, 'exclusion repositoryId');
    stringValue(exclusion.path, 'exclusion path');
    if (!['max-files', 'max-bytes'].includes(exclusion.reason)) throw new Error('limit exclusion reason is invalid');
  }
  for (const exclusion of coverage.excludedByOwner) {
    allowedKeys(exclusion, new Set(['repositoryId', 'path', 'missingOwners']), 'owner exclusion');
    stringValue(exclusion.repositoryId, 'owner exclusion repositoryId');
    stringValue(exclusion.path, 'owner exclusion path');
    if (!Array.isArray(exclusion.missingOwners) || !exclusion.missingOwners.length) throw new Error('owner exclusion requires missingOwners');
    exclusion.missingOwners.forEach((value) => stringValue(value, 'missing owner'));
    requireUnique(exclusion.missingOwners, 'missingOwners');
  }
  if (!Number.isSafeInteger(coverage.matchedFiles) || !Number.isSafeInteger(coverage.includedFiles) || !Number.isSafeInteger(coverage.includedBytes)) {
    throw new Error('invalid Context Pack coverage counts');
  }
  if (coverage.includedFiles !== pack.files.length) throw new Error('Context Pack includedFiles mismatch');
  if (coverage.includedBytes !== pack.files.reduce((total, file) => total + file.bytes, 0)) throw new Error('Context Pack includedBytes mismatch');
  if (pack.excludedCount !== coverage.excludedByLimit.length + coverage.excludedByOwner.length) throw new Error('Context Pack excludedCount mismatch');
  if (coverage.matchedFiles !== pack.files.length + pack.excludedCount) throw new Error('Context Pack matchedFiles mismatch');
  if (coverage.truncated !== (pack.excludedCount > 0)) throw new Error('Context Pack truncated mismatch');
  if ('tokenUsage' in pack || 'tokenUsage' in coverage) throw new Error('token usage does not belong in Context Pack');
  return pack;
}

export function buildContextPack({ atlas, taskId, objective, domains = [], selectors = [], maxFiles = 24, maxBytes = 200000 }) {
  if (!ID.test(taskId ?? '') || typeof objective !== 'string' || !objective.trim()) throw new Error('taskId and objective are required');
  if (!atlas || typeof atlas.digest !== 'string') throw new Error('a stable Atlas digest is required');
  requirePositiveInteger(maxFiles, 'maxFiles');
  requirePositiveInteger(maxBytes, 'maxBytes');
  const requestedDomains = uniqueSorted(domains, 'domains');
  const requestedSelectors = uniqueSorted(selectors, 'selectors');
  if (!requestedDomains.length && !requestedSelectors.length) throw new Error('at least one domain or selector is required');

  const eligibleConcepts = atlas.concepts;
  const allFiles = [...eligibleConcepts, ...(atlas.ownerDocuments ?? [])];
  const byKey = new Map(allFiles.map((item) => [keyOf(item), item]));
  const edgesBySource = new Map();
  for (const edge of atlas.ownerEdges ?? []) {
    const source = `${edge.repositoryId}:${edge.from}`;
    if (!edgesBySource.has(source)) edgesBySource.set(source, []);
    edgesBySource.get(source).push(edge);
  }
  for (const edges of edgesBySource.values()) edges.sort((left, right) => compareText(left.to, right.to));

  const selected = new Map();
  const followedOwners = new Set();
  function selectWithOwners(item, reason, trail = new Set()) {
    const key = keyOf(item);
    if (!selected.has(key)) selected.set(key, { item, reasons: new Set() });
    selected.get(key).reasons.add(reason);
    if (trail.has(key)) return;
    const nextTrail = new Set(trail).add(key);
    for (const edge of edgesBySource.get(key) ?? []) {
      const targetKey = `${edge.repositoryId}:${edge.to}`;
      const target = byKey.get(targetKey);
      if (!target) throw new Error(`Atlas owner target is unavailable to Context Pack: ${targetKey}`);
      followedOwners.add(targetKey);
      selectWithOwners(target, `canonical-owner:${item.path}`, nextTrail);
    }
  }

  const resolvedSelectors = [];
  const unresolvedSelectors = [];
  for (const selector of requestedSelectors) {
    let matches = eligibleConcepts.filter((item) => item.canonicalFor === selector);
    let matchedBy = 'canonical_for';
    if (!matches.length) {
      matches = eligibleConcepts.filter((item) => item.path === selector);
      matchedBy = 'path';
    }
    matches.sort((left, right) => compareText(keyOf(left), keyOf(right)));
    if (!matches.length) {
      unresolvedSelectors.push(selector);
      continue;
    }
    resolvedSelectors.push({ selector, matchedBy, paths: matches.map((item) => item.path) });
    for (const item of matches) selectWithOwners(item, `selector:${selector}`);
  }
  for (const domain of requestedDomains) {
    const matches = eligibleConcepts.filter((item) => item.domain === domain).sort((left, right) => compareText(keyOf(left), keyOf(right)));
    for (const item of matches) selectWithOwners(item, `domain:${domain}`);
  }

  const ordered = [];
  const orderedKeys = new Set();
  function ownerFirst(item, trail = new Set()) {
    const key = keyOf(item);
    if (orderedKeys.has(key)) return;
    if (trail.has(key)) throw new Error(`Context Pack owner cycle: ${[...trail, key].join(' -> ')}`);
    const nextTrail = new Set(trail).add(key);
    for (const edge of edgesBySource.get(key) ?? []) ownerFirst(byKey.get(`${edge.repositoryId}:${edge.to}`), nextTrail);
    orderedKeys.add(key);
    ordered.push(selected.get(key));
  }
  for (const { item } of selected.values()) ownerFirst(item);

  const files = [];
  const includedKeys = new Set();
  const excludedByLimit = [];
  const excludedByOwner = [];
  let includedBytes = 0;
  for (const { item, reasons } of ordered) {
    const key = keyOf(item);
    const missingOwners = (edgesBySource.get(key) ?? []).map((edge) => `${edge.repositoryId}:${edge.to}`).filter((ownerKey) => !includedKeys.has(ownerKey));
    if (missingOwners.length) {
      excludedByOwner.push({ repositoryId: item.repositoryId, path: item.path, missingOwners });
      continue;
    }
    const reason = files.length >= maxFiles ? 'max-files' : includedBytes + item.bytes > maxBytes ? 'max-bytes' : null;
    if (reason) {
      excludedByLimit.push({ repositoryId: item.repositoryId, path: item.path, reason });
      continue;
    }
    files.push(publicFile(item, reasons));
    includedKeys.add(key);
    includedBytes += item.bytes;
  }

  const includedOwnerKeys = [...followedOwners].filter((ownerKey) => includedKeys.has(ownerKey)).sort(compareText);

  return validateContextPack({
    schemaVersion: SCHEMA_VERSION,
    taskId,
    objective,
    atlasDigest: atlas.digest,
    limits: { maxFiles, maxBytes },
    unresolvedSelectors,
    excludedCount: excludedByLimit.length + excludedByOwner.length,
    files,
    coverage: {
      requestedDomains,
      requestedSelectors,
      resolvedSelectors,
      matchedFiles: selected.size,
      includedFiles: files.length,
      includedBytes,
      followedOwners: includedOwnerKeys,
      excludedByLimit,
      excludedByOwner,
      truncated: excludedByLimit.length > 0 || excludedByOwner.length > 0,
    },
  });
}
