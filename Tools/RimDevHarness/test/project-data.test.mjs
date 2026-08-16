import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { atomicWrite, readArtifact, safePath } from '../lib/artifact-store.mjs';
import { buildContextPack, validateContextPack } from '../lib/context-pack.mjs';
import { buildProjectAtlas, validateProjectAtlas } from '../lib/project-atlas.mjs';
import { initRunLedger, validateRunLedger } from '../lib/run-ledger.mjs';
import { main as projectDataMain } from '../scripts/project-data.mjs';

const harnessRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(harnessRoot, '..', '..');
const configPath = path.join(harnessRoot, 'atlas.config.json');
const cliPath = path.join(harnessRoot, 'scripts', 'project-data.mjs');
const realAtlasPromise = buildProjectAtlas({ configPath, repoRoot: repositoryRoot });

function concept(overrides) {
  return {
    repositoryId: 'repo', path: 'governance/a.md', bytes: 10, sha256: '1'.repeat(64), domain: 'governance', knowledgeRole: 'source-of-truth', canonicalFor: 'subject/a', canonicalScope: 'scope/a', canonicalOwners: [], authority: 'canonical', status: 'stable', title: 'A',
    ...overrides,
  };
}

function sampleAtlas() {
  const concepts = [
    concept({ path: 'governance/a.md', canonicalFor: 'subject/a', canonicalOwners: ['/world/index.md'], title: 'A' }),
    concept({ path: 'governance/b.md', canonicalFor: 'subject/b', bytes: 11, title: 'B' }),
    concept({ path: 'roadmap/c.md', canonicalFor: 'subject/c', domain: 'roadmap', bytes: 12, title: 'C' }),
    concept({ path: 'subject/a', canonicalFor: 'different-subject', domain: 'other', bytes: 13, title: 'Path collision' }),
  ];
  return {
    schemaVersion: 1,
    digestKind: 'knowledge-content-snapshot-v1',
    digest: 'a'.repeat(64),
    generatedAt: '2026-08-16T00:00:00.000Z',
    repositories: [],
    concepts,
    ownerDocuments: [{ repositoryId: 'repo', path: 'world/index.md', bytes: 8, sha256: '2'.repeat(64), domain: 'world', title: 'World', documentRole: 'canonical-owner-target' }],
    subjectOwners: { 'subject/a': 'governance/a.md', 'subject/b': 'governance/b.md', 'subject/c': 'roadmap/c.md' },
    ownerEdges: [{ repositoryId: 'repo', from: 'governance/a.md', to: 'world/index.md' }],
    scopeMemberships: { 'scope/a': ['governance/a.md'] },
    implementationMarkers: [],
    implementationObservation: 'not-observed-in-configured-repositories',
    diagnostics: { duplicateSubjects: [], missingOwners: [], ownerCycles: [] },
  };
}

function markdown({ title, canonicalFor, canonicalScope, owners = [] }) {
  const ownerYaml = owners.length ? `canonical_owner:\n${owners.map((owner) => `  - "${owner}"`).join('\n')}\n` : '';
  return `---\ntype: "Fixture"\ntitle: "${title}"\nstatus: stable\nauthority: canonical\nknowledge_role: source-of-truth\ncanonical_for: "${canonicalFor}"\n${canonicalScope ? `canonical_scope: "${canonicalScope}"\n` : ''}${ownerYaml}---\n\n# ${title}\n`;
}

async function fixtureRepository(files) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'project-atlas-fixture-'));
  for (const [relative, content] of Object.entries(files)) {
    const target = path.join(root, 'knowledge', ...relative.split('/'));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, 'utf8');
  }
  const fixtureConfig = path.join(root, 'atlas.config.json');
  await fs.writeFile(fixtureConfig, JSON.stringify({ schemaVersion: 1, repositories: [{ id: 'fixture', kind: 'knowledge', path: '.', knowledgeRoot: 'knowledge', implementationRoots: [], observeGit: false }] }), 'utf8');
  return { root, configPath: fixtureConfig };
}

function resolveRef(root, reference) {
  return reference.slice(2).split('/').reduce((value, segment) => value[segment.replaceAll('~1', '/').replaceAll('~0', '~')], root);
}

