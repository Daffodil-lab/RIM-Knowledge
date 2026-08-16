import assert from 'node:assert/strict';
import test from 'node:test';
import { approvalRequestText, setText } from '../public/render-utils.mjs';
import {
  answerAppApproval,
  applyProtocolEvent,
  approvePlan,
  approveRepair,
  beginPhase,
  beginAgentPhase,
  buildGoalObjective,
  createRun,
  node,
  normalizeTokenUsage,
  isDisplayableProtocolEvent,
  protocolEventBelongsToRun,
  recordPublication,
  recordValidation,
  recoverInterruptedRun,
  requireModels,
  setModelCatalog,
} from '../lib/workflow.mjs';

const models = [
  { id: 'gpt-5.6-sol', model: 'gpt-5.6-sol', displayName: 'Sol', supportedReasoningEfforts: [{ reasoningEffort: 'high' }] },
  { id: 'gpt-5.6-luna', model: 'gpt-5.6-luna', displayName: 'Luna', supportedReasoningEfforts: [{ reasoningEffort: 'medium' }] },
];

test('run preserves conditions, optional budget, and exact role definitions', () => {
  const run = createRun({
    objective: 'MOD test',
    conditions: { completion: ['build'], investigation: 'API drift\nruntime gap', stop: ['same failure twice'] },
  });
  assert.deepEqual(run.conditions, {
    completion: ['build'],
    investigation: ['API drift', 'runtime gap'],
    stop: ['same failure twice'],
  });
  assert.equal(Object.hasOwn(run, 'tokenBudget'), false);
  assert.deepEqual(
    ['planner', 'worker', 'review', 'repair'].map((id) => {
      const entry = node(run, id);
      return [id, entry.model, entry.effort, entry.sandbox];
    }),
    [
      ['planner', 'gpt-5.6-sol', 'high', 'read-only'],
      ['worker', 'gpt-5.6-luna', 'medium', 'workspace-write'],
      ['review', 'gpt-5.6-sol', 'high', 'read-only'],
      ['repair', 'gpt-5.6-luna', 'medium', 'workspace-write'],
    ],
  );
});

test('phase goal objectives preserve planner, worker, and repair ownership boundaries', () => {
  const run = createRun({ objective: 'Kombinat production smoke' });
  run.repairScope = 'P1 finding Aだけ';
  assert.match(buildGoalObjective(run, 'planner'), /実装契約/);
  assert.match(buildGoalObjective(run, 'worker'), /承認済み計画/);
  assert.match(buildGoalObjective(run, 'repair'), /P1 finding Aだけ/);
  assert.ok(buildGoalObjective(run, 'repair').length <= 4_000);
});

test('turn completion waits for validation and human approvals remain separate from app-server approvals', () => {
  const run = createRun({ objective: 'MOD test' });
  setModelCatalog(run, models);
  requireModels(run);
  beginPhase(run, 'planner', { threadId: 'planner-thread', turnId: 'planner-turn' });
  applyProtocolEvent(run, completed('planner-thread', 'planner-turn', 'plan text'));
  assert.equal(node(run, 'planner').status, 'passed');
  assert.equal(node(run, 'approval-plan').status, 'waiting');
  assert.deepEqual(run.waitingFor, { type: 'human', kind: 'plan' });

  approvePlan(run);
  beginPhase(run, 'worker', { threadId: 'worker-thread', turnId: 'worker-turn' });
  applyProtocolEvent(run, completed('worker-thread', 'worker-turn', 'implementation result'));
  assert.equal(node(run, 'validation').status, 'waiting');
  assert.notEqual(node(run, 'validation').status, 'passed');

  applyProtocolEvent(run, {
    id: 77,
    method: 'item/commandExecution/requestApproval',
    params: { command: 'dotnet build', cwd: 'repo', reason: 'test' },
  });
  assert.equal(run.waitingFor.type, 'app-server');
  assert.throws(() => approvePlan(run), /human plan/);
  answerAppApproval(run, 77);
  assert.equal(run.waitingFor, null);
});

test('goal phases follow actual streamed turn ids and wait for a terminal goal', () => {
  const run = createRun({ objective: 'MOD goal test' });
  beginAgentPhase(run, 'planner', { threadId: 'planner-thread', turnId: 'response-turn', usesGoal: true });
  applyProtocolEvent(run, {
    method: 'turn/started',
    params: { threadId: 'planner-thread', turn: { id: 'actual-turn', status: 'inProgress', items: [] } },
  });
  applyProtocolEvent(run, completed('planner-thread', 'actual-turn', 'first pass'));
  assert.equal(node(run, 'planner').status, 'running');
  assert.equal(run.phaseThreads.planner.activeTurnId, null);

  applyProtocolEvent(run, {
    method: 'thread/goal/updated',
    params: { threadId: 'planner-thread', goal: { threadId: 'planner-thread', objective: 'MOD goal test', status: 'complete' } },
  });
  assert.equal(node(run, 'planner').status, 'passed');
  assert.equal(node(run, 'approval-plan').status, 'waiting');
  assert.equal(run.outputs.planner, 'first pass');
});

test('event display suppresses streaming deltas but retains lifecycle evidence', () => {
  assert.equal(isDisplayableProtocolEvent({ method: 'item/agentMessage/delta' }), false);
  assert.equal(isDisplayableProtocolEvent({ method: 'turn/completed' }), true);
  assert.equal(isDisplayableProtocolEvent({ type: 'malformed', raw: '{bad' }), true);
});

