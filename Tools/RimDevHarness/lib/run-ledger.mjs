import { atomicWrite, readArtifact } from './artifact-store.mjs';

const SCHEMA_VERSION = 1;
const ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const ROOT_KEYS = new Set(['schemaVersion', 'runId', 'taskId', 'objective', 'status', 'phases', 'validations', 'tokenUsage', 'contextCoverage', 'createdAt', 'updatedAt', 'budget']);

function nonEmptyString(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a non-empty string`);
}

function isoDate(value, label) {
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

function allowedKeys(value, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length) throw new Error(`${label} has unknown properties: ${unknown.join(', ')}`);
}

function positiveBudget(value) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error('token budget must be a positive integer');
}

function validatePhase(phase) {
  allowedKeys(phase, new Set(['id', 'name', 'status', 'agentRole', 'startedAt', 'endedAt']), 'phase');
  if (!ID.test(phase.id ?? '')) throw new Error('phase id is invalid');
  nonEmptyString(phase.name, 'phase name');
  if (!['pending', 'in_progress', 'completed', 'failed', 'stopped', 'blocked'].includes(phase.status)) throw new Error('phase status is invalid');
  if (phase.agentRole !== undefined) nonEmptyString(phase.agentRole, 'phase agentRole');
  if (phase.startedAt !== undefined) isoDate(phase.startedAt, 'phase startedAt');
  if (phase.endedAt !== undefined) isoDate(phase.endedAt, 'phase endedAt');
  if (['completed', 'failed', 'stopped', 'blocked'].includes(phase.status) && phase.endedAt === undefined) throw new Error('terminal phase requires endedAt');
}

function validateValidation(validation) {
  allowedKeys(validation, new Set(['id', 'command', 'status', 'observedAt', 'evidence']), 'validation');
  if (!ID.test(validation.id ?? '')) throw new Error('validation id is invalid');
  nonEmptyString(validation.command, 'validation command');
  if (!['pending', 'passed', 'failed', 'skipped'].includes(validation.status)) throw new Error('validation status is invalid');
  if (validation.observedAt !== undefined) isoDate(validation.observedAt, 'validation observedAt');
  if (['passed', 'failed', 'skipped'].includes(validation.status) && validation.observedAt === undefined) throw new Error('finished validation requires observedAt');
  if (['passed', 'failed', 'skipped'].includes(validation.status) && validation.evidence === undefined) throw new Error('finished validation requires evidence');
  if (validation.evidence !== undefined) nonEmptyString(validation.evidence, 'validation evidence');
}

function validateTokenUsage(usage) {
  if (!usage || typeof usage !== 'object' || Array.isArray(usage)) throw new Error('tokenUsage must be an object');
  if (usage.status === 'unavailable') {
    allowedKeys(usage, new Set(['status', 'source']), 'unavailable tokenUsage');
    nonEmptyString(usage.source, 'tokenUsage source');
    return;
  }
  if (usage.status === 'observed') {
    allowedKeys(usage, new Set(['status', 'source', 'total', 'observedAt']), 'observed tokenUsage');
    nonEmptyString(usage.source, 'tokenUsage source');
    if (usage.source === 'not-observed') throw new Error('observed tokenUsage requires an attributable source');
    if (!Number.isSafeInteger(usage.total) || usage.total < 0) throw new Error('observed tokenUsage total must be a non-negative integer');
    isoDate(usage.observedAt, 'tokenUsage observedAt');
    return;
  }
  throw new Error('tokenUsage status is invalid');
}

function validateCoverage(coverage) {
  allowedKeys(coverage, new Set(['atlasDigest', 'packTaskId', 'includedFiles', 'includedBytes', 'truncated']), 'contextCoverage');
  if (coverage.atlasDigest !== undefined && (typeof coverage.atlasDigest !== 'string' || !/^[a-f0-9]{64}$/.test(coverage.atlasDigest))) throw new Error('contextCoverage atlasDigest is invalid');
  if (coverage.packTaskId !== undefined && !ID.test(coverage.packTaskId)) throw new Error('contextCoverage packTaskId is invalid');
  for (const key of ['includedFiles', 'includedBytes']) {
    if (coverage[key] !== undefined && (!Number.isSafeInteger(coverage[key]) || coverage[key] < 0)) throw new Error(`contextCoverage ${key} is invalid`);
  }
  if (coverage.truncated !== undefined && typeof coverage.truncated !== 'boolean') throw new Error('contextCoverage truncated is invalid');
}

export function initRunLedger({ runId, taskId, objective, budget } = {}) {
  if (!ID.test(runId ?? '')) throw new Error('runId is required');
  if (taskId !== undefined && taskId !== null && !ID.test(taskId)) throw new Error('taskId is invalid');
  nonEmptyString(objective, 'objective');
  if (budget !== undefined) positiveBudget(budget);
  const now = new Date().toISOString();
  const ledger = {
    schemaVersion: SCHEMA_VERSION,
    runId,
    taskId: taskId ?? null,
    objective,
    status: 'initialized',
    phases: [],
    validations: [],
    tokenUsage: { status: 'unavailable', source: 'not-observed' },
    contextCoverage: {},
    createdAt: now,
    updatedAt: now,
  };
  if (budget !== undefined) ledger.budget = budget;
  return validateRunLedger(ledger);
}

export function validateRunLedger(ledger) {
  allowedKeys(ledger, ROOT_KEYS, 'Run Ledger');
  for (const key of ['schemaVersion', 'runId', 'taskId', 'objective', 'status', 'phases', 'validations', 'tokenUsage', 'contextCoverage', 'createdAt', 'updatedAt']) {
    if (!Object.hasOwn(ledger, key)) throw new Error(`Run Ledger is missing property: ${key}`);
  }
  if (ledger.schemaVersion !== SCHEMA_VERSION) throw new Error('invalid Run Ledger schemaVersion');
  if (!ID.test(ledger.runId ?? '')) throw new Error('invalid run id');
  if (ledger.taskId !== null && ledger.taskId !== undefined && !ID.test(ledger.taskId)) throw new Error('invalid task id');
  nonEmptyString(ledger.objective, 'objective');
  if (!['initialized', 'running', 'completed', 'failed', 'stopped', 'blocked'].includes(ledger.status)) throw new Error('invalid ledger status');
  if (!Array.isArray(ledger.phases) || !Array.isArray(ledger.validations)) throw new Error('phases and validations are required');
  ledger.phases.forEach(validatePhase);
  ledger.validations.forEach(validateValidation);
  validateTokenUsage(ledger.tokenUsage);
  validateCoverage(ledger.contextCoverage);
  isoDate(ledger.createdAt, 'createdAt');
  isoDate(ledger.updatedAt, 'updatedAt');
  if (ledger.budget !== undefined) positiveBudget(ledger.budget);
  return ledger;
}

export async function saveRunLedger(runtimeRoot, ledger) {
  validateRunLedger(ledger);
  return atomicWrite(runtimeRoot, `run-ledger/${ledger.runId}.json`, ledger);
}

export async function loadRunLedger(runtimeRoot, runId) {
  if (!ID.test(runId ?? '')) throw new Error('invalid run id');
  return validateRunLedger(await readArtifact(runtimeRoot, `run-ledger/${runId}.json`));
}