function isRfc3339DateTime(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/);
  if (!match) return false;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, zone, offsetHourText, offsetMinuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= monthDays[month - 1] && Number(hourText) <= 23 && Number(minuteText) <= 59 && Number(secondText) <= 59 && (zone === 'Z' || (Number(offsetHourText) <= 23 && Number(offsetMinuteText) <= 59));
}

function schemaAccepts(schema, value, root = schema) {
  if (schema.$ref) return schemaAccepts(resolveRef(root, schema.$ref), value, root);
  if (schema.oneOf) return schema.oneOf.filter((candidate) => schemaAccepts(candidate, value, root)).length === 1;
  if (schema.allOf?.some((candidate) => !schemaAccepts(candidate, value, root))) return false;
  if (schema.if && schemaAccepts(schema.if, value, root) && schema.then && !schemaAccepts(schema.then, value, root)) return false;
  if (Object.hasOwn(schema, 'const') && value !== schema.const) return false;
  if (schema.enum && !schema.enum.includes(value)) return false;
  const types = schema.type === undefined ? [] : Array.isArray(schema.type) ? schema.type : [schema.type];
  if (types.length) {
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : Number.isInteger(value) ? 'integer' : typeof value;
    if (!types.includes(actual) && !(actual === 'integer' && types.includes('number'))) return false;
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) return false;
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) return false;
    if (schema.format === 'date-time' && !isRfc3339DateTime(value)) return false;
  }
  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) return false;
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) return false;
    if (schema.maxItems !== undefined && value.length > schema.maxItems) return false;
    if (schema.uniqueItems && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) return false;
    if (schema.items && value.some((item) => !schemaAccepts(schema.items, item, root))) return false;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (schema.required?.some((key) => !Object.hasOwn(value, key))) return false;
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) {
        if (!schemaAccepts(schema.properties[key], item, root)) return false;
      } else if (schema.additionalProperties === false) return false;
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object' && !schemaAccepts(schema.additionalProperties, item, root)) return false;
    }
  }
  return true;
}

test('real Atlas separates subject ownership, document ownership, scopes, and diagnostics', async () => {
  const atlas = await realAtlasPromise;
  assert.equal(atlas.subjectOwners['authoring/shion-japanese-first-language-policy'], 'authoring/23-日本語優先表記規則.md');
  assert.equal(atlas.ownerEdges.some((edge) => edge.to === 'authoring/shion-japanese-first-language-policy'), false);
  assert.equal(atlas.ownerEdges.some((edge) => edge.from === 'player-facing/012-最小用語集.md' && edge.to === 'world/index.md'), true);
  assert.equal(atlas.ownerDocuments.some((item) => item.path === 'world/index.md'), true);
  assert.equal(atlas.scopeMemberships['authoring-and-disclosure'].includes('authoring/23-日本語優先表記規則.md'), true);
  assert.deepEqual(atlas.diagnostics, { duplicateSubjects: [], missingOwners: [], ownerCycles: [] });
  assert.equal(atlas.implementationObservation, 'not-observed-in-configured-repositories');
  assert.ok(atlas.concepts.length > 1800);
});

test('Atlas digest is stable across timestamps and absolute worktree roots', async () => {
  const files = { 'a/one.md': markdown({ title: 'One', canonicalFor: 'one', canonicalScope: 'scope' }) };
  const left = await fixtureRepository(files);
  const right = await fixtureRepository(files);
  const first = await buildProjectAtlas({ ...left, repoRoot: left.root, generatedAt: '2026-01-01T00:00:00.000Z' });
  const second = await buildProjectAtlas({ ...right, repoRoot: right.root, generatedAt: '2026-02-01T00:00:00.000Z' });
  assert.equal(first.digest, second.digest);
  assert.notEqual(first.generatedAt, second.generatedAt);
});

test('Atlas rejects duplicate subjects', async () => {
  const fixture = await fixtureRepository({
    'a/one.md': markdown({ title: 'One', canonicalFor: 'same' }),
    'b/two.md': markdown({ title: 'Two', canonicalFor: 'same' }),
  });
  await assert.rejects(() => buildProjectAtlas({ configPath: fixture.configPath, repoRoot: fixture.root }), /duplicate canonical_for/);
});

test('Atlas rejects missing canonical owner documents', async () => {
  const fixture = await fixtureRepository({ 'a/one.md': markdown({ title: 'One', canonicalFor: 'one', owners: ['/missing.md'] }) });
  await assert.rejects(() => buildProjectAtlas({ configPath: fixture.configPath, repoRoot: fixture.root }), /missing canonical owner/);
});

