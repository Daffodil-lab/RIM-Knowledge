export const NODE_DEFS = Object.freeze([
  { id: 'objective', label: '目的', role: 'human' },
  { id: 'planner', label: 'Sol 計画', role: 'planner', model: 'gpt-5.6-sol', effort: 'high', sandbox: 'read-only' },
  { id: 'approval-plan', label: '計画の人間承認', role: 'human' },
  { id: 'worker', label: 'Luna 実装', role: 'worker', model: 'gpt-5.6-luna', effort: 'medium', sandbox: 'workspace-write' },
  { id: 'validation', label: '検証', role: 'human' },
  { id: 'review', label: 'Sol 独立レビュー', role: 'reviewer', model: 'gpt-5.6-sol', effort: 'high', sandbox: 'read-only' },
  { id: 'approval-repair', label: '修正範囲の人間承認', role: 'human' },
  { id: 'repair', label: 'Luna 修正', role: 'worker', model: 'gpt-5.6-luna', effort: 'medium', sandbox: 'workspace-write' },
  { id: 'final-validation', label: '最終検証', role: 'human' },
  { id: 'publish', label: 'GitHub 同期', role: 'human' },
]);

export const NODE_IDS = Object.freeze(NODE_DEFS.map((node) => node.id));

export function createRun({ id, objective, conditions, tokenBudget } = {}) {
  const cleanObjective = String(objective ?? '').trim();
  if (!cleanObjective) throw new Error('objective is required');
  if (cleanObjective.length > 4_000) throw new Error('objective must be at most 4000 characters');

  const run = {
    id: id || `run-${Date.now()}`,
    objective: cleanObjective,
    status: 'ready-to-plan',
    currentNode: 'planner',
    waitingFor: null,
    conditions: {
      completion: normalizeLines(conditions?.completion),
      investigation: normalizeLines(conditions?.investigation),
      stop: normalizeLines(conditions?.stop),
    },
    nodes: NODE_DEFS.map((node) => ({
      ...node,
      status: node.id === 'objective' ? 'passed' : 'pending',
      tokens: emptyTokenUsage(),
    })),
    tokenUsage: emptyTokenUsage(),
    phaseThreads: {},
    phaseGoals: {},
    turnPhases: {},
    outputs: {},
    validations: [],
    reviews: [],
    events: [],
    chat: [],
    chatSequence: 0,
    unknownEvents: [],
    modelCatalog: [],
    publication: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (tokenBudget !== undefined) {
    if (!Number.isSafeInteger(tokenBudget) || tokenBudget <= 0) {
      throw new Error('tokenBudget must be a positive integer');
    }
    run.tokenBudget = tokenBudget;
  }

  return run;
}

export function applyProtocolEvent(run, event) {
  const method = event?.method;
  if (isDisplayableProtocolEvent(event)) appendBounded(run.events, summarizeEvent(event), 200);

  if (method === 'thread/tokenUsage/updated' || method === 'turn/tokenUsage/updated') {
    const usage = normalizeTokenUsage(event.params?.tokenUsage);
    const phase = phaseForEvent(run, event.params);
    if (phase) {
      node(run, phase).tokens = usage;
      run.tokenUsage = aggregateNodeTokens(run.nodes);
    }
  } else if (method === 'turn/started') {
    registerStartedTurn(run, event.params);
  } else if (method === 'thread/goal/updated') {
    updatePhaseGoal(run, event.params);
  } else if (method?.toLowerCase().includes('requestapproval')) {
    const resumeWaitingFor = run.waitingFor;
    const resumeStatus = run.status;
    run.waitingFor = {
      type: 'app-server',
      requestId: event.id,
      method,
      request: event.params ?? {},
      resumeWaitingFor,
      resumeStatus,
    };
    run.status = 'waiting-app-approval';
    appendChat(run, {
      itemId: `approval-${String(event.id)}`,
      phase: phaseForEvent(run, event.params),
      threadId: event.params?.threadId,
      turnId: event.params?.turnId,
      role: 'system',
      kind: 'approval',
      status: 'waiting',
      toolSummary: summarizeApproval(event.params),
    });
  } else if (method === 'item/started') {
    captureChatItem(run, event.params, false);
  } else if (method === 'item/completed') {
    captureCompletedItem(run, event.params);
    captureChatItem(run, event.params, true);
  } else if (method === 'item/agentMessage/delta') {
    captureChatDelta(run, event.params, 'message');
  } else if (method === 'item/plan/delta') {
    captureChatDelta(run, event.params, 'plan');
  } else if (method === 'turn/completed') {
    completeTurn(run, event.params);
  } else if (method && !isKnownTransientEvent(method)) {
    appendBounded(run.unknownEvents, event, 100);
  } else if (event?.type === 'malformed') {
    appendBounded(run.unknownEvents, event, 100);
  }

  touch(run);
  return run;
}

export function protocolEventBelongsToRun(run, event) {
  if (!run) return false;
  if (event?.type === 'malformed') return true;
  const params = event?.params ?? {};
  const threadId = params.threadId ?? params.thread?.id ?? params.conversationId;
  if (!threadId) return true;
  return Object.values(run.phaseThreads ?? {}).some((runtime) => runtime?.threadId === threadId);
}

export function chatPhaseForRun(run) {
  const gateMap = { 'approval-plan': 'planner', validation: 'worker', 'approval-repair': 'review', 'final-validation': 'repair' };
  const phase = gateMap[run?.currentNode] ?? run?.currentNode;
  return run?.phaseThreads?.[phase]?.threadId ? phase : null;
}

export function setModelCatalog(run, models) {
  run.modelCatalog = Array.isArray(models)
    ? models.map((model) => ({
        id: model.id,
        model: model.model,
        displayName: model.displayName,
        efforts: (model.supportedReasoningEfforts ?? []).map((entry) => entry.reasoningEffort ?? entry.effort ?? entry),
      }))
    : [];
  touch(run);
  return run;
}

export function requireModels(run, requirements = NODE_DEFS.filter((item) => item.model)) {
  if (!run.modelCatalog.length) throw new Error('model catalog is not loaded');
  for (const requirement of requirements) {
    const model = run.modelCatalog.find((entry) => entry.model === requirement.model || entry.id === requirement.model);
    if (!model) throw new Error(`required model is unavailable: ${requirement.model}`);
    if (model.efforts.length && !model.efforts.includes(requirement.effort)) {
      throw new Error(`required effort is unavailable: ${requirement.model}/${requirement.effort}`);
    }
  }
}

export function beginPhase(run, phase, { threadId, turnId }) {
  return beginAgentPhase(run, phase, { threadId, turnId, usesGoal: false });
}

export function beginAgentPhase(run, phase, { threadId, turnId, usesGoal = false }) {
  const target = node(run, phase);
  if (target.status !== 'pending') throw new Error(`invalid state for ${phase}: ${target.status}`);
  target.status = 'running';
  run.currentNode = phase;
  run.status = 'running';
  run.phaseThreads[phase] = { threadId, turnId: turnId ?? null, activeTurnId: turnId ?? null, usesGoal };
  if (turnId) run.turnPhases[turnId] = phase;
  touch(run);
  return run;
}

export function attachPhaseTurn(run, phase, turnId) {
  if (!turnId) throw new Error('turnId is required');
  const runtime = run.phaseThreads[phase];
  if (!runtime) throw new Error(`phase thread is not initialized: ${phase}`);
  runtime.turnId = turnId;
  if (!runtime.activeTurnId) runtime.activeTurnId = turnId;
  run.turnPhases[turnId] = phase;
  touch(run);
  return run;
}

export function failAgentPhase(run, phase, error) {
  const target = node(run, phase);
  target.status = 'failed';
  run.currentNode = phase;
  run.status = 'failed';
  run.outputs[phase] = String(error?.message ?? error ?? 'phase start failed');
  touch(run);
  return run;
}

export function approvePlan(run) {
  requireHumanWaiting(run, 'plan');
  node(run, 'approval-plan').status = 'passed';
  run.waitingFor = null;
  run.currentNode = 'worker';
  run.status = 'ready-to-implement';
  touch(run);
  return run;
}

export function recordValidation(run, phase, { outcome, evidence } = {}) {
  const nodeId = phase === 'final' ? 'final-validation' : 'validation';
  const target = node(run, nodeId);
  if (target.status !== 'waiting') throw new Error(`invalid state for ${nodeId}: ${target.status}`);
  if (!['pass', 'fail', 'investigate', 'stop'].includes(outcome)) throw new Error('invalid validation outcome');
  const cleanEvidence = String(evidence ?? '').trim();
  if (!cleanEvidence) throw new Error('validation evidence is required');

  run.validations.push({ phase, outcome, evidence: cleanEvidence, at: new Date().toISOString() });
  target.status = outcome === 'pass' ? 'passed' : outcome === 'fail' ? 'failed' : outcome === 'stop' ? 'stopped' : 'waiting';

  if (outcome === 'pass') {
    run.currentNode = phase === 'final' ? 'publish' : 'review';
    run.status = phase === 'final' ? 'ready-to-publish' : 'ready-to-review';
  } else {
    run.currentNode = nodeId;
    run.status = outcome === 'investigate' ? 'investigating' : outcome === 'stop' ? 'stopped' : 'failed';
  }
  touch(run);
  return run;
}

export function approveRepair(run, scope) {
  requireHumanWaiting(run, 'repair-scope');
  const cleanScope = String(scope ?? '').trim();
  if (!cleanScope) throw new Error('repair scope is required');
  node(run, 'approval-repair').status = 'passed';
  run.repairScope = cleanScope;
  run.waitingFor = null;
  run.currentNode = 'repair';
  run.status = 'ready-to-repair';
  touch(run);
  return run;
}

export function answerAppApproval(run, requestId) {
  requireAppApproval(run, requestId);
  const { resumeWaitingFor = null, resumeStatus = 'running' } = run.waitingFor;
  run.waitingFor = resumeWaitingFor;
  run.status = resumeStatus;
  touch(run);
  return run;
}

export function requireAppApproval(run, requestId) {
  if (run.waitingFor?.type !== 'app-server' || String(run.waitingFor.requestId) !== String(requestId)) {
    throw new Error('approval request does not match the active request');
  }
  return run;
}

export function recordPublication(run, evidence) {
  const target = node(run, 'publish');
  if (target.status !== 'pending') throw new Error(`invalid state for publish: ${target.status}`);
  if (node(run, 'final-validation').status !== 'passed') throw new Error('final validation has not passed');
  const cleanEvidence = String(evidence ?? '').trim();
  if (!cleanEvidence) throw new Error('publication evidence is required');
  target.status = 'passed';
  run.publication = { evidence: cleanEvidence, at: new Date().toISOString() };
  run.currentNode = 'publish';
  run.status = 'completed';
  touch(run);
  return run;
}

export function interruptCurrentPhase(run) {
  const target = node(run, run.currentNode);
  const runtime = run.phaseThreads?.[target.id];
  if (target.status === 'stopped' && run.status === 'stopped') return run;
  if (!['planner', 'worker', 'review', 'repair'].includes(target.id)
    || (target.status !== 'running' && !runtime?.activeTurnId)) {
    throw new Error('no running agent phase to interrupt');
  }
  if (runtime?.chatResume) {
    const interruptedTurnId = runtime.activeTurnId;
    restoreChatFollowup(run, target.id);
    if (interruptedTurnId) {
      runtime.ignoredChatTerminalTurnIds ??= [];
      appendBounded(runtime.ignoredChatTerminalTurnIds, interruptedTurnId, 10);
    }
    for (const entry of run.chat ?? []) {
      if (entry.turnId === interruptedTurnId
        && ['sending', 'sent', 'sent-unknown', 'streaming', 'running'].includes(entry.status)) {
        entry.status = 'interrupted';
        entry.updatedAt = new Date().toISOString();
      }
    }
    return run;
  }
  target.status = 'stopped';
  if (runtime) runtime.activeTurnId = null;
  run.waitingFor = null;
  run.status = 'stopped';
  touch(run);
  return run;
}

export function recoverInterruptedRun(run) {
  const hasActiveTurn = Object.values(run?.phaseThreads ?? {}).some((runtime) => Boolean(runtime?.activeTurnId));
  if (!run || (!['running', 'waiting-app-approval'].includes(run.status) && !hasActiveTurn)) return run;
  const chatFollowup = Object.entries(run.phaseThreads ?? {}).find(([, runtime]) => runtime?.chatResume);
  if (chatFollowup) {
    restoreChatFollowup(run, chatFollowup[0]);
    markInterruptedChatEntries(run);
    appendBounded(run.events ??= [], {
      method: 'harness/recovered-chat-followup',
      emittedAtMs: Date.now(),
    }, 200);
    touch(run);
    return run;
  }
  const target = run.nodes?.find((entry) => entry.id === run.currentNode);
  if (target?.status === 'running') target.status = 'stopped';
  markInterruptedChatEntries(run);
  if (run.phaseThreads?.[run.currentNode]) run.phaseThreads[run.currentNode].activeTurnId = null;
  run.waitingFor = null;
  run.status = 'stopped';
  appendBounded(run.events ??= [], {
    method: 'harness/recovered-stale-run',
    emittedAtMs: Date.now(),
  }, 200);
  touch(run);
  return run;
}

export function appendChat(run, {
  id,
  phase,
  threadId,
  turnId,
  itemId,
  clientUserMessageId,
  role = 'user',
  kind = 'message',
  status = 'completed',
  text = '',
  toolSummary = '',
} = {}) {
  run.chat ??= [];
  run.chatSequence = (run.chatSequence ?? 0) + 1;
  const now = new Date().toISOString();
  const entry = {
    id: id || `chat-${run.chatSequence}`,
    phase: phase ?? null,
    threadId: threadId ?? null,
    turnId: turnId ?? null,
    itemId: itemId ?? null,
    clientUserMessageId: clientUserMessageId ?? null,
    role,
    kind,
    status,
    text: String(text ?? '').slice(0, 32 * 1024),
    toolSummary: String(toolSummary ?? '').slice(0, 4 * 1024),
    createdAt: now,
    updatedAt: now,
  };
  run.chat.push(entry);
  if (run.chat.length > 200) run.chat.splice(0, run.chat.length - 200);
  return entry;
}

export function updateChatEntry(run, entryId, changes = {}) {
  const entry = run.chat?.find((candidate) => candidate.id === entryId);
  if (!entry) throw new Error(`unknown chat entry: ${entryId}`);
  for (const key of ['status', 'turnId', 'itemId']) {
    if (changes[key] !== undefined) entry[key] = changes[key];
  }
  if (changes.text !== undefined) entry.text = String(changes.text).slice(0, 32 * 1024);
  if (changes.toolSummary !== undefined) entry.toolSummary = String(changes.toolSummary).slice(0, 4 * 1024);
  entry.updatedAt = new Date().toISOString();
  touch(run);
  return entry;
}

export function recordChatApprovalDecision(run, requestId, decision) {
  const waitingEntry = [...(run.chat ?? [])].reverse().find((entry) => (
    entry.kind === 'approval'
    && entry.status === 'waiting'
    && entry.itemId === `approval-${String(requestId)}`
  ));
  if (waitingEntry) updateChatEntry(run, waitingEntry.id, { status: decision });
  return appendChat(run, {
    role: 'system',
    kind: 'approval',
    status: 'completed',
    toolSummary: `requestId=${String(requestId).slice(0, 100)} decision=${String(decision).slice(0, 40)}`,
  });
}
function captureChatDelta(run, params = {}, kind = 'message') {
  const itemId = params.itemId;
  if (!itemId || !params.delta) return;
  const phase = phaseForEvent(run, params);
  if (!phase) return;
  const threadId = params.threadId ?? run.phaseThreads[phase]?.threadId;
  const turnId = eventTurnId(params) ?? run.phaseThreads[phase]?.activeTurnId;
  if (run.phaseThreads[phase]?.ignoredChatTerminalTurnIds?.includes(turnId)) return;
  let entry = run.chat?.find((item) => item.itemId === itemId && item.threadId === threadId && item.turnId === turnId);
  if (!entry) {
    entry = appendChat(run, {
      itemId,
      phase,
      threadId,
      turnId,
      role: 'assistant',
      kind,
      status: 'streaming',
    });
  }
  entry.text = `${entry.text}${params.delta}`.slice(0, 32 * 1024);
  entry.updatedAt = new Date().toISOString();
}
function captureChatItem(run, params = {}, final) {
  const item = params.item ?? {};
  if (!item.id) return;
  const phase = phaseForEvent(run, params);
  if (!phase) return;
  const threadId = params.threadId ?? run.phaseThreads[phase]?.threadId;
  const turnId = eventTurnId(params) ?? run.phaseThreads[phase]?.activeTurnId;
  if (run.phaseThreads[phase]?.ignoredChatTerminalTurnIds?.includes(turnId)) return;
  let entry = item.type === 'userMessage' && item.clientId
    ? run.chat?.find((candidate) => candidate.clientUserMessageId === item.clientId && candidate.threadId === threadId)
    : run.chat?.find((candidate) => candidate.itemId === item.id && candidate.threadId === threadId && candidate.turnId === turnId);
  const isMessage = ['agentMessage', 'userMessage', 'plan'].includes(item.type);
  const role = item.type === 'userMessage' ? 'user' : item.type === 'agentMessage' || item.type === 'plan' ? 'assistant' : 'tool';
  const kind = item.type === 'plan' ? 'plan' : isMessage ? 'message' : 'tool';
  const text = item.type === 'userMessage' ? userMessageText(item) : item.text;
  if (!entry) {
    entry = appendChat(run, {
      itemId: item.id,
      clientUserMessageId: item.clientId,
      phase,
      threadId,
      turnId,
      role,
      kind,
      status: final ? 'completed' : 'running',
      text: isMessage ? text : '',
      toolSummary: isMessage ? '' : summarizeToolItem(item),
    });
  } else {
    entry.itemId = item.id;
    entry.turnId = turnId ?? entry.turnId;
  }
  if (final) {
    entry.status = 'completed';
    if (isMessage) entry.text = String(text ?? entry.text).slice(0, 32 * 1024);
    else entry.toolSummary = summarizeToolItem(item).slice(0, 4 * 1024);
    entry.updatedAt = new Date().toISOString();
  }
}

function summarizeToolItem(item) {
  const fields = [];
  if (item.type) fields.push(`type=${String(item.type).slice(0, 80)}`);
  if (item.status) fields.push(`status=${String(item.status).slice(0, 80)}`);
  if (item.command) fields.push(`command=${String(item.command).slice(0, 500)}`);
  if (item.cwd) fields.push(`cwd=${String(item.cwd).slice(0, 500)}`);
  if (Array.isArray(item.changes)) fields.push(`files=${item.changes.length}`);
  if (item.server) fields.push(`server=${String(item.server).slice(0, 100)}`);
  if (item.namespace) fields.push(`namespace=${String(item.namespace).slice(0, 100)}`);
  if (item.tool) fields.push(`tool=${String(item.tool).slice(0, 100)}`);
  if (item.exitCode !== undefined) fields.push(`exitCode=${item.exitCode}`);
  if (item.durationMs !== undefined) fields.push(`durationMs=${item.durationMs}`);
  return fields.join(' ');
}

function summarizeApproval(params = {}) {
  const command = Array.isArray(params.command)
    ? params.command.join(' ').slice(0, 500)
    : String(params.command ?? '').slice(0, 500);
  const cwd = String(params.cwd ?? '').slice(0, 500);
  const reason = String(params.reason ?? '').slice(0, 500);
  const paths = params.fileChanges && typeof params.fileChanges === 'object'
    ? Object.keys(params.fileChanges).slice(0, 8).map((value) => String(value).slice(0, 300))
    : [];
  return [
    command ? `command=${command}` : '',
    cwd ? `cwd=${cwd}` : '',
    reason ? `reason=${reason}` : '',
    paths.length ? `paths=${paths.join(', ')}` : '',
  ].filter(Boolean).join(' ');
}

export function beginChatFollowup(run, phase, clientUserMessageId) {
  const runtime = run.phaseThreads[phase];
  if (!runtime?.threadId) throw new Error(`phase thread is not initialized: ${phase}`);
  if (runtime.chatResume) throw new Error(`chat follow-up is already active: ${phase}`);
  const gateNodeId = run.currentNode;
  runtime.chatResume = {
    status: run.status,
    currentNode: run.currentNode,
    waitingFor: cloneJson(run.waitingFor),
    phaseNodeStatus: node(run, phase).status,
    gateNodeId,
    gateNodeStatus: node(run, gateNodeId).status,
  };
  runtime.activeTurnId = null;
  runtime.chatClientUserMessageId = clientUserMessageId;
  node(run, phase).status = 'running';
  run.currentNode = phase;
  run.status = 'running';
  touch(run);
}

export function restoreChatFollowup(run, phase) {
  const runtime = run.phaseThreads[phase];
  if (!runtime?.chatResume) return;
  const resume = runtime.chatResume;
  runtime.chatResume = null;
  run.status = resume.status;
  run.currentNode = resume.currentNode;
  run.waitingFor = resume.waitingFor;
  node(run, phase).status = resume.phaseNodeStatus;
  node(run, resume.gateNodeId).status = resume.gateNodeStatus;
  runtime.activeTurnId = null;
  runtime.chatClientUserMessageId = null;
  touch(run);
}

function userMessageText(item) {
  return (item.content ?? [])
    .filter((part) => part?.type === 'text')
    .map((part) => part.text)
    .join('\n');
}

function cloneJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function markInterruptedChatEntries(run) {
  const now = new Date().toISOString();
  for (const entry of run.chat ?? []) {
    if (['queued', 'sending', 'sent-unknown', 'streaming', 'running'].includes(entry.status)) {
      entry.status = 'interrupted';
      entry.updatedAt = now;
    }
  }
}

export function buildPrompt(run, phase) {
  const conditions = [
    section('完了条件', run.conditions.completion),
    section('調査条件', run.conditions.investigation),
    section('停止条件', run.conditions.stop),
  ].join('\n\n');

  if (phase === 'planner') {
    return `RimWorld MOD開発の実装契約を作成してください。\n\n目的:\n${run.objective}\n\n${conditions}\n\n編集せず、正本、対象外、手順、検証、完了・調査・停止条件を明示してください。`;
  }
  if (phase === 'worker') {
    return `承認済み計画に従ってRimWorld MOD開発作業を実装・検証してください。\n\n目的:\n${run.objective}\n\n${conditions}\n\n承認済み計画:\n${run.outputs.planner ?? '(計画出力なし)'}`;
  }
  if (phase === 'repair') {
    return `人間が承認した範囲だけを修正してください。\n\n目的:\n${run.objective}\n\n修正範囲:\n${run.repairScope}\n\nレビュー:\n${run.outputs.review ?? '(レビュー出力なし)'}\n\n${conditions}`;
  }
  throw new Error(`unsupported prompt phase: ${phase}`);
}

export function buildGoalObjective(run, phase) {
  const prefix = phase === 'planner'
    ? 'RimWorld MOD開発の実装契約を完成させる'
    : phase === 'repair'
      ? `人間が承認した修正範囲だけを完了する: ${run.repairScope ?? '(範囲未設定)'}`
      : '承認済み計画に従いRimWorld MOD開発実装を完成させる';
  return `${prefix}\n${run.objective}`.slice(0, 4_000);
}

export function node(run, id) {
  const found = run.nodes.find((entry) => entry.id === id);
  if (!found) throw new Error(`unknown node: ${id}`);
  return found;
}

export function normalizeTokenUsage(raw = {}) {
  const total = raw?.total ?? {};
  return {
    total: finite(total.totalTokens),
    input: finite(total.inputTokens),
    cachedInput: finite(total.cachedInputTokens),
    cacheWriteInput: finite(total.cacheWriteInputTokens),
    output: finite(total.outputTokens),
    reasoning: finite(total.reasoningOutputTokens),
    contextWindow: finite(raw?.modelContextWindow),
    raw,
  };
}

function completeTurn(run, params = {}) {
  const turn = params.turn ?? {};
  const phase = phaseForEvent(run, params);
  if (!phase) return;
  const target = node(run, phase);
  const runtime = run.phaseThreads[phase] ?? {};
  const turnId = eventTurnId(params);
  const ignoredIndex = runtime.ignoredChatTerminalTurnIds?.indexOf(turnId) ?? -1;
  if (ignoredIndex >= 0) {
    runtime.ignoredChatTerminalTurnIds.splice(ignoredIndex, 1);
    return;
  }
  runtime.lastTurnStatus = turn.status;
  if (runtime.activeTurnId === turnId) runtime.activeTurnId = null;

  if (runtime.chatResume) {
    if (turn.status === 'interrupted' || turn.status === 'failed' || turn.error) {
      markTurnChatEntries(run, turnId, turn.status === 'interrupted' ? 'interrupted' : 'failed');
    }
    restoreChatFollowup(run, phase);
    return;
  }

  const output = finalAgentText(turn.items) || run.outputs[phase] || '';
  run.outputs[phase] = output;

  if (turn.status === 'interrupted') {
    target.status = 'stopped';
    run.status = 'stopped';
    run.currentNode = phase;
    return;
  }
  if (turn.status === 'failed' || turn.error) {
    target.status = 'failed';
    run.status = 'failed';
    run.currentNode = phase;
    return;
  }

  if (runtime.usesGoal) {
    const goalStatus = run.phaseGoals?.[phase]?.status;
    if (goalStatus !== 'complete') {
      applyTerminalGoalStatus(run, phase, goalStatus);
      return;
    }
  }

  finishAgentPhase(run, phase, output);
}

function finishAgentPhase(run, phase, output) {
  const target = node(run, phase);
  if (target.status !== 'running') return;
  target.status = 'passed';
  if (phase === 'planner') {
    node(run, 'approval-plan').status = 'waiting';
    run.waitingFor = { type: 'human', kind: 'plan' };
    run.currentNode = 'approval-plan';
    run.status = 'waiting-plan-approval';
  } else if (phase === 'worker') {
    node(run, 'validation').status = 'waiting';
    run.currentNode = 'validation';
    run.status = 'waiting-validation';
  } else if (phase === 'review') {
    node(run, 'approval-repair').status = 'waiting';
    run.reviews.push({ text: output, at: new Date().toISOString() });
    run.waitingFor = { type: 'human', kind: 'repair-scope' };
    run.currentNode = 'approval-repair';
    run.status = 'waiting-repair-scope';
  } else if (phase === 'repair') {
    node(run, 'final-validation').status = 'waiting';
    run.currentNode = 'final-validation';
    run.status = 'waiting-final-validation';
  }
}

function captureCompletedItem(run, params = {}) {
  const item = params.item;
  const phase = phaseForEvent(run, params);
  if (!phase || item?.type !== 'agentMessage') return;
  const runtime = run.phaseThreads[phase] ?? {};
  const turnId = eventTurnId(params);
  if (runtime.chatResume
    || runtime.ignoredChatTerminalTurnIds?.includes(turnId)
    || runtime.activeTurnId !== turnId) return;
  run.outputs[phase] = item.text;
}

function markTurnChatEntries(run, turnId, status) {
  const now = new Date().toISOString();
  for (const entry of run.chat ?? []) {
    if (entry.turnId === turnId && ['sending', 'sent-unknown', 'streaming', 'running'].includes(entry.status)) {
      entry.status = status;
      entry.updatedAt = now;
    }
  }
}

function registerStartedTurn(run, params = {}) {
  const phase = phaseForEvent(run, params);
  const turnId = eventTurnId(params);
  if (!phase || !turnId) return;
  run.turnPhases[turnId] = phase;
  run.phaseThreads[phase].activeTurnId = turnId;
}

function updatePhaseGoal(run, params = {}) {
  const goal = params.goal;
  if (!goal) return;
  run.goal = goal;
  const phase = phaseForEvent(run, params);
  if (!phase) return;
  run.phaseGoals ??= {};
  run.phaseGoals[phase] = goal;
  const runtime = run.phaseThreads[phase] ?? {};
  if (goal.status === 'complete' && runtime.lastTurnStatus === 'completed' && !runtime.activeTurnId) {
    finishAgentPhase(run, phase, run.outputs[phase] ?? '');
  } else {
    applyTerminalGoalStatus(run, phase, goal.status);
  }
}

function applyTerminalGoalStatus(run, phase, status) {
  if (!['blocked', 'usageLimited', 'budgetLimited'].includes(status)) return;
  const target = node(run, phase);
  if (target.status !== 'running') return;
  target.status = 'stopped';
  run.currentNode = phase;
  run.status = status === 'blocked' ? 'blocked' : status === 'usageLimited' ? 'usage-limited' : 'budget-limited';
}

function phaseForEvent(run, params = {}) {
  const turnId = eventTurnId(params);
  if (turnId && run.turnPhases[turnId]) return run.turnPhases[turnId];
  const threadId = params.threadId ?? params.thread?.id ?? params.conversationId;
  if (!threadId) return undefined;
  return Object.entries(run.phaseThreads).find(([, runtime]) => runtime?.threadId === threadId)?.[0];
}

function eventTurnId(params = {}) {
  return params.turnId ?? params.turn?.id;
}

function finalAgentText(items = []) {
  return [...items].reverse().find((item) => item?.type === 'agentMessage')?.text ?? '';
}

function requireHumanWaiting(run, kind) {
  if (run.waitingFor?.type !== 'human' || run.waitingFor.kind !== kind) {
    throw new Error(`not waiting for human ${kind} approval`);
  }
}

function section(title, lines) {
  return `${title}:\n${lines.length ? lines.map((line) => `- ${line}`).join('\n') : '- 未指定'}`;
}

function normalizeLines(value) {
  const lines = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/\r?\n/) : [];
  return lines.map((line) => String(line).trim()).filter(Boolean);
}

