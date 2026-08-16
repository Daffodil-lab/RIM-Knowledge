import crypto from 'node:crypto';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppServerClient } from './lib/app-server-client.mjs';
import { RunStore } from './lib/run-store.mjs';
import {
  NODE_DEFS,
  answerAppApproval,
  applyProtocolEvent,
  approvePlan,
  approveRepair,
  attachPhaseTurn,
  beginAgentPhase,
  buildGoalObjective,
  buildPrompt,
  createRun,
  failAgentPhase,
  interruptCurrentPhase,
  isDisplayableProtocolEvent,
  node,
  protocolEventBelongsToRun,
  recordPublication,
  recordValidation,
  recoverInterruptedRun,
  requireModels,
  setModelCatalog,
} from './lib/workflow.mjs';

const MODULE_ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_ROOT = path.join(MODULE_ROOT, 'public');
const MAX_BODY_BYTES = 64 * 1024;
const STATIC_FILES = new Map([
  ['/', { file: 'index.html', type: 'text/html; charset=utf-8' }],
  ['/app.mjs', { file: 'app.mjs', type: 'text/javascript; charset=utf-8' }],
  ['/render-utils.mjs', { file: 'render-utils.mjs', type: 'text/javascript; charset=utf-8' }],
  ['/styles.css', { file: 'styles.css', type: 'text/css; charset=utf-8' }],
]);
const CSP = "default-src 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'";