test('Atlas rejects canonical owner cycles', async () => {
  const fixture = await fixtureRepository({
    'a/one.md': markdown({ title: 'One', canonicalFor: 'one', owners: ['two.md'] }),
    'a/two.md': markdown({ title: 'Two', canonicalFor: 'two', owners: ['one.md'] }),
  });
  await assert.rejects(() => buildProjectAtlas({ configPath: fixture.configPath, repoRoot: fixture.root }), /canonical_owner cycle/);
});

test('Wave 1 Atlas rejects ambiguous multi-repository configuration', async () => {
  const fixture = await fixtureRepository({ 'a/one.md': markdown({ title: 'One', canonicalFor: 'one' }) });
  const repository = { id: 'one', kind: 'knowledge', path: '.', knowledgeRoot: 'knowledge', implementationRoots: [], observeGit: false };
  await fs.writeFile(fixture.configPath, JSON.stringify({ schemaVersion: 1, repositories: [repository, { ...repository, id: 'two' }] }), 'utf8');
  await assert.rejects(() => buildProjectAtlas({ configPath: fixture.configPath, repoRoot: fixture.root }), /exactly one repository/);
});

test('Atlas fails closed when configured Git observation is unavailable', async () => {
  const fixture = await fixtureRepository({ 'a/one.md': markdown({ title: 'One', canonicalFor: 'one' }) });
  await fs.writeFile(fixture.configPath, JSON.stringify({ schemaVersion: 1, repositories: [{ id: 'fixture', kind: 'knowledge', path: '.', knowledgeRoot: 'knowledge', implementationRoots: [] }] }), 'utf8');
  await assert.rejects(() => buildProjectAtlas({ configPath: fixture.configPath, repoRoot: fixture.root }), /Git observation failed/);
});

test('Context Pack applies domain and selector as a union and follows owners', () => {
  const pack = buildContextPack({ atlas: sampleAtlas(), taskId: 'union', objective: 'Union', domains: ['roadmap'], selectors: ['subject/a'], maxFiles: 10, maxBytes: 1000 });
  assert.deepEqual(pack.coverage.resolvedSelectors, [{ selector: 'subject/a', matchedBy: 'canonical_for', paths: ['governance/a.md'] }]);
  assert.deepEqual(pack.files.map((item) => item.path), ['world/index.md', 'governance/a.md', 'roadmap/c.md']);
  assert.deepEqual(pack.coverage.followedOwners, ['repo:world/index.md']);
  assert.equal(pack.files.some((item) => item.path === 'subject/a'), false, 'canonical_for takes precedence over an exact path collision');
});

test('Context Pack domain-only and selector-only selections differ deterministically', () => {
  const atlas = sampleAtlas();
  const byDomain = buildContextPack({ atlas, taskId: 'domain', objective: 'Domain', domains: ['governance'] });
  const bySelector = buildContextPack({ atlas, taskId: 'selector', objective: 'Selector', selectors: ['subject/c'] });
  assert.deepEqual(byDomain.files.map((item) => item.path), ['world/index.md', 'governance/a.md', 'governance/b.md']);
  assert.deepEqual(bySelector.files.map((item) => item.path), ['roadmap/c.md']);
});

test('Context Pack enforces both limits and reports exact unresolved selectors', () => {
  const atlas = sampleAtlas();
  const fileLimited = buildContextPack({ atlas, taskId: 'files', objective: 'Files', domains: ['governance'], selectors: ['missing'], maxFiles: 1, maxBytes: 1000 });
  assert.deepEqual(fileLimited.unresolvedSelectors, ['missing']);
  assert.equal(fileLimited.coverage.truncated, true);
  assert.ok(fileLimited.coverage.excludedByLimit.every((item) => item.reason === 'max-files'));
  const byteLimited = buildContextPack({ atlas, taskId: 'bytes', objective: 'Bytes', selectors: ['subject/a'], maxFiles: 10, maxBytes: 10 });
  assert.equal(byteLimited.files.length, 1);
  assert.equal(byteLimited.coverage.excludedByLimit[0].reason, 'max-bytes');
  assert.equal('tokenUsage' in byteLimited, false);
  assert.equal('tokenUsage' in byteLimited.coverage, false);
});

