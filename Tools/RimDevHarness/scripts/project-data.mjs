import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { atomicWrite } from '../lib/artifact-store.mjs';
import { buildContextPack } from '../lib/context-pack.mjs';
import { buildProjectAtlas, saveProjectAtlas } from '../lib/project-atlas.mjs';
import { initRunLedger, loadRunLedger, saveRunLedger } from '../lib/run-ledger.mjs';

const scriptPath = fileURLToPath(import.meta.url);
const defaultHarnessRoot = path.resolve(path.dirname(scriptPath), '..');
const defaultRepositoryRoot = path.resolve(defaultHarnessRoot, '..', '..');

function parseFlags(args, specification) {
  const result = {};
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith('--')) throw new Error(`unexpected positional argument: ${token}`);
    const name = token.slice(2);
    const rule = specification[name];
    if (!rule) throw new Error(`unknown flag: ${token}`);
    const value = args[index + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`missing value: ${token}`);
    if (!rule.repeatable && result[name]) throw new Error(`duplicate flag: ${token}`);
    (result[name] ??= []).push(value);
    index += 1;
  }
  for (const [name, rule] of Object.entries(specification)) {
    if (rule.required && !result[name]) throw new Error(`missing required flag: --${name}`);
  }
  return result;
}

function one(flags, name) {
  return flags[name]?.[0];
}

function positiveInteger(value, flagName, fallback) {
  if (value === undefined) return fallback;
  if (!/^[1-9]\d*$/.test(value)) throw new Error(`${flagName} must be a positive integer`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) throw new Error(`${flagName} must be a safe integer`);
  return parsed;
}

async function makeAtlas(repositoryRoot, harnessRoot) {
  return buildProjectAtlas({ configPath: path.join(harnessRoot, 'atlas.config.json'), repoRoot: repositoryRoot });
}

export async function main(argv, options = {}) {
  const repositoryRoot = options.repositoryRoot ?? defaultRepositoryRoot;
  const harnessRoot = options.harnessRoot ?? defaultHarnessRoot;
  const runtimeRoot = options.runtimeRoot ?? path.join(repositoryRoot, '.git-sync', 'harness');
  const output = options.output ?? ((value) => console.log(value));
  const [command, ...args] = argv;
  if (!command) throw new Error('command is required');

  if (command === 'atlas') {
    const [subcommand, ...rest] = args;
    if (!['check', 'build'].includes(subcommand)) throw new Error('atlas subcommand must be check or build');
    if (rest.length) throw new Error(`atlas ${subcommand} does not accept flags`);
    const atlas = await makeAtlas(repositoryRoot, harnessRoot);
    if (subcommand === 'build') await saveProjectAtlas(runtimeRoot, atlas);
    const summary = { command: `atlas ${subcommand}`, digest: atlas.digest, concepts: atlas.concepts.length, repositories: atlas.repositories.length };
    output(JSON.stringify(summary));
    return summary;
  }

  if (command === 'context-pack') {
    const flags = parseFlags(args, {
      'task-id': { required: true },
      objective: { required: true },
      domain: { repeatable: true },
      selector: { repeatable: true },
      'max-files': {},
      'max-bytes': {},
    });
    if (!flags.domain && !flags.selector) throw new Error('context-pack requires at least one --domain or --selector');
    const maxFiles = positiveInteger(one(flags, 'max-files'), '--max-files', 24);
    const maxBytes = positiveInteger(one(flags, 'max-bytes'), '--max-bytes', 200000);
    const atlas = await makeAtlas(repositoryRoot, harnessRoot);
    const pack = buildContextPack({
      atlas,
      taskId: one(flags, 'task-id'),
      objective: one(flags, 'objective'),
      domains: flags.domain ?? [],
      selectors: flags.selector ?? [],
      maxFiles,
      maxBytes,
    });
    await atomicWrite(runtimeRoot, `context-packs/${pack.taskId}.json`, pack);
    const summary = { command, taskId: pack.taskId, atlasDigest: pack.atlasDigest, includedFiles: pack.files.length, truncated: pack.coverage.truncated };
    output(JSON.stringify(summary));
    return summary;
  }

  if (command === 'ledger') {
    const [subcommand, ...rest] = args;
    if (!['init', 'check'].includes(subcommand)) throw new Error('ledger subcommand must be init or check');
    if (subcommand === 'init') {
      const flags = parseFlags(rest, {
        'run-id': { required: true },
        'task-id': {},
        objective: { required: true },
        'token-budget': {},
      });
      const budget = one(flags, 'token-budget') === undefined ? undefined : positiveInteger(one(flags, 'token-budget'), '--token-budget');
      const ledger = initRunLedger({ runId: one(flags, 'run-id'), taskId: one(flags, 'task-id'), objective: one(flags, 'objective'), budget });
      await saveRunLedger(runtimeRoot, ledger);
      const summary = { command: 'ledger init', runId: ledger.runId, budgetObserved: Object.hasOwn(ledger, 'budget') };
      output(JSON.stringify(summary));
      return summary;
    }
    const flags = parseFlags(rest, { 'run-id': { required: true } });
    const ledger = await loadRunLedger(runtimeRoot, one(flags, 'run-id'));
    const summary = { command: 'ledger check', runId: ledger.runId, status: ledger.status };
    output(JSON.stringify(summary));
    return summary;
  }

  throw new Error(`unknown command: ${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === path.resolve(scriptPath).toLowerCase()) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
