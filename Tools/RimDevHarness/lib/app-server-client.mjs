import { spawn } from 'node:child_process';
import { EventEmitter, once } from 'node:events';
import { existsSync } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const STDERR_LIMIT = 100;

/** JSONL client for the official Codex app-server stdio protocol. */
export class AppServerClient extends EventEmitter {
  constructor({ command = resolveCodexCommand(), args = ['app-server', '--listen', 'stdio://'], cwd, env, spawnImpl = spawn } = {}) {
    super();
    this.on('error', () => {});
    this.command = command;
    this.args = [...args];
    this.cwd = cwd;
    this.env = env;
    this.spawnImpl = spawnImpl;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.stderr = [];
    this.child = null;
    this.reader = null;
    this.initialized = false;
  }

  start() {
    if (this.child) throw new Error('app-server already started');
    const child = this.spawnImpl(this.command, this.args, {
      cwd: this.cwd,
      env: this.env,
      shell: false,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    this.child = child;
    const reader = readline.createInterface({ input: child.stdout });
    this.reader = reader;
    reader.on('line', (line) => this.#handleLine(line));
    child.stderr?.on('data', (data) => this.#captureStderr(data));
    child.once('error', (error) => {
      this.#clearChild(child, reader);
      this.emit('error', error);
      this.#rejectAll(error);
    });
    child.once('exit', (code, signal) => {
      this.#clearChild(child, reader);
      const error = Object.assign(new Error(`app-server exited (${code ?? 'null'}/${signal ?? 'none'})`), { code, signal });
      this.emit('exit', { code, signal });
      this.#rejectAll(error);
    });
    return this;
  }

  async initialize(clientInfo = { name: 'rim-dev-harness', title: 'RIM Dev Harness', version: '0.1.0' }) {
    if (this.initialized) return { alreadyInitialized: true };
    const result = await this.request('initialize', { clientInfo });
    this.notify('initialized');
    this.initialized = true;
    return result;
  }

  request(method, params = {}, timeoutMs = 30_000) {
    if (!this.child?.stdin?.writable) return Promise.reject(new Error('app-server is not running'));
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`request timeout: ${method}`));
      }, timeoutMs);
      this.pending.set(id, {
        method,
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.#write({ id, method, params });
    });
  }

  notify(method, params = {}) {
    this.#write({ method, params });
  }

  answerApproval(requestId, result) {
    if (!['accept', 'decline', 'cancel'].includes(result?.decision)) throw new Error('invalid approval decision');
    this.#write({ id: requestId, result });
  }

  async stop() {
    const child = this.child;
    if (!child) return;
    this.child = null;
    this.initialized = false;
    try {
      child.stdin.end();
    } catch {}
    if (child.exitCode === null && child.signalCode === null) {
      await Promise.race([once(child, 'exit').catch(() => {}), new Promise((resolve) => setTimeout(resolve, 500))]);
    }
    if (child.exitCode === null && child.signalCode === null) child.kill();
    this.reader?.close();
    this.reader = null;
  }

  #handleLine(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch (error) {
      const malformed = { type: 'malformed', raw: line, error: error.message };
      this.#retainEvent(malformed);
      this.emit('malformed', malformed);
      return;
    }

    if (message.id !== undefined && !message.method && this.pending.has(message.id)) {
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) {
        pending.reject(Object.assign(new Error(message.error.message || 'protocol error'), { data: message.error, method: pending.method }));
      } else {
        pending.resolve(message.result);
      }
      return;
    }

    this.#retainEvent(message);
    if (message.method?.toLowerCase().includes('requestapproval')) this.emit('approval', message);
    if (message.method === 'thread/tokenUsage/updated' || message.method === 'turn/tokenUsage/updated') {
      this.emit('tokenUsage', message.params ?? message);
    }
  }

  #retainEvent(event) {
    this.events.push(event);
    if (this.events.length > 500) this.events.shift();
    this.emit('event', event);
  }

  #captureStderr(data) {
    for (const line of String(data).split(/\r?\n/).filter(Boolean)) {
      this.stderr.push(line);
      if (this.stderr.length > STDERR_LIMIT) this.stderr.shift();
      this.emit('stderr', line);
    }
  }

  #write(message) {
    if (!this.child?.stdin?.writable) throw new Error('app-server is not running');
    this.child.stdin.write(`${JSON.stringify(message)}\n`);
  }

  #rejectAll(error) {
    for (const pending of this.pending.values()) pending.reject(error);
    this.pending.clear();
  }

  #clearChild(child, reader) {
    reader?.close();
    if (this.child !== child) return;
    this.child = null;
    this.initialized = false;
    if (this.reader === reader) this.reader = null;
  }
}

export function resolveCodexCommand({ platform = process.platform, arch = process.arch, pathValue = process.env.PATH ?? '' } = {}) {
  if (platform !== 'win32') return 'codex';
  const directories = pathValue.split(path.delimiter).map((entry) => entry.trim().replace(/^"|"$/g, '')).filter(Boolean);
  const nativePackage = arch === 'arm64'
    ? ['codex-win32-arm64', 'aarch64-pc-windows-msvc']
    : ['codex-win32-x64', 'x86_64-pc-windows-msvc'];
  for (const directory of directories) {
    const nativeExecutable = path.join(
      directory,
      'node_modules',
      '@openai',
      'codex',
      'node_modules',
      '@openai',
      nativePackage[0],
      'vendor',
      nativePackage[1],
      'bin',
      'codex.exe',
    );
    if (existsSync(nativeExecutable)) return nativeExecutable;
  }
  for (const directory of directories) {
    const executable = path.join(directory, 'codex.exe');
    if (existsSync(executable) && !/\\WindowsApps\\/i.test(executable)) return executable;
  }
  throw new Error('spawnable native codex.exe was not found on PATH; refusing to use a shell wrapper for app-server JSONL');
}