test('Context Pack never includes a dependent without its owner and preserves authority metadata', async () => {
  const limited = buildContextPack({ atlas: sampleAtlas(), taskId: 'owner-limit', objective: 'Owner limit', selectors: ['subject/a'], maxFiles: 1, maxBytes: 1000 });
  assert.deepEqual(limited.files.map((item) => item.path), ['world/index.md']);
  assert.equal(limited.files.some((item) => item.path === 'governance/a.md'), false);
  assert.deepEqual(limited.coverage.followedOwners, ['repo:world/index.md']);
  const atlas = await realAtlasPromise;
  const projection = atlas.concepts.find((item) => item.path === 'player-facing/012-最小用語集.md');
  const projectionPack = buildContextPack({ atlas, taskId: 'projection-limit', objective: 'Projection limit', selectors: [projection.canonicalFor], maxFiles: 1, maxBytes: 1000000 });
  assert.equal(projectionPack.files.some((item) => item.path === projection.path), false);
  assert.equal(projectionPack.coverage.followedOwners.length, 1, 'only the owner actually included by the limit is reported as followed');
  assert.equal(projectionPack.coverage.excludedByLimit.length, 1, 'the second owner is excluded by max-files');
  assert.equal(projectionPack.coverage.excludedByOwner.some((item) => item.path === projection.path), true);
  const reference = atlas.concepts.find((item) => item.knowledgeRole === 'reference' && item.canonicalFor);
  assert.ok(reference);
  const explicit = buildContextPack({ atlas, taskId: 'reference', objective: 'Explicit reference', selectors: [reference.canonicalFor], maxFiles: 20, maxBytes: 1000000 });
  const included = explicit.files.find((item) => item.path === reference.path);
  assert.ok(included, 'an explicitly selected reference is not silently removed');
  assert.equal(included.knowledgeRole, 'reference');
  assert.equal(included.authority, reference.authority);
  assert.equal(included.status, reference.status);
});

test('Run Ledger omits invented budget and validates strict token, phase, and validation records', () => {
  const ledger = initRunLedger({ runId: 'run', objective: 'Observe' });
  assert.equal(Object.hasOwn(ledger, 'budget'), false);
  assert.throws(() => initRunLedger({ runId: 'run', objective: 'Observe', budget: 0 }), /positive integer/);
  assert.throws(() => initRunLedger({ runId: 'run', objective: 'Observe', budget: 1.5 }), /positive integer/);
  const observed = structuredClone(ledger);
  observed.status = 'running';
  observed.tokenUsage = { status: 'observed', source: 'Codex App Server', total: 101262, observedAt: '2026-08-16T00:00:00.000Z' };
  observed.phases.push({ id: 'plan', name: 'Plan', status: 'completed', agentRole: 'rim_planner', startedAt: '2026-08-16T00:00:00.000Z', endedAt: '2026-08-16T00:01:00.000Z' });
  observed.validations.push({ id: 'tests', command: 'npm test', status: 'passed', observedAt: '2026-08-16T00:02:00.000Z', evidence: '43 passed' });
  assert.equal(validateRunLedger(observed), observed);
  assert.throws(() => validateRunLedger({ ...structuredClone(ledger), tokenUsage: { status: 'observed', source: 'not-observed', total: 1, observedAt: '2026-08-16T00:00:00Z' } }), /source/);
  assert.throws(() => validateRunLedger({ ...structuredClone(ledger), tokenUsage: { status: 'unavailable', source: 'none', total: 1 } }), /unknown properties/);
  assert.throws(() => validateRunLedger({ ...structuredClone(ledger), phases: [{ id: 'x', name: 'X', status: 'stopped' }] }), /endedAt/);
  assert.throws(() => validateRunLedger({ ...structuredClone(ledger), validations: [{ id: 'x', command: 'x', status: 'passed', observedAt: '2026-08-16T00:00:00Z' }] }), /evidence/);
  const stopped = { ...structuredClone(ledger), status: 'stopped', phases: [{ id: 'worker', name: 'Worker', status: 'stopped', endedAt: '2026-08-16T00:03:00Z' }] };
  assert.equal(validateRunLedger(stopped), stopped);
});