test('events from superseded agent threads cannot mutate a replacement run', () => {
  const run = createRun({ objective: 'new run' });
  beginAgentPhase(run, 'planner', { threadId: 'new-thread', turnId: 'new-turn', usesGoal: true });
  assert.equal(protocolEventBelongsToRun(run, { method: 'item/fileChange/requestApproval', params: { threadId: 'old-thread' } }), false);
  assert.equal(protocolEventBelongsToRun(run, { method: 'turn/completed', params: { threadId: 'new-thread' } }), true);
});

test('a persisted live phase recovers stopped after a harness restart', () => {
  const run = createRun({ objective: 'restart safety' });
  beginAgentPhase(run, 'worker', { threadId: 'thread', turnId: 'turn', usesGoal: true });
  run.waitingFor = { type: 'app-server', requestId: 7 };
  run.status = 'waiting-app-approval';
  recoverInterruptedRun(run);
  assert.equal(run.status, 'stopped');
  assert.equal(node(run, 'worker').status, 'stopped');
  assert.equal(run.waitingFor, null);
  assert.equal(run.phaseThreads.worker.activeTurnId, null);
  assert.equal(run.events.at(-1).method, 'harness/recovered-stale-run');
});

test('validation, review, repair, final validation, and publication follow state gates', () => {
  const run = createRun({ objective: 'MOD test' });
  setModelCatalog(run, models);
  beginPhase(run, 'planner', { threadId: 't1', turnId: 'p1' });
  applyProtocolEvent(run, completed('t1', 'p1', 'plan'));
  approvePlan(run);
  beginPhase(run, 'worker', { threadId: 't2', turnId: 'w1' });
  applyProtocolEvent(run, completed('t2', 'w1', 'work'));
  recordValidation(run, 'implementation', { outcome: 'pass', evidence: 'tests passed' });
  beginPhase(run, 'review', { threadId: 't3', turnId: 'r1' });
  applyProtocolEvent(run, completed('t3', 'r1', 'finding'));
  approveRepair(run, 'findingだけを修正');
  beginPhase(run, 'repair', { threadId: 't4', turnId: 'fix1' });
  applyProtocolEvent(run, completed('t4', 'fix1', 'fixed'));
  recordValidation(run, 'final', { outcome: 'pass', evidence: 'final tests passed' });
  recordPublication(run, 'remote sha abc, Actions PASS');
  assert.equal(run.status, 'completed');
  assert.equal(node(run, 'publish').status, 'passed');
});

test('schema-real token usage normalizes counts while retaining raw values', () => {
  const raw = {
    total: { inputTokens: 80, cachedInputTokens: 20, cacheWriteInputTokens: 5, outputTokens: 30, reasoningOutputTokens: 10, totalTokens: 110 },
    last: { inputTokens: 8, cachedInputTokens: 2, outputTokens: 3, reasoningOutputTokens: 1, totalTokens: 11 },
    modelContextWindow: 200000,
  };
  assert.deepEqual(normalizeTokenUsage(raw), {
    total: 110,
    input: 80,
    cachedInput: 20,
    cacheWriteInput: 5,
    output: 30,
    reasoning: 10,
    contextWindow: 200000,
    raw,
  });
});

test('run token usage aggregates separate agent phase threads', () => {
  const run = createRun({ objective: 'aggregate tokens' });
  beginPhase(run, 'planner', { threadId: 'planner-thread', turnId: 'planner-turn' });
  applyProtocolEvent(run, tokenUsage('planner-thread', 'planner-turn', 80));
  node(run, 'planner').status = 'passed';
  beginPhase(run, 'worker', { threadId: 'worker-thread', turnId: 'worker-turn' });
  applyProtocolEvent(run, tokenUsage('worker-thread', 'worker-turn', 120));
  assert.equal(run.tokenUsage.total, 200);
  assert.equal(node(run, 'planner').tokens.total, 80);
  assert.equal(node(run, 'worker').tokens.total, 120);
});

test('render helper treats markup as text', () => {
  const element = { textContent: '' };
  setText(element, '<img src=x onerror=alert(1)>');
  assert.equal(element.textContent, '<img src=x onerror=alert(1)>');
});

test('approval summary exposes paths and permission scope without file contents', () => {
  const summary = approvalRequestText('item/fileChange/requestApproval', 91, {
    threadId: 'thread',
    turnId: 'turn',
    grantRoot: 'C:\\repo\\Mods',
    reason: 'write generated Def',
    fileChanges: {
      'Mods/Shion/Defs/Test.xml': { type: 'update', unified_diff: 'SECRET-CONTENT' },
    },
  });
  assert.match(summary, /Mods\/Shion\/Defs\/Test\.xml: update/);
  assert.match(summary, /grantRoot: C:\\repo\\Mods/);
  assert.doesNotMatch(summary, /SECRET-CONTENT/);
});

function completed(threadId, turnId, text) {
  return {
    method: 'turn/completed',
    params: { threadId, turn: { id: turnId, status: 'completed', items: [{ id: `item-${turnId}`, type: 'agentMessage', text }] } },
  };
}

function tokenUsage(threadId, turnId, totalTokens) {
  return {
    method: 'thread/tokenUsage/updated',
    params: {
      threadId,
      turnId,
      tokenUsage: {
        total: { totalTokens, inputTokens: totalTokens, cachedInputTokens: 0, outputTokens: 0, reasoningOutputTokens: 0 },
        modelContextWindow: 258400,
      },
    },
  };
}
