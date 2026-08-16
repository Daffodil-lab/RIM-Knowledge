import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { request as httpRequest } from 'node:http';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createHarnessServer } from '../server.mjs';

test('HTTP surface protects mutations, serves a CSP-locked GUI, and runs the gated workflow', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-http-'));
  const codex = new MockAppServer();
  const harness = createHarnessServer({ repoRoot, appServer: codex });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const get = (url, headers = {}) => fetch(`${origin}${url}`, { headers });
  const post = (url, body, headers = {}) => fetch(`${origin}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body ?? {}),
  });
  const auth = { 'X-Rim-Harness-Token': harness.token };

  const page = await get('/');
  const html = await page.text();
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
  assert.doesNotMatch(html, new RegExp(harness.token));
  assert.match(html, /RimWorld MOD 開発管制/);
  assert.equal((await get('/api/context', { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await post('/api/runs', { objective: 'x' })).status, 401);
  assert.equal((await post('/api/anything', {}, auth)).status, 404);

  const createdResponse = await post('/api/runs', {
    objective: 'Rim MOD smoke',
    conditions: { completion: ['build'], investigation: ['API drift'], stop: ['same failure twice'] },
  }, auth);
  assert.equal(createdResponse.status, 201);
  let run = await createdResponse.json();
  assert.deepEqual(run.conditions.completion, ['build']);
  assert.equal(Object.hasOwn(run, 'tokenBudget'), false);

  const connectResponse = await post('/api/codex/connect', {}, auth);
  assert.equal(connectResponse.status, 200);
  assert.equal((await connectResponse.json()).models.length, 2);

  run = await json(await post('/api/actions/plan/start', {}, auth));
  assert.equal(nodeStatus(run, 'planner'), 'running');
  assert.equal(codex.find('thread/start', -1).params.model, 'gpt-5.6-sol');
  assert.equal(codex.find('thread/start', -1).params.sandbox, 'read-only');
  const planGoal = codex.find('thread/goal/set', -1).params;
  assert.equal(Object.hasOwn(planGoal, 'tokenBudget'), false);
  assert.equal(codex.find('thread/goal/get', -1).params.threadId, planGoal.threadId);
  assert.match(codex.find('turn/start', -1).params.input[0].text, /API drift/);
  assert.equal((await post('/api/actions/plan/start', {}, auth)).status, 409);
  assert.equal((await post('/api/runs', { objective: 'must not replace live run' }, auth)).status, 409);

  const plannerThread = run.phaseThreads.planner.threadId;
  codex.startTurn(plannerThread, 'planner-actual-turn');
  codex.completeGoal(plannerThread);
  codex.complete('planner-actual-turn', plannerThread, 'approved plan candidate');
  await tick();
  run = await json(await get('/api/runs/current'));
  assert.equal(run.waitingFor.kind, 'plan');
  assert.equal(nodeStatus(run, 'approval-plan'), 'waiting');

  codex.approval(77, plannerThread, 'planner-actual-turn');
  await tick();
  run = await json(await get('/api/runs/current'));
  assert.equal(run.waitingFor.type, 'app-server');
  assert.equal((await post('/api/actions/approval/respond', { requestId: 12, decision: 'accept' }, auth)).status, 400);
  run = await json(await post('/api/actions/approval/respond', { requestId: 77, decision: 'decline' }, auth));
  assert.deepEqual(codex.lastApproval, { requestId: 77, result: { decision: 'decline' } });
  assert.deepEqual(run.waitingFor, { type: 'human', kind: 'plan' });

  // Completing a command approval does not approve the plan; the explicit plan gate remains required.
  codex.emit('event', { method: 'item/completed', params: { threadId: 'none', turnId: 'none', item: { type: 'agentMessage', text: 'noop' } } });
  await tick();
  run = await json(await post('/api/actions/plan/approve', {}, auth));
  assert.equal(run.status, 'ready-to-implement');

  run = await json(await post('/api/actions/implement/start', {}, auth));
  assert.equal(codex.find('thread/start', -1).params.model, 'gpt-5.6-luna');
  assert.equal(codex.find('thread/start', -1).params.sandbox, 'workspace-write');
  codex.completeGoal(run.phaseThreads.worker.threadId);
  codex.complete(run.phaseThreads.worker.turnId, run.phaseThreads.worker.threadId, 'implementation complete');
  await tick();
  run = await json(await get('/api/runs/current'));
  assert.equal(nodeStatus(run, 'validation'), 'waiting');
  assert.notEqual(nodeStatus(run, 'validation'), 'passed');

  run = await json(await post('/api/actions/validation/record', { outcome: 'pass', evidence: 'node --test PASS' }, auth));
  assert.equal(run.status, 'ready-to-review');
  run = await json(await post('/api/actions/review/start', {}, auth));
  assert.equal(codex.find('review/start', -1).params.target.type, 'uncommittedChanges');
  codex.complete(run.phaseThreads.review.turnId, run.phaseThreads.review.threadId, 'one review finding');
  await tick();
  run = await json(await get('/api/runs/current'));
  assert.equal(run.waitingFor.kind, 'repair-scope');

  run = await json(await post('/api/actions/repair/approve', { scope: 'findingだけ修正' }, auth));
  run = await json(await post('/api/actions/repair/start', {}, auth));
  codex.completeGoal(run.phaseThreads.repair.threadId);
  codex.complete(run.phaseThreads.repair.turnId, run.phaseThreads.repair.threadId, 'repair complete');
  await tick();
  run = await json(await post('/api/actions/final-validation/record', { outcome: 'pass', evidence: 'runtime smoke PASS' }, auth));
  assert.equal(run.status, 'ready-to-publish');
  run = await json(await post('/api/actions/publish/record', { evidence: 'remote SHA abc; Actions PASS' }, auth));
  assert.equal(run.status, 'completed');

  const replacement = await post('/api/runs', { objective: 'replacement after completion' }, auth);
  assert.equal(replacement.status, 201);
  codex.approval(88, plannerThread, 'old-turn');
  await tick();
  run = await json(await get('/api/runs/current'));
  assert.equal(run.waitingFor, null);

  const huge = { value: 'x'.repeat(70_000) };
  assert.equal((await post('/api/runs', huge, auth)).status, 413);
});

test('missing required models fails explicitly instead of silently substituting', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-model-'));
  const codex = new MockAppServer({ includeLuna: false });
  const harness = createHarnessServer({ repoRoot, appServer: codex });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const auth = { 'Content-Type': 'application/json', 'X-Rim-Harness-Token': harness.token };
  await fetch(`${origin}/api/runs`, { method: 'POST', headers: auth, body: JSON.stringify({ objective: 'model check' }) });
  await fetch(`${origin}/api/codex/connect`, { method: 'POST', headers: auth, body: '{}' });
  const response = await fetch(`${origin}/api/actions/plan/start`, { method: 'POST', headers: auth, body: '{}' });
  assert.equal(response.status, 409);
  assert.match((await response.json()).error.message, /gpt-5\.6-luna/);
});

test('running agent turns can be explicitly interrupted', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-interrupt-'));
  const codex = new MockAppServer({ interruptCompletesBeforeResponse: true });
  const harness = createHarnessServer({ repoRoot, appServer: codex });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const headers = { 'Content-Type': 'application/json', 'X-Rim-Harness-Token': harness.token };
  const post = (url, body = {}) => fetch(`${origin}${url}`, { method: 'POST', headers, body: JSON.stringify(body) });
  await post('/api/runs', { objective: 'interrupt check' });
  await post('/api/codex/connect');
  const running = await json(await post('/api/actions/plan/start'));
  codex.startTurn(running.phaseThreads.planner.threadId, 'actual-interrupt-turn');
  await tick();
  const stopped = await json(await post('/api/actions/turn/interrupt'));
  assert.equal(stopped.status, 'stopped');
  assert.equal(nodeStatus(stopped, 'planner'), 'stopped');
  assert.deepEqual(codex.find('thread/goal/set', -1).params, { threadId: running.phaseThreads.planner.threadId, status: 'paused' });
  assert.deepEqual(codex.find('turn/interrupt', -1).params, { threadId: running.phaseThreads.planner.threadId, turnId: 'actual-interrupt-turn' });
});

test('canceling an app approval also pauses the goal and stops the current turn', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-cancel-'));
  const codex = new MockAppServer();
  const harness = createHarnessServer({ repoRoot, appServer: codex });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const headers = { 'Content-Type': 'application/json', 'X-Rim-Harness-Token': harness.token };
  const post = (url, body = {}) => fetch(`${origin}${url}`, { method: 'POST', headers, body: JSON.stringify(body) });
  await post('/api/runs', { objective: 'approval cancel check' });
  await post('/api/codex/connect');
  const running = await json(await post('/api/actions/plan/start'));
  codex.startTurn(running.phaseThreads.planner.threadId, 'approval-turn');
  codex.approval(93, running.phaseThreads.planner.threadId, 'approval-turn');
  await tick();
  const stopped = await json(await post('/api/actions/approval/respond', { requestId: 93, decision: 'cancel' }));
  assert.equal(stopped.status, 'stopped');
  assert.deepEqual(codex.lastApproval, { requestId: 93, result: { decision: 'cancel' } });
  assert.deepEqual(codex.find('thread/goal/set', -1).params, { threadId: running.phaseThreads.planner.threadId, status: 'paused' });
  assert.deepEqual(codex.find('turn/interrupt', -1).params, { threadId: running.phaseThreads.planner.threadId, turnId: 'approval-turn' });
});

test('a streamed partial turn remains stoppable when turn/start returns an error', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-partial-'));
  const codex = new MockAppServer({ turnStartFailsAfterStarted: true });
  const harness = createHarnessServer({ repoRoot, appServer: codex });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const headers = { 'Content-Type': 'application/json', 'X-Rim-Harness-Token': harness.token };
  const post = (url, body = {}) => fetch(`${origin}${url}`, { method: 'POST', headers, body: JSON.stringify(body) });
  await post('/api/runs', { objective: 'partial start check' });
  await post('/api/codex/connect');
  const failedStart = await post('/api/actions/plan/start');
  assert.equal(failedStart.status, 400);
  let run = await json(await fetch(`${origin}/api/runs/current`));
  assert.equal(run.status, 'failed');
  assert.equal(run.phaseThreads.planner.activeTurnId, 'partial-actual-turn');
  assert.equal((await post('/api/runs', { objective: 'must wait' })).status, 409);
  run = await json(await post('/api/actions/turn/interrupt'));
  assert.equal(run.status, 'stopped');
  assert.equal(run.phaseThreads.planner.activeTurnId, null);
});

test('approval transport failure preserves the pending approval for retry', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-approval-retry-'));
  const codex = new MockAppServer({ approvalWriteFails: true });
  const harness = createHarnessServer({ repoRoot, appServer: codex });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const headers = { 'Content-Type': 'application/json', 'X-Rim-Harness-Token': harness.token };
  const post = (url, body = {}) => fetch(`${origin}${url}`, { method: 'POST', headers, body: JSON.stringify(body) });
  await post('/api/runs', { objective: 'approval retry check' });
  await post('/api/codex/connect');
  const running = await json(await post('/api/actions/plan/start'));
  codex.startTurn(running.phaseThreads.planner.threadId, 'approval-retry-turn');
  codex.approval(94, running.phaseThreads.planner.threadId, 'approval-retry-turn');
  await tick();
  assert.equal((await post('/api/actions/approval/respond', { requestId: 94, decision: 'accept' })).status, 400);
  let run = await json(await fetch(`${origin}/api/runs/current`));
  assert.equal(run.waitingFor.type, 'app-server');
  assert.equal(run.waitingFor.requestId, 94);
  codex.approvalWriteFails = false;
  run = await json(await post('/api/actions/approval/respond', { requestId: 94, decision: 'accept' }));
  assert.equal(run.waitingFor, null);
  assert.equal(run.status, 'running');
});

test('app-server exit safely stops a live run and permits a replacement', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-exit-recovery-'));
  const codex = new MockAppServer();
  const harness = createHarnessServer({ repoRoot, appServer: codex });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const headers = { 'Content-Type': 'application/json', 'X-Rim-Harness-Token': harness.token };
  const post = (url, body = {}) => fetch(`${origin}${url}`, { method: 'POST', headers, body: JSON.stringify(body) });
  await post('/api/runs', { objective: 'exit recovery check' });
  await post('/api/codex/connect');
  const running = await json(await post('/api/actions/plan/start'));
  codex.startTurn(running.phaseThreads.planner.threadId, 'exit-active-turn');
  codex.emit('exit', { code: 17, signal: null });
  await tick();
  const recovered = await json(await fetch(`${origin}/api/runs/current`));
  assert.equal(recovered.status, 'stopped');
  assert.equal(recovered.phaseThreads.planner.activeTurnId, null);
  assert.equal((await post('/api/runs', { objective: 'replacement after exit' })).status, 201);
});

test('UTF-8 JSON remains valid when a Japanese character is split across HTTP chunks', async (context) => {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'rim-harness-utf8-'));
  const harness = createHarnessServer({ repoRoot, appServer: new MockAppServer() });
  await listen(harness.server);
  context.after(() => close(harness.server));
  const origin = `http://127.0.0.1:${harness.server.address().port}`;
  const body = Buffer.from(JSON.stringify({ objective: 'シオンのMOD検証' }), 'utf8');
  const split = body.indexOf(Buffer.from('シ', 'utf8')) + 1;
  const response = await postChunks(`${origin}/api/runs`, [body.subarray(0, split), body.subarray(split)], {
    'Content-Type': 'application/json',
    'Content-Length': String(body.length),
    'X-Rim-Harness-Token': harness.token,
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.objective, 'シオンのMOD検証');
});

class MockAppServer extends EventEmitter {
  constructor({ includeLuna = true, interruptCompletesBeforeResponse = false, turnStartFailsAfterStarted = false, approvalWriteFails = false } = {}) {
    super();
    this.includeLuna = includeLuna;
    this.interruptCompletesBeforeResponse = interruptCompletesBeforeResponse;
    this.turnStartFailsAfterStarted = turnStartFailsAfterStarted;
    this.approvalWriteFails = approvalWriteFails;
    this.child = null;
    this.initialized = false;
    this.requests = [];
    this.threadIndex = 0;
    this.turnIndex = 0;
    this.goals = new Map();
  }

  start() {
    this.child = {};
    return this;
  }

  async initialize() {
    this.initialized = true;
    return { ok: true };
  }

  async request(method, params) {
    this.requests.push({ method, params });
    if (method === 'model/list') {
      const names = this.includeLuna ? ['gpt-5.6-sol', 'gpt-5.6-luna'] : ['gpt-5.6-sol'];
      return { data: names.map((model) => ({
        id: model,
        model,
        displayName: model,
        defaultReasoningEffort: model.endsWith('sol') ? 'high' : 'medium',
        supportedReasoningEfforts: [{ reasoningEffort: model.endsWith('sol') ? 'high' : 'medium' }],
      })) };
    }
    if (method === 'thread/start') return { thread: { id: `thread-${++this.threadIndex}` } };
    if (method === 'thread/goal/set') {
      const previous = this.goals.get(params.threadId) ?? {};
      const goal = { ...previous, ...params, objective: params.objective ?? previous.objective, tokensUsed: previous.tokensUsed ?? 0 };
      this.goals.set(params.threadId, goal);
      queueMicrotask(() => this.emit('event', { method: 'thread/goal/updated', params: { threadId: params.threadId, goal } }));
      return { goal };
    }
    if (method === 'thread/goal/get') return { goal: this.goals.get(params.threadId) ?? null };
    if (method === 'turn/start' && this.turnStartFailsAfterStarted) {
      this.emit('event', {
        method: 'turn/started',
        params: { threadId: params.threadId, turn: { id: 'partial-actual-turn', status: 'inProgress', items: [] } },
      });
      throw new Error('simulated turn/start response failure');
    }
    if (method === 'turn/start') return { turn: { id: `turn-${++this.turnIndex}`, status: 'inProgress', items: [] } };
    if (method === 'review/start') return { reviewThreadId: params.threadId, turn: { id: `turn-${++this.turnIndex}`, status: 'inProgress', items: [] } };
    if (method === 'turn/interrupt' && this.interruptCompletesBeforeResponse) {
      this.emit('event', {
        method: 'turn/completed',
        params: { threadId: params.threadId, turn: { id: params.turnId, status: 'interrupted', items: [] } },
      });
      return { ok: true };
    }
    return { ok: true };
  }

  answerApproval(requestId, result) {
    if (this.approvalWriteFails) throw new Error('simulated approval transport failure');
    this.lastApproval = { requestId, result };
  }

  find(method, index = 0) {
    return this.requests.filter((request) => request.method === method).at(index);
  }

  complete(turnId, threadId, text) {
    this.emit('event', {
      method: 'turn/completed',
      params: { threadId, turn: { id: turnId, status: 'completed', items: [{ id: `item-${turnId}`, type: 'agentMessage', text }] } },
    });
  }

  startTurn(threadId, turnId) {
    this.emit('event', {
      method: 'turn/started',
      params: { threadId, turn: { id: turnId, status: 'inProgress', items: [] } },
    });
  }

  completeGoal(threadId) {
    const goal = { ...(this.goals.get(threadId) ?? { threadId }), status: 'complete' };
    this.goals.set(threadId, goal);
    this.emit('event', { method: 'thread/goal/updated', params: { threadId, goal } });
  }

  approval(id, threadId = 'thread', turnId = 'turn') {
    this.emit('event', {
      id,
      method: 'item/commandExecution/requestApproval',
      params: { command: 'dotnet test', cwd: 'repo', reason: 'test', itemId: 'item', threadId, turnId, startedAtMs: Date.now() },
    });
  }
}

function nodeStatus(run, id) {
  return run.nodes.find((entry) => entry.id === id)?.status;
}

async function listen(server) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
}

async function close(server) {
  if (!server.listening) return;
  await new Promise((resolve) => server.close(resolve));
}

async function json(response) {
  const payload = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${payload.error?.message}`);
  return payload;
}

async function tick() {
  await new Promise((resolve) => setTimeout(resolve, 20));
}

function postChunks(url, chunks, headers) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const request = httpRequest({
      hostname: target.hostname,
      port: target.port,
      path: target.pathname,
      method: 'POST',
      headers,
    }, (response) => {
      const received = [];
      response.on('data', (chunk) => received.push(chunk));
      response.on('end', () => {
        resolve({ status: response.statusCode, body: JSON.parse(Buffer.concat(received).toString('utf8')) });
      });
    });
    request.on('error', reject);
    request.write(chunks[0]);
    setTimeout(() => {
      for (const chunk of chunks.slice(1)) request.write(chunk);
      request.end();
    }, 10);
  });
}