test('Artifact Store supports repeat and concurrent writes and restores the prior target on failure', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'artifact-store-'));
  await atomicWrite(root, 'state/current.json', { sequence: 0 });
  await atomicWrite(root, 'state/current.json', { sequence: 1 });
  await Promise.all([2, 3, 4].map((sequence) => atomicWrite(root, 'state/current.json', { sequence })));
  assert.deepEqual(await readArtifact(root, 'state/current.json'), { sequence: 4 });
  await assert.rejects(() => atomicWrite(root, 'state/current.json', { sequence: 5 }, { beforeCommit: () => { throw new Error('forced commit failure'); } }), /forced commit failure/);
  assert.deepEqual(await readArtifact(root, 'state/current.json'), { sequence: 4 });
  await assert.rejects(() => atomicWrite(root, '../escape.json', {}), /outside/);
  assert.throws(() => safePath(root, '../escape.json'), /outside/);
});

test('CLI supports every valid command and check commands do not write', async () => {
  const runtimeRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'project-data-cli-'));
  const output = () => {};
  const atlasTarget = path.join(runtimeRoot, 'project-atlas', 'current.json');
  await projectDataMain(['atlas', 'check'], { repositoryRoot, harnessRoot, runtimeRoot, output });
  await assert.rejects(() => fs.stat(atlasTarget), /ENOENT/);
  await projectDataMain(['atlas', 'build'], { repositoryRoot, harnessRoot, runtimeRoot, output });
  const atlasBefore = await fs.readFile(atlasTarget, 'utf8');
  const atlasBeforeStat = await fs.stat(atlasTarget);
  await projectDataMain(['atlas', 'check'], { repositoryRoot, harnessRoot, runtimeRoot, output });
  const atlasAfterStat = await fs.stat(atlasTarget);
  assert.equal(await fs.readFile(atlasTarget, 'utf8'), atlasBefore);
  assert.equal(atlasAfterStat.mtimeMs, atlasBeforeStat.mtimeMs);
  await projectDataMain(['context-pack', '--task-id', 'cli-pack', '--objective', 'CLI pack', '--domain', 'governance', '--domain', 'roadmap', '--selector', 'authoring/shion-japanese-first-language-policy', '--max-files', '24', '--max-bytes', '200000'], { repositoryRoot, harnessRoot, runtimeRoot, output });
  await fs.stat(path.join(runtimeRoot, 'context-packs', 'cli-pack.json'));
  await projectDataMain(['ledger', 'init', '--run-id', 'cli-run', '--objective', 'CLI run'], { repositoryRoot, harnessRoot, runtimeRoot, output });
  const ledgerTarget = path.join(runtimeRoot, 'run-ledger', 'cli-run.json');
  const before = await fs.readFile(ledgerTarget, 'utf8');
  const beforeStat = await fs.stat(ledgerTarget);
  await projectDataMain(['ledger', 'check', '--run-id', 'cli-run'], { repositoryRoot, harnessRoot, runtimeRoot, output });
  const afterStat = await fs.stat(ledgerTarget);
  assert.equal(await fs.readFile(ledgerTarget, 'utf8'), before);
  assert.equal(afterStat.mtimeMs, beforeStat.mtimeMs);
});

test('CLI rejects missing commands, subcommands, flags, selections, duplicates, and invalid integers', async () => {
  const runtimeRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'project-data-invalid-cli-'));
  const invalid = [
    [], ['unknown'], ['atlas'], ['atlas', 'check', '--extra', 'x'], ['ledger'], ['ledger', 'other'],
    ['ledger', 'init', '--run-id', 'x'], ['ledger', 'check'], ['ledger', 'check', '--run-id', 'x', '--extra', 'x'],
    ['context-pack', '--task-id', 'x', '--objective', 'x'], ['context-pack', '--task-id', 'x', '--task-id', 'y', '--objective', 'x', '--domain', 'governance'],
    ['context-pack', '--task-id', 'x', '--objective', 'x', '--domain'], ['context-pack', '--task-id', 'x', '--objective', 'x', '--domain', 'governance', '--max-files', '0'],
    ['ledger', 'init', '--run-id', 'x', '--objective', 'x', '--token-budget', '1.5'],
  ];
  for (const args of invalid) {
    await assert.rejects(
      () => projectDataMain(args, { repositoryRoot, harnessRoot, runtimeRoot, output: () => {} }),
      undefined,
      `expected CLI failure: ${args.join(' ')}`,
    );
  }
  const processResult = spawnSync(process.execPath, [cliPath, 'context-pack', '--task-id', 'bad', '--objective', 'Bad', '--domain', 'governance', '--max-files', '0'], { cwd: repositoryRoot, encoding: 'utf8' });
  assert.equal(processResult.status, 1);
  assert.match(processResult.stderr, /positive integer/);
});