export function createHarnessServer({ repoRoot = discoverRepoRoot(process.cwd()), appServer } = {}) {
  const store = new RunStore(repoRoot);
  const codex = appServer ?? new AppServerClient({ cwd: repoRoot });
  const token = crypto.randomBytes(24).toString('hex');
  const sseClients = new Set();
  let activeRun = null;
  let connected = false;
  let modelCatalog = [];
  let persistTimer = null;
  const restorePromise = store.loadCurrent().then(async (restored) => {
    if (!activeRun && restored) {
      const wasLive = ['running', 'waiting-app-approval'].includes(restored.status);
      activeRun = recoverInterruptedRun(restored);
      if (wasLive) await store.save(activeRun.id, activeRun);
    }
  });

  const broadcast = (payload) => {
    const frame = `data: ${JSON.stringify(payload)}\n\n`;
    for (const response of sseClients) response.write(frame);
  };

  const persist = async () => {
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }
    if (!activeRun) return;
    await store.save(activeRun.id, activeRun);
    broadcast({ type: 'run', run: activeRun });
  };

  const schedulePersist = () => {
    if (persistTimer) return;
    persistTimer = setTimeout(() => {
      persistTimer = null;
      persist().catch((error) => broadcast({ type: 'error', message: error.message }));
    }, 250);
  };

  codex.on('event', (event) => {
    if (activeRun && protocolEventBelongsToRun(activeRun, event)) {
      applyProtocolEvent(activeRun, event);
      schedulePersist();
    }
    if (isDisplayableProtocolEvent(event)) broadcast({ type: 'event', event });
  });
  codex.on('stderr', (line) => broadcast({ type: 'stderr', line }));
  codex.on('error', (error) => broadcast({ type: 'error', message: error.message }));
  codex.on('exit', ({ code, signal }) => {
    connected = false;
    if (activeRun) {
      recoverInterruptedRun(activeRun);
      persist().catch((error) => broadcast({ type: 'error', message: error.message }));
    }
    broadcast({ type: 'connection', connected: false, code, signal });
  });

  const server = http.createServer(async (request, response) => {
    try {
      await restorePromise;
      const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
      if (!isLocalRequest(request)) throw httpError(403, 'origin denied');

      if (request.method === 'GET' && STATIC_FILES.has(url.pathname)) {
        return serveStatic(response, STATIC_FILES.get(url.pathname));
      }

      if (request.method === 'GET' && url.pathname === '/events') {
        if (!tokenMatches(url.searchParams.get('token'), token)) throw httpError(401, 'unauthorized');
        response.writeHead(200, {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-store',
          Connection: 'keep-alive',
          'X-Content-Type-Options': 'nosniff',
        });
        sseClients.add(response);
        response.write(`data: ${JSON.stringify({ type: 'connection', connected })}\n\n`);
        if (activeRun) response.write(`data: ${JSON.stringify({ type: 'run', run: activeRun })}\n\n`);
        request.on('close', () => sseClients.delete(response));
        return;
      }

      if (request.method === 'GET' && url.pathname === '/api/context') {
        return sendJson(response, { repoRoot, connected, models: modelCatalog.map(publicModel) });
      }
      if (request.method === 'GET' && url.pathname === '/api/runs/current') {
        return sendJson(response, activeRun);
      }

      if (request.method !== 'GET' && !tokenMatches(request.headers['x-rim-harness-token'], token)) {
        throw httpError(401, 'unauthorized');
      }

      if (request.method === 'POST' && url.pathname === '/api/runs') {
        if (hasLiveAgentRun(activeRun)) throw httpError(409, 'stop the active agent turn before creating a new run');
        activeRun = createRun(await readJson(request));
        if (modelCatalog.length) setModelCatalog(activeRun, modelCatalog);
        await persist();
        return sendJson(response, activeRun, 201);
      }
      if (request.method === 'POST' && url.pathname === '/api/codex/connect') {
        if (!connected) {
          if (!codex.child) codex.start();
          if (!codex.initialized) await codex.initialize();
          const result = await codex.request('model/list', { limit: 100, includeHidden: true });
          modelCatalog = result?.data ?? [];
          connected = true;
          if (activeRun) {
            setModelCatalog(activeRun, modelCatalog);
            await persist();
          }
        }
        broadcast({ type: 'connection', connected: true, models: modelCatalog.map(publicModel) });
        return sendJson(response, { connected: true, models: modelCatalog.map(publicModel) });
      }

      if (request.method === 'POST' && url.pathname.startsWith('/api/actions/')) {
        if (!activeRun) throw httpError(409, 'no active run');
        const action = url.pathname.slice('/api/actions/'.length);
        const body = await readJson(request);
        await dispatchAction(action, body);
        await persist();
        return sendJson(response, activeRun);
      }

      throw httpError(404, 'not found');
    } catch (error) {
      return sendError(response, error.statusCode ?? 400, error.message);
    }
  });

  async function dispatchAction(action, body) {
    switch (action) {
      case 'plan/start':
        await startTurnPhase('planner');
        return;
      case 'plan/approve':
        approvePlan(activeRun);
        return;
      case 'implement/start':
        if (activeRun.status !== 'ready-to-implement') throw httpError(409, 'plan approval is required');
        await startTurnPhase('worker');
        return;
      case 'validation/record':
        recordValidation(activeRun, 'implementation', body);
        return;
      case 'review/start':
        if (activeRun.status !== 'ready-to-review') throw httpError(409, 'implementation validation has not passed');
        await startReviewPhase();
        return;
      case 'repair/approve':
        approveRepair(activeRun, body.scope);
        return;
      case 'repair/start':
        if (activeRun.status !== 'ready-to-repair') throw httpError(409, 'repair scope approval is required');
        await startTurnPhase('repair');
        return;
      case 'final-validation/record':
        recordValidation(activeRun, 'final', body);
        return;
      case 'publish/record':
        recordPublication(activeRun, body.evidence);
        return;
      case 'approval/respond':
        await respondToAppApproval(body);
        return;
      case 'turn/interrupt':
        await interruptTurn();
        return;
      default:
        throw httpError(404, `unknown action: ${action}`);
    }
  }

  async function startTurnPhase(phase) {
    ensureConnected();
    assertRequiredModels();
    const definition = NODE_DEFS.find((entry) => entry.id === phase);
    if (!definition?.model) throw httpError(409, `no agent definition for ${phase}`);
    if (node(activeRun, phase).status !== 'pending') throw httpError(409, `invalid state for ${phase}`);

    const threadResult = await codex.request('thread/start', {
      cwd: repoRoot,
      model: definition.model,
      sandbox: definition.sandbox,
      approvalPolicy: 'on-request',
      config: { model_reasoning_effort: definition.effort },
      serviceName: 'rim-dev-harness',
    });
    const threadId = threadResult?.thread?.id;
    if (!threadId) throw new Error('thread/start did not return thread.id');

    beginAgentPhase(activeRun, phase, { threadId, usesGoal: true });
    try {
      const goal = { threadId, objective: buildGoalObjective(activeRun, phase), status: 'active' };
      if (activeRun.tokenBudget !== undefined) goal.tokenBudget = activeRun.tokenBudget;
      await codex.request('thread/goal/set', goal);
      activeRun.goal = (await codex.request('thread/goal/get', { threadId })).goal ?? null;

      const turnResult = await codex.request('turn/start', {
        threadId,
        model: definition.model,
        effort: definition.effort,
        input: [{ type: 'text', text: buildPrompt(activeRun, phase) }],
      });
      const turnId = turnResult?.turn?.id;
      if (!turnId) throw new Error('turn/start did not return turn.id');
      attachPhaseTurn(activeRun, phase, turnId);
    } catch (error) {
      failAgentPhase(activeRun, phase, error);
      throw error;
    }
  }

  async function startReviewPhase() {
    ensureConnected();
    assertRequiredModels();
    const definition = NODE_DEFS.find((entry) => entry.id === 'review');
    if (node(activeRun, 'review').status !== 'pending') throw httpError(409, 'invalid state for review');
    const threadResult = await codex.request('thread/start', {
      cwd: repoRoot,
      model: definition.model,
      sandbox: definition.sandbox,
      approvalPolicy: 'on-request',
      config: { model_reasoning_effort: definition.effort },
      developerInstructions: '独立レビューのみを行い、ファイルを編集しない。具体的なfindingを重大度順に示す。',
      serviceName: 'rim-dev-harness-review',
    });
    const threadId = threadResult?.thread?.id;
    if (!threadId) throw new Error('thread/start did not return thread.id');
    beginAgentPhase(activeRun, 'review', { threadId, usesGoal: false });
    try {
      const reviewResult = await codex.request('review/start', {
        threadId,
        target: { type: 'uncommittedChanges' },
        delivery: 'inline',
      });
      const turnId = reviewResult?.turn?.id;
      if (!turnId) throw new Error('review/start did not return turn.id');
      attachPhaseTurn(activeRun, 'review', turnId);
    } catch (error) {
      failAgentPhase(activeRun, 'review', error);
      throw error;
    }
  }

  async function respondToAppApproval(body) {
    if (!['accept', 'decline', 'cancel'].includes(body.decision)) throw httpError(400, 'invalid approval decision');
    codex.answerApproval(body.requestId, { decision: body.decision });
    answerAppApproval(activeRun, body.requestId);
    if (body.decision === 'cancel') await interruptTurn();
  }

  async function interruptTurn() {
    const phase = activeRun.currentNode;
    const identifiers = activeRun.phaseThreads[phase];
    if (!identifiers?.threadId) throw httpError(409, 'no running turn to interrupt');
    const turnId = identifiers.activeTurnId ?? identifiers.turnId;
    if (identifiers.usesGoal) {
      await codex.request('thread/goal/set', { threadId: identifiers.threadId, status: 'paused' });
    }
    if (turnId) {
      try {
        await codex.request('turn/interrupt', { threadId: identifiers.threadId, turnId });
      } catch (error) {
        if (!/no active|not active|already (?:completed|finished)/i.test(error.message)) throw error;
      }
    }
    interruptCurrentPhase(activeRun);
  }

  function ensureConnected() {
    if (!connected || !codex.initialized) throw httpError(409, 'Codex is not connected');
  }

  function assertRequiredModels() {
    try {
      requireModels(activeRun);
    } catch (error) {
      throw httpError(409, error.message);
    }
  }

  return {
    server,
    codex,
    store,
    token,
    getActiveRun: () => activeRun,
    getConnected: () => connected,
  };
}

