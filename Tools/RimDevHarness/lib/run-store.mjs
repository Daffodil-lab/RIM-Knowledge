import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export function assertInsideRepo(repoRoot, target) {
  const root = path.resolve(repoRoot);
  const resolved = path.resolve(target);
  const rel = path.relative(root, resolved);
  if (rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) throw new Error('path is outside repository');
  return resolved;
}

export class RunStore {
  constructor(repoRoot) {
    this.repoRoot = path.resolve(repoRoot);
    this.dir = assertInsideRepo(this.repoRoot, path.join(this.repoRoot, '.git-sync', 'harness'));
    this.writeQueue = Promise.resolve();
  }

  async save(runId, state) {
    if (!/^[A-Za-z0-9_-]+$/.test(runId)) throw new Error('invalid run id');
    const operation = this.writeQueue.then(async () => {
      await fs.mkdir(this.dir, { recursive: true });
      const file = assertInsideRepo(this.repoRoot, path.join(this.dir, `${runId}.json`));
      await replaceWithBackup(file, state);
      await replaceWithBackup(path.join(this.dir, 'current.json'), state);
      return file;
    });
    this.writeQueue = operation.catch(() => {});
    return operation;
  }

  async load(runId) {
    const file = assertInsideRepo(this.repoRoot, path.join(this.dir, `${runId}.json`));
    return JSON.parse(await fs.readFile(file, 'utf8'));
  }

  async loadCurrent() {
    try {
      return JSON.parse(await fs.readFile(path.join(this.dir, 'current.json'), 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') {
        try {
          return JSON.parse(await fs.readFile(path.join(this.dir, 'current.json.bak'), 'utf8'));
        } catch (backupError) {
          if (backupError.code === 'ENOENT') return null;
          throw backupError;
        }
      }
      throw error;
    }
  }
}

async function replaceWithBackup(file, value) {
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  const backup = `${file}.bak`;
  await fs.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rm(backup, { force: true });
  let hasBackup = false;
  try {
    await fs.rename(file, backup);
    hasBackup = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  try {
    await fs.rename(temp, file);
    if (hasBackup) await fs.rm(backup, { force: true });
  } catch (error) {
    await fs.rm(temp, { force: true });
    if (hasBackup) await fs.rename(backup, file);
    throw error;
  }
}