test('strict JSON schemas agree with runtime validators on representative valid and invalid artifacts', async () => {
  const atlasSchema = JSON.parse(await fs.readFile(path.join(harnessRoot, 'schema', 'project-atlas.schema.json'), 'utf8'));
  const contextSchema = JSON.parse(await fs.readFile(path.join(harnessRoot, 'schema', 'context-pack.schema.json'), 'utf8'));
  const ledgerSchema = JSON.parse(await fs.readFile(path.join(harnessRoot, 'schema', 'run-ledger.schema.json'), 'utf8'));
  const atlas = await realAtlasPromise;
  const pack = buildContextPack({ atlas: sampleAtlas(), taskId: 'schema', objective: 'Schema', selectors: ['subject/a'] });
  const ledger = initRunLedger({ runId: 'schema', objective: 'Schema' });
  for (const [schema, value, validator] of [[atlasSchema, atlas, validateProjectAtlas], [contextSchema, pack, validateContextPack], [ledgerSchema, ledger, validateRunLedger]]) {
    assert.equal(schema.additionalProperties, false);
    assert.equal(schemaAccepts(schema, value), true);
    assert.doesNotThrow(() => validator(value));
  }
  const invalidAtlas = structuredClone(atlas); invalidAtlas.diagnostics.missingOwners.push('missing.md');
  const invalidPack = { ...structuredClone(pack), tokenUsage: { status: 'unavailable', source: 'none' } };
  const invalidLedger = { ...structuredClone(ledger), budget: 0 };
  for (const [schema, value, validator] of [[atlasSchema, invalidAtlas, validateProjectAtlas], [contextSchema, invalidPack, validateContextPack], [ledgerSchema, invalidLedger, validateRunLedger]]) {
    assert.equal(schemaAccepts(schema, value), false);
    assert.throws(() => validator(value));
  }
  const mismatchCases = [
    [atlasSchema, { ...structuredClone(atlas), concepts: [{}] }, validateProjectAtlas],
    [atlasSchema, { ...structuredClone(atlas), generatedAt: '2026-02-30T00:00:00Z' }, validateProjectAtlas],
    [atlasSchema, (() => { const value = structuredClone(atlas); const scope = Object.keys(value.scopeMemberships)[0]; value.scopeMemberships[scope].push(value.scopeMemberships[scope][0]); return value; })(), validateProjectAtlas],
    [atlasSchema, (() => { const value = structuredClone(atlas); value.concepts[0].canonicalFor = ''; return value; })(), validateProjectAtlas],
    [contextSchema, (() => { const value = structuredClone(pack); value.coverage.requestedSelectors.push(value.coverage.requestedSelectors[0]); return value; })(), validateContextPack],
    [contextSchema, (() => { const value = structuredClone(pack); value.files[0].authority = ''; return value; })(), validateContextPack],
    [ledgerSchema, (() => { const value = structuredClone(ledger); delete value.taskId; return value; })(), validateRunLedger],
    [ledgerSchema, { ...structuredClone(ledger), createdAt: '2026-08-16' }, validateRunLedger],
    [ledgerSchema, { ...structuredClone(ledger), createdAt: '2026-02-30T00:00:00Z' }, validateRunLedger],
    [ledgerSchema, { ...structuredClone(ledger), phases: [{ id: 'stop', name: 'Stop', status: 'stopped' }] }, validateRunLedger],
    [ledgerSchema, { ...structuredClone(ledger), validations: [{ id: 'check', command: 'check', status: 'passed', observedAt: '2026-08-16T00:00:00Z' }] }, validateRunLedger],
  ];
  for (const [schema, value, validator] of mismatchCases) {
    assert.equal(schemaAccepts(schema, value), false);
    assert.throws(() => validator(value));
  }
  const wrongByteTotal = { ...structuredClone(pack), coverage: { ...structuredClone(pack.coverage), includedBytes: pack.coverage.includedBytes + 1 } };
  assert.equal(schemaAccepts(contextSchema, wrongByteTotal), true, 'JSON Schema cannot express a sum across file entries');
  assert.throws(() => validateContextPack(wrongByteTotal), /includedBytes mismatch/);
});