async function serveStatic(response, descriptor) {
  const data = await fs.readFile(path.join(PUBLIC_ROOT, descriptor.file));
  response.writeHead(200, {
    'Content-Type': descriptor.type,
    'Content-Security-Policy': CSP,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  response.end(data);
}

function isLocalRequest(request) {
  const host = request.headers.host ?? '';
  const hostname = host.startsWith('[') ? host.slice(1, host.indexOf(']')) : host.split(':')[0];
  if (!['localhost', '127.0.0.1', '::1'].includes(hostname)) return false;
  const origin = request.headers.origin;
  return !origin || /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(origin);
}

function tokenMatches(candidate, expected) {
  if (typeof candidate !== 'string') return false;
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += bytes.length;
    if (size > MAX_BODY_BYTES) throw httpError(413, 'request body too large');
    chunks.push(bytes);
  }
  const text = Buffer.concat(chunks, size).toString('utf8');
  try {
    return JSON.parse(text || '{}');
  } catch {
    throw httpError(400, 'invalid JSON');
  }
}

function hasLiveAgentRun(run) {
  if (!run) return false;
  return ['running', 'waiting-app-approval'].includes(run.status)
    || Object.values(run.phaseThreads ?? {}).some((runtime) => Boolean(runtime?.activeTurnId));
}

function publicModel(model) {
  return {
    id: model.id,
    model: model.model,
    displayName: model.displayName,
    defaultReasoningEffort: model.defaultReasoningEffort,
    supportedReasoningEfforts: model.supportedReasoningEfforts,
  };
}

function sendJson(response, value, statusCode = 200) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  response.end(JSON.stringify(value));
}

function sendError(response, statusCode, message) {
  return sendJson(response, { error: { message } }, statusCode);
}

function httpError(statusCode, message) {
  return Object.assign(new Error(message), { statusCode });
}

export function discoverRepoRoot(startPath) {
  let candidate = path.resolve(startPath);
  while (true) {
    if (existsSync(path.join(candidate, '.git'))) return candidate;
    const parent = path.dirname(candidate);
    if (parent === candidate) throw new Error(`Git repository root was not found from: ${startPath}`);
    candidate = parent;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { server, token } = createHarnessServer();
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    console.log(JSON.stringify({ url: `http://127.0.0.1:${address.port}/#token=${token}` }));
  });
}
