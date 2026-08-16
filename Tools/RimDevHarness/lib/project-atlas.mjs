import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  parseFrontmatter,
  readConcepts,
  toPosix,
} from '../../../knowledge/tools/lib/okf-utils.mjs';
import { atomicWrite } from './artifact-store.mjs';

const SCHEMA_VERSION = 1;
const DIGEST_KIND = 'knowledge-content-snapshot-v1';

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function git(repositoryRoot, args) {
  try {
    return execFileSync('git', ['-C', repositoryRoot, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch (error) {
    throw new Error(`Git observation failed (${args.join(' ')}): ${repositoryRoot}`, { cause: error });
  }
}

function resolveInside(root, value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty path`);
  }
  if (path.isAbsolute(value)) throw new Error(`${label} must be repository-relative: ${value}`);
  const base = path.resolve(root);
  const candidate = path.resolve(base, value);
  const relative = path.relative(base, candidate);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`${label} is outside its repository: ${value}`);
  }
  return candidate;
}

async function assertDirectory(directory, label) {
  let stat;
  try {
    stat = await fs.stat(directory);
  } catch (error) {
    throw new Error(`${label} is unavailable: ${directory}`, { cause: error });
  }
  if (!stat.isDirectory()) throw new Error(`${label} is not a directory: ${directory}`);
}

async function scanImplementation(root) {
  await assertDirectory(root, 'implementation root');
  const result = [];
  const suffixes = ['About.xml', '.cs', '.csproj', '.sln'];
  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '.git') await visit(full);
      } else if (suffixes.some((suffix) => entry.name === suffix || entry.name.endsWith(suffix))) {
        result.push(full);
      }
    }
  }
  await visit(root);
  return result.sort(compareText);
}

function ownerList(metadata, sourcePath) {
  const value = metadata.canonical_owner;
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item)) {
    throw new Error(`canonical_owner must be a non-empty string list: ${sourcePath}`);
  }
  return value;
}

function scalarMetadata(metadata, key, sourcePath) {
  const value = metadata[key];
  if (value === undefined) return null;
  if (typeof value !== 'string' || !value) {
    throw new Error(`${key} must be a scalar string: ${sourcePath}`);
  }
  return value;
}

function resolveOwnerPath(sourcePath, declaredTarget) {
  const target = declaredTarget.replaceAll('\\', '/');
  const normalized = target.startsWith('/')
    ? path.posix.normalize(target.slice(1))
    : path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), target));
  if (!normalized || normalized === '.' || normalized === '..' || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) {
    throw new Error(`canonical_owner escapes knowledge root: ${sourcePath} -> ${declaredTarget}`);
  }
  return normalized;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => compareText(left, right))
        .map(([key, item]) => [key, canonicalize(item)]),
    );
  }
  return value;
}

function stableDigest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(canonicalize(value))).digest('hex');
}

function findOwnerCycles(ownerEdges) {
  const adjacency = new Map();
  for (const edge of ownerEdges) {
    const from = `${edge.repositoryId}:${edge.from}`;
    const to = `${edge.repositoryId}:${edge.to}`;
    if (!adjacency.has(from)) adjacency.set(from, []);
    adjacency.get(from).push(to);
  }
  for (const targets of adjacency.values()) targets.sort(compareText);
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const cycles = [];
  function visit(node) {
    if (visiting.has(node)) {
      const start = stack.indexOf(node);
      cycles.push([...stack.slice(start), node]);
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    stack.push(node);
    for (const target of adjacency.get(node) ?? []) visit(target);
    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }
  for (const node of [...adjacency.keys()].sort(compareText)) visit(node);
  return cycles;
}

function requireArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
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

function sha256(value, label) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) throw new Error(`${label} must be SHA-256`);
}

function dateTime(value, label) {
  if (!isRfc3339DateTime(value)) {
    throw new Error(`${label} must be an RFC 3339 date-time`);
  }
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
  if (month < 1 || month > 12 || day < 1 || day > monthDays[month - 1]) return false;
  if (Number(hourText) > 23 || Number(minuteText) > 59 || Number(secondText) > 59) return false;
  return zone === 'Z' || (Number(offsetHourText) <= 23 && Number(offsetMinuteText) <= 59);
}

export function validateProjectAtlas(atlas) {
  const rootKeys = new Set(['schemaVersion', 'digestKind', 'digest', 'generatedAt', 'repositories', 'concepts', 'ownerDocuments', 'subjectOwners', 'ownerEdges', 'scopeMemberships', 'implementationMarkers', 'implementationObservation', 'diagnostics']);
  allowedKeys(atlas, rootKeys, 'Atlas');
  if (atlas.schemaVersion !== SCHEMA_VERSION) throw new Error('invalid Atlas schemaVersion');
  if (atlas.digestKind !== DIGEST_KIND) throw new Error('invalid Atlas digestKind');
  sha256(atlas.digest, 'Atlas digest');
  dateTime(atlas.generatedAt, 'Atlas generatedAt');
  for (const field of ['repositories', 'concepts', 'ownerDocuments', 'ownerEdges', 'implementationMarkers']) {
    requireArray(atlas[field], `Atlas ${field}`);
  }
  if (atlas.repositories.length !== 1) throw new Error('Wave 1 Atlas requires exactly one repository');
  const repositoryKeys = new Set(['id', 'kind', 'path', 'knowledgeRoot', 'implementationRoots', 'gitObserved', 'head', 'branch', 'dirtyPaths']);
  for (const repository of atlas.repositories) {
    allowedKeys(repository, repositoryKeys, 'Atlas repository');
    for (const key of ['id', 'kind', 'path', 'knowledgeRoot']) stringValue(repository[key], `repository ${key}`);
    requireArray(repository.implementationRoots, 'repository implementationRoots');
    repository.implementationRoots.forEach((value) => stringValue(value, 'implementation root'));
    if (typeof repository.gitObserved !== 'boolean') throw new Error('repository gitObserved must be boolean');
    stringValue(repository.head, 'repository head', true);
    stringValue(repository.branch, 'repository branch', true);
    requireArray(repository.dirtyPaths, 'repository dirtyPaths');
    repository.dirtyPaths.forEach((value) => stringValue(value, 'dirty path'));
    if (repository.gitObserved && repository.head === null) throw new Error('observed repository requires head');
  }
  const conceptKeys = new Set(['repositoryId', 'path', 'bytes', 'sha256', 'domain', 'knowledgeRole', 'canonicalFor', 'canonicalScope', 'canonicalOwners', 'authority', 'status', 'title']);
  for (const item of atlas.concepts) {
    allowedKeys(item, conceptKeys, 'Atlas concept');
    for (const key of ['repositoryId', 'path', 'domain', 'title']) stringValue(item[key], `concept ${key}`);
    nonNegativeInteger(item.bytes, 'concept bytes');
    sha256(item.sha256, 'concept sha256');
    for (const key of ['knowledgeRole', 'canonicalFor', 'canonicalScope', 'authority', 'status']) stringValue(item[key], `concept ${key}`, true);
    requireArray(item.canonicalOwners, 'concept canonicalOwners');
    item.canonicalOwners.forEach((value) => stringValue(value, 'canonical owner declaration'));
  }
  const ownerDocumentKeys = new Set(['repositoryId', 'path', 'bytes', 'sha256', 'domain', 'title', 'documentRole']);
  for (const item of atlas.ownerDocuments) {
    allowedKeys(item, ownerDocumentKeys, 'owner document');
    for (const key of ['repositoryId', 'path', 'domain', 'title']) stringValue(item[key], `owner document ${key}`);
    nonNegativeInteger(item.bytes, 'owner document bytes');
    sha256(item.sha256, 'owner document sha256');
    if (item.documentRole !== 'canonical-owner-target') throw new Error('invalid owner document role');
  }
  const ownerEdgeKeys = new Set(['repositoryId', 'from', 'to']);
  for (const edge of atlas.ownerEdges) {
    allowedKeys(edge, ownerEdgeKeys, 'owner edge');
    for (const key of ownerEdgeKeys) stringValue(edge[key], `owner edge ${key}`);
  }
  if (!atlas.subjectOwners || typeof atlas.subjectOwners !== 'object' || Array.isArray(atlas.subjectOwners)) throw new Error('invalid subjectOwners');
  for (const [subject, owner] of Object.entries(atlas.subjectOwners)) {
    stringValue(subject, 'subject id');
    stringValue(owner, 'subject owner path');
  }
  if (!atlas.scopeMemberships || typeof atlas.scopeMemberships !== 'object' || Array.isArray(atlas.scopeMemberships)) throw new Error('invalid scopeMemberships');
  for (const [scope, members] of Object.entries(atlas.scopeMemberships)) {
    stringValue(scope, 'canonical scope');
    requireArray(members, 'scope members');
    members.forEach((member) => stringValue(member, 'scope member'));
    if (new Set(members).size !== members.length) throw new Error('scope members must be unique');
  }
  const markerKeys = new Set(['repositoryId', 'path']);
  for (const marker of atlas.implementationMarkers) {
    allowedKeys(marker, markerKeys, 'implementation marker');
    stringValue(marker.repositoryId, 'marker repositoryId');
    stringValue(marker.path, 'marker path');
  }
  if (!['observed', 'not-observed-in-configured-repositories'].includes(atlas.implementationObservation)) throw new Error('invalid implementation observation');
  allowedKeys(atlas.diagnostics, new Set(['duplicateSubjects', 'missingOwners', 'ownerCycles']), 'Atlas diagnostics');
  if (Object.values(atlas.diagnostics).some((items) => !Array.isArray(items) || items.length !== 0)) {
    throw new Error('Atlas contains relationship diagnostics');
  }
  return atlas;
}

export async function buildProjectAtlas({ configPath, repoRoot, generatedAt = new Date().toISOString() }) {
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  if (config.schemaVersion !== SCHEMA_VERSION) throw new Error('atlas config schemaVersion must be 1');
  if (!Array.isArray(config.repositories) || config.repositories.length !== 1) {
    throw new Error('Wave 1 atlas config requires exactly one repository');
  }

  const repositories = [];
  const concepts = [];
  const ownerEdges = [];
  const ownerDocuments = [];
  const implementationMarkers = [];
  const subjectOwners = new Map();
  const scopeMemberships = new Map();
  const missingOwners = [];

  for (const spec of config.repositories) {
    if (!spec || typeof spec.id !== 'string' || !spec.id) throw new Error('repository id is required');
    if (repositories.some((item) => item.id === spec.id)) throw new Error(`duplicate repository id: ${spec.id}`);
    const repositoryRoot = resolveInside(repoRoot, spec.path, `repository ${spec.id}`);
    const knowledgeRoot = resolveInside(repositoryRoot, spec.knowledgeRoot, `knowledge root ${spec.id}`);
    await assertDirectory(repositoryRoot, `repository ${spec.id}`);
    await assertDirectory(knowledgeRoot, `knowledge root ${spec.id}`);
    const implementationRoots = spec.implementationRoots ?? [];
    if (!Array.isArray(implementationRoots)) throw new Error(`implementationRoots must be an array: ${spec.id}`);
    const gitObserved = spec.observeGit !== false;
    const repository = {
      id: spec.id,
      kind: spec.kind ?? 'unknown',
      path: toPosix(spec.path),
      knowledgeRoot: toPosix(spec.knowledgeRoot),
      implementationRoots: implementationRoots.map(toPosix),
      gitObserved,
      head: gitObserved ? git(repositoryRoot, ['rev-parse', 'HEAD']) : null,
      branch: gitObserved ? git(repositoryRoot, ['branch', '--show-current']) || null : null,
      dirtyPaths: gitObserved ? git(repositoryRoot, ['status', '--short']).split(/\r?\n/).filter(Boolean) : [],
    };
    repositories.push(repository);

    const entries = readConcepts(knowledgeRoot);
    for (const entry of entries) {
      const metadata = entry.metadata ?? {};
      const relativePath = toPosix(path.relative(knowledgeRoot, entry.file));
      const canonicalFor = scalarMetadata(metadata, 'canonical_for', relativePath);
      const canonicalScope = scalarMetadata(metadata, 'canonical_scope', relativePath);
      const canonicalOwners = ownerList(metadata, relativePath);
      const item = {
        repositoryId: spec.id,
        path: relativePath,
        bytes: Buffer.byteLength(entry.text),
        sha256: crypto.createHash('sha256').update(entry.text).digest('hex'),
        domain: relativePath.split('/')[0],
        knowledgeRole: metadata.knowledge_role ?? null,
        canonicalFor,
        canonicalScope,
        canonicalOwners: [...canonicalOwners],
        authority: metadata.authority ?? null,
        status: metadata.status ?? null,
        title: entry.title,
      };
      concepts.push(item);
      if (canonicalFor) {
        if (subjectOwners.has(canonicalFor)) {
          throw new Error(`duplicate canonical_for subject: ${canonicalFor} (${subjectOwners.get(canonicalFor)} and ${relativePath})`);
        }
        subjectOwners.set(canonicalFor, relativePath);
      }
      if (canonicalScope) {
        if (!scopeMemberships.has(canonicalScope)) scopeMemberships.set(canonicalScope, []);
        scopeMemberships.get(canonicalScope).push(relativePath);
      }
      for (const declaredTarget of canonicalOwners) {
        ownerEdges.push({ repositoryId: spec.id, from: relativePath, to: resolveOwnerPath(relativePath, declaredTarget) });
      }
    }

    const repositoryEdges = ownerEdges.filter((edge) => edge.repositoryId === spec.id);
    const conceptPaths = new Set(concepts.filter((item) => item.repositoryId === spec.id).map((item) => item.path));
    for (const target of [...new Set(repositoryEdges.map((edge) => edge.to))].sort(compareText)) {
      const targetPath = resolveInside(knowledgeRoot, target, `canonical owner ${spec.id}`);
      try {
        const stat = await fs.stat(targetPath);
        if (!stat.isFile()) throw new Error('not a file');
      } catch {
        missingOwners.push({ repositoryId: spec.id, path: target });
        continue;
      }
      if (!conceptPaths.has(target)) {
        const text = (await fs.readFile(targetPath, 'utf8')).replace(/\r\n?/g, '\n');
        const parsed = parseFrontmatter(text);
        ownerDocuments.push({
          repositoryId: spec.id,
          path: target,
          bytes: Buffer.byteLength(text),
          sha256: crypto.createHash('sha256').update(text).digest('hex'),
          domain: target.split('/')[0],
          title: parsed.metadata.title ?? path.posix.basename(target, '.md'),
          documentRole: 'canonical-owner-target',
        });
      }
    }
    for (const rootRelative of implementationRoots) {
      const implementationRoot = resolveInside(repositoryRoot, rootRelative, `implementation root ${spec.id}`);
      for (const file of await scanImplementation(implementationRoot)) {
        implementationMarkers.push({ repositoryId: spec.id, path: toPosix(path.relative(repositoryRoot, file)) });
      }
    }
  }

  if (missingOwners.length) {
    throw new Error(`missing canonical owner: ${missingOwners.map((item) => `${item.repositoryId}:${item.path}`).join(', ')}`);
  }
  const ownerCycles = findOwnerCycles(ownerEdges);
  if (ownerCycles.length) throw new Error(`canonical_owner cycle: ${ownerCycles[0].join(' -> ')}`);

  repositories.sort((left, right) => compareText(left.id, right.id));
  concepts.sort((left, right) => compareText(`${left.repositoryId}:${left.path}`, `${right.repositoryId}:${right.path}`));
  ownerDocuments.sort((left, right) => compareText(`${left.repositoryId}:${left.path}`, `${right.repositoryId}:${right.path}`));
  ownerEdges.sort((left, right) => compareText(`${left.repositoryId}:${left.from}:${left.to}`, `${right.repositoryId}:${right.from}:${right.to}`));
  implementationMarkers.sort((left, right) => compareText(`${left.repositoryId}:${left.path}`, `${right.repositoryId}:${right.path}`));
  const scopeObject = Object.fromEntries(
    [...scopeMemberships.entries()].sort(([left], [right]) => compareText(left, right)).map(([scope, members]) => [scope, members.sort(compareText)]),
  );
  const subjectObject = Object.fromEntries([...subjectOwners.entries()].sort(([left], [right]) => compareText(left, right)));
  const stable = {
    schemaVersion: SCHEMA_VERSION,
    digestKind: DIGEST_KIND,
    repositories,
    concepts,
    ownerDocuments,
    subjectOwners: subjectObject,
    ownerEdges,
    scopeMemberships: scopeObject,
    implementationMarkers,
    implementationObservation: implementationMarkers.length ? 'observed' : 'not-observed-in-configured-repositories',
  };
  const atlas = {
    schemaVersion: SCHEMA_VERSION,
    digestKind: DIGEST_KIND,
    digest: stableDigest(stable),
    generatedAt,
    repositories,
    concepts,
    ownerDocuments,
    subjectOwners: subjectObject,
    ownerEdges,
    scopeMemberships: scopeObject,
    implementationMarkers,
    implementationObservation: stable.implementationObservation,
    diagnostics: { duplicateSubjects: [], missingOwners: [], ownerCycles: [] },
  };
  return validateProjectAtlas(atlas);
}

export async function saveProjectAtlas(runtimeRoot, atlas) {
  validateProjectAtlas(atlas);
  return atomicWrite(runtimeRoot, 'project-atlas/current.json', atlas);
}