function emptyTokenUsage() {
  return { total: 0, input: 0, cachedInput: 0, cacheWriteInput: 0, output: 0, reasoning: 0, contextWindow: 0, raw: {} };
}

function aggregateNodeTokens(nodes) {
  const result = emptyTokenUsage();
  const byNode = {};
  for (const entry of nodes) {
    const usage = entry.tokens ?? emptyTokenUsage();
    for (const key of ['total', 'input', 'cachedInput', 'cacheWriteInput', 'output', 'reasoning']) {
      result[key] += finite(usage[key]);
    }
    result.contextWindow = Math.max(result.contextWindow, finite(usage.contextWindow));
    if (usage.total) byNode[entry.id] = usage.raw;
  }
  result.raw = { byNode };
  return result;
}

function finite(value) {
  return Number.isFinite(value) ? value : 0;
}

function appendBounded(array, item, limit) {
  array.push(item);
  if (array.length > limit) array.splice(0, array.length - limit);
}

function summarizeEvent(event) {
  return {
    method: event?.method,
    type: event?.type,
    id: event?.id,
    threadId: event?.params?.threadId,
    turnId: event?.params?.turnId ?? event?.params?.turn?.id,
    emittedAtMs: event?.emittedAtMs,
  };
}

function isKnownTransientEvent(method) {
  return method.includes('/delta')
    || method === 'item/started'
    || method === 'turn/started'
    || method === 'thread/started'
    || method === 'thread/status/changed'
    || method === 'thread/goal/updated'
    || method.startsWith('hook/')
    || method.startsWith('account/')
    || method.startsWith('model/')
    || method.startsWith('server/')
    || method.startsWith('mcpServer/')
    || method.startsWith('remoteControl/');
}

export function isDisplayableProtocolEvent(event) {
  if (event?.type === 'malformed') return true;
  const method = event?.method ?? '';
  return !method.includes('/delta')
    && method !== 'item/started'
    && method !== 'thread/status/changed'
    && !method.startsWith('mcpServer/')
    && !method.startsWith('remoteControl/');
}

function touch(run) {
  run.updatedAt = new Date().toISOString();
}
