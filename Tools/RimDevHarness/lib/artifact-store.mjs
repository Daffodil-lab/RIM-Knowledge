import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const queues = new Map();

export function safePath(root, relative) {
  const base = path.resolve(root);
  const target = path.resolve(base, relative);
  const rel = path.relative(base, target);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error('path outside runtime directory');
  }
  return target;
}

async function exists(operations, target) {
  try {
    await operations.access(target);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function removeIfPresent(operations, target) {
  try {
    if (operations.rm) await operations.rm(target, { force: true });
    else await operations.unlink(target);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

export async function atomicWrite(root, relative, value, { operations = fs, beforeCommit } = {}) {
  const target = safePath(root, relative);
  const key = process.platform === 'win32' ? target.toLowerCase() : target;
  const previous = queues.get(key) ?? Promise.resolve();
  const operation = previous.then(async () => {
    await operations.mkdir(path.dirname(target), { recursive: true });
    const nonce = `${process.pid}.${crypto.randomUUID()}`;
    const temp = `${target}.${nonce}.tmp`;
    const backup = `${target}.${nonce}.bak`;
    let backupMade = false;
    let committed = false;
    try {
      await operations.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
      if (await exists(operations, target)) {
        await operations.rename(target, backup);
        backupMade = true;
      }
      if (beforeCommit) await beforeCommit({ target, temp, backup });
      await operations.rename(temp, target);
      committed = true;
      return target;
    } catch (error) {
      let restoreError = null;
      try {
        await removeIfPresent(operations, temp);
        if (backupMade) {
          await removeIfPresent(operations, target);
          await operations.rename(backup, target);
          backupMade = false;
        }
      } catch (caught) {
        restoreError = caught;
      }
      if (restoreError) throw new AggregateError([error, restoreError], `artifact write and rollback failed: ${target}`);
      throw error;
    } finally {
      try {
        await removeIfPresent(operations, temp);
      } catch {
        // A stale temp is safer than masking the original write result.
      }
      if (committed && backupMade) {
        try {
          await removeIfPresent(operations, backup);
        } catch {
          // The committed target is authoritative; a stale backup is recoverable.
        }
      }
    }
  });
  const settled = operation.catch(() => undefined);
  queues.set(key, settled);
  try {
    return await operation;
  } finally {
    if (queues.get(key) === settled) queues.delete(key);
  }
}

export async function readArtifact(root, relative) {
  return JSON.parse(await fs.readFile(safePath(root, relative), 'utf8'));
}
