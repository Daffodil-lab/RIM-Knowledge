import { approvalRequestText, createTextElement, setText } from './render-utils.mjs';

const byId = (id) => document.getElementById(id);
let sessionToken = sessionStorage.getItem('rim-harness-token');
let context = { repoRoot: '', connected: false, models: [] };
let run = null;
let selectedNodeId = null;
let eventSource = null;
let bannerTimer = null;
let newRunVisible = false;

bootstrapToken();
bindActions();
await loadInitialState();
connectEvents();

function bootstrapToken() {
  if (!sessionToken) {
    const params = new URLSearchParams(location.hash.slice(1));
    const fromHash = params.get('token');
    if (fromHash) {
      sessionToken = fromHash;
      sessionStorage.setItem('rim-harness-token', fromHash);
    }
  }
  if (location.hash) history.replaceState(null, '', `${location.pathname}${location.search}`);
}

async function loadInitialState() {
  try {
    context = await getJson('/api/context');
    run = await getJson('/api/runs/current');
    render();
  } catch (error) {
    showBanner(error.message, true);
  }
}

function bindActions() {
  byId('new-run').addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      objective: byId('objective').value,
      conditions: {
        completion: lines(byId('completion').value),
        investigation: lines(byId('investigation').value),
        stop: lines(byId('stop').value),
      },
    };
    if (byId('budget').value) payload.tokenBudget = Number(byId('budget').value);
    await perform(async () => {
      run = await postJson('/api/runs', payload);
      selectedNodeId = run.currentNode;
      newRunVisible = false;
    });
  });

  byId('new-run-toggle').addEventListener('click', () => {
    newRunVisible = !newRunVisible;
    render();
    if (newRunVisible) byId('objective').focus();
  });

  byId('connect').addEventListener('click', () => perform(async () => {
    const result = await postJson('/api/codex/connect');
    context = { ...context, ...result };
    connectEvents();
  }));
  byId('plan-start').addEventListener('click', () => runAction('plan/start'));
  byId('plan-approve').addEventListener('click', () => runAction('plan/approve'));
  byId('implement-start').addEventListener('click', () => runAction('implement/start'));
  byId('review-start').addEventListener('click', () => runAction('review/start'));
  byId('repair-start').addEventListener('click', () => runAction('repair/start'));
  byId('turn-interrupt').addEventListener('click', () => runAction('turn/interrupt'));

  byId('validation-form').addEventListener('submit', (event) => {
    event.preventDefault();
    runAction('validation/record', {
      outcome: byId('validation-outcome').value,
      evidence: byId('validation-evidence').value,
    });
  });
  byId('final-validation-form').addEventListener('submit', (event) => {
    event.preventDefault();
    runAction('final-validation/record', {
      outcome: byId('final-outcome').value,
      evidence: byId('final-evidence').value,
    });
  });
  byId('repair-approval-form').addEventListener('submit', (event) => {
    event.preventDefault();
    runAction('repair/approve', { scope: byId('repair-scope').value });
  });
  byId('publish-form').addEventListener('submit', (event) => {
    event.preventDefault();
    runAction('publish/record', { evidence: byId('publish-evidence').value });
  });

  for (const decision of ['accept', 'decline', 'cancel']) {
    byId(`approval-${decision}`).addEventListener('click', () => {
      const requestId = run?.waitingFor?.type === 'app-server' ? run.waitingFor.requestId : null;
      runAction('approval/respond', { requestId, decision });
    });
  }

  byId('copy-repo').addEventListener('click', () => perform(async () => {
    await navigator.clipboard.writeText(context.repoRoot || '');
    showBanner('repoパスをコピーしました');
  }));
  byId('inspect-current').addEventListener('click', () => {
    selectedNodeId = run?.currentNode ?? selectedNodeId;
    render();
  });
  byId('overall-validation').addEventListener('click', () => {
    byId('validation-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showBanner('現在の検証ゲートへ移動しました。証拠を入力してください。');
  });
  byId('clear-events').addEventListener('click', () => setText(byId('events'), ''));
}

async function runAction(action, payload = {}) {
  await perform(async () => {
    run = await postJson(`/api/actions/${action}`, payload);
    selectedNodeId = run.currentNode;
    if (['running', 'waiting-app-approval'].includes(run.status)) newRunVisible = false;
  });
}

async function perform(operation) {
  try {
    await operation();
    render();
  } catch (error) {
    showBanner(error.message, true);
  }
}

function connectEvents() {
  if (!sessionToken) {
    showBanner('起動URLのsession tokenがありません。サーバーを再起動してください。', true);
    return;
  }
  eventSource?.close();
  eventSource = new EventSource(`/events?token=${encodeURIComponent(sessionToken)}`);
  eventSource.addEventListener('open', () => {
    context.connected = true;
    renderConnection();
  });
  eventSource.addEventListener('message', (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === 'run') run = payload.run;
      if (payload.type === 'connection') context = { ...context, ...payload };
      if (payload.type === 'stderr') appendEvent(`stderr: ${payload.line}`);
      if (payload.type === 'error') showBanner(payload.message, true);
      if (payload.type === 'event') {
        const summary = eventSummary(payload.event);
        if (summary) appendEvent(summary);
      }
      render();
    } catch (error) {
      showBanner(`event parse error: ${error.message}`, true);
    }
  });
  eventSource.addEventListener('error', () => {
    context.connected = false;
    renderConnection();
    showBanner('Codex event接続が切断されました。再接続を待っています。', true);
  });
}

function render() {
  setText(byId('repo'), context.repoRoot || 'RIM workspace');
  renderConnection();
  setText(byId('tokens'), formatNumber(run?.tokenUsage?.total ?? 0));
  setText(byId('run-status'), run?.status ?? 'run未作成');
  const liveAgent = ['running', 'waiting-app-approval'].includes(run?.status);
  if (liveAgent) newRunVisible = false;
  byId('new-run').hidden = Boolean(run) && !newRunVisible;
  byId('new-run-toggle').disabled = liveAgent;
  setText(byId('new-run-toggle'), newRunVisible ? '新規runを閉じる' : '新規run');

  const graph = byId('graph');
  graph.replaceChildren();
  for (const [index, graphNode] of (run?.nodes ?? []).entries()) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `node status-${graphNode.status}${selectedNodeId === graphNode.id ? ' selected' : ''}`;
    card.dataset.nodeId = graphNode.id;
    card.append(
      createTextElement(document, 'span', 'node-index', String(index + 1).padStart(2, '0')),
      createTextElement(document, 'span', 'node-state', graphNode.status),
      createTextElement(document, 'strong', 'node-label', graphNode.label),
      createTextElement(document, 'span', 'node-meta', [graphNode.role, graphNode.model, graphNode.effort].filter(Boolean).join(' · ')),
      createTextElement(document, 'span', 'node-tokens', `${formatNumber(graphNode.tokens?.total ?? 0)} tok`),
    );
    card.addEventListener('click', () => {
      selectedNodeId = graphNode.id;
      render();
    });
    graph.append(card);
  }

  const selected = run?.nodes?.find((entry) => entry.id === selectedNodeId)
    ?? run?.nodes?.find((entry) => entry.id === run.currentNode)
    ?? run?.nodes?.[0];
  if (selected) selectedNodeId = selected.id;
  setText(byId('selected-id'), selected?.id ?? '—');
  setText(byId('inspector'), selected ? inspectorText(selected) : 'ノードを選択してください');
  renderHumanApproval();
  renderAppApproval();
  renderReviews();
  renderGates();
}

function renderConnection() {
  const element = byId('connection');
  element.className = `chip ${context.connected ? 'chip-online' : 'chip-offline'}`;
  setText(element, context.connected ? 'Codex 接続済み' : 'Codex 未接続');
  byId('connect').disabled = context.connected;
}

function renderHumanApproval() {
  const waiting = run?.waitingFor;
  if (waiting?.type !== 'human') {
    setText(byId('human-approval'), '内部承認待ちはありません');
    byId('human-approval').classList.add('muted');
    return;
  }
  byId('human-approval').classList.remove('muted');
  const message = waiting.kind === 'plan'
    ? `計画出力を確認してから承認してください。\n\n${run.outputs?.planner ?? '(計画出力待ち)'}`
    : `独立レビューを読み、人間が修正範囲を限定してください。\n\n${run.outputs?.review ?? '(レビュー出力待ち)'}`;
  setText(byId('human-approval'), message);
}

function renderAppApproval() {
  const waiting = run?.waitingFor;
  const active = waiting?.type === 'app-server';
  const request = active ? waiting.request ?? {} : {};
  byId('app-approval').classList.toggle('muted', !active);
  setText(byId('app-approval'), active
    ? approvalRequestText(waiting.method, waiting.requestId, request)
    : 'Codexからの権限要求はありません');
  for (const decision of ['accept', 'decline', 'cancel']) byId(`approval-${decision}`).disabled = !active;
}

function renderReviews() {
  const reviews = run?.reviews ?? [];
  setText(byId('review-count'), reviews.length);
  setText(byId('reviews'), reviews.length
    ? reviews.map((review, index) => `#${index + 1} ${review.at}\n${review.text}`).join('\n\n')
    : 'レビューはまだありません');
}

function renderGates() {
  const status = run?.status;
  const waiting = run?.waitingFor;
  const runtime = run?.phaseThreads?.[run?.currentNode];
  byId('plan-start').disabled = !context.connected || nodeStatus('planner') !== 'pending';
  byId('plan-approve').disabled = waiting?.type !== 'human' || waiting.kind !== 'plan';
  byId('implement-start').disabled = status !== 'ready-to-implement';
  byId('validation-form').querySelector('button').disabled = nodeStatus('validation') !== 'waiting';
  byId('review-start').disabled = status !== 'ready-to-review';
  byId('repair-approval-form').querySelector('button').disabled = waiting?.type !== 'human' || waiting.kind !== 'repair-scope';
  byId('repair-start').disabled = status !== 'ready-to-repair';
  byId('turn-interrupt').disabled = !context.connected
    || (status !== 'running' && status !== 'waiting-app-approval' && !runtime?.activeTurnId);
  byId('final-validation-form').querySelector('button').disabled = nodeStatus('final-validation') !== 'waiting';
  byId('publish-form').querySelector('button').disabled = status !== 'ready-to-publish';
}

function inspectorText(selected) {
  const conditionText = [
    `完了条件: ${(run.conditions?.completion ?? []).join(' / ') || '未指定'}`,
    `調査条件: ${(run.conditions?.investigation ?? []).join(' / ') || '未指定'}`,
    `停止条件: ${(run.conditions?.stop ?? []).join(' / ') || '未指定'}`,
  ].join('\n');
  return [
    selected.label,
    `status: ${selected.status}`,
    `role: ${selected.role ?? '-'}`,
    `model: ${selected.model ?? '-'}`,
    `effort: ${selected.effort ?? '-'}`,
    `sandbox: ${selected.sandbox ?? '-'}`,
    `tokens: ${formatNumber(selected.tokens?.total ?? 0)}`,
    '',
    conditionText,
    '',
    `output:\n${run.outputs?.[selected.id] ?? '(なし)'}`,
  ].join('\n');
}

function nodeStatus(id) {
  return run?.nodes?.find((entry) => entry.id === id)?.status;
}

function appendEvent(line) {
  const element = byId('events');
  const linesNow = `${element.textContent}${line}\n`.split('\n').slice(-101);
  setText(element, linesNow.join('\n'));
  element.scrollTop = element.scrollHeight;
}

function showBanner(message, isError = false) {
  clearTimeout(bannerTimer);
  const element = byId('banner');
  setText(element, message);
  element.classList.toggle('banner-error', isError);
  element.hidden = false;
  bannerTimer = setTimeout(() => { element.hidden = true; }, 6000);
}

async function getJson(path) {
  const response = await fetch(path, { headers: { Accept: 'application/json' } });
  return parseResponse(response);
}

async function postJson(path, body = {}) {
  if (!sessionToken) throw new Error('session tokenがありません');
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Rim-Harness-Token': sessionToken,
    },
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

async function parseResponse(response) {
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message ?? `HTTP ${response.status}`);
  return payload;
}

function lines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function eventSummary(event) {
  if (event?.type === 'malformed') return `malformed: ${truncate(event.raw, 500)}`;
  if (event?.method?.includes('/delta')) return null;
  const item = event?.params?.item;
  return JSON.stringify({
    method: event?.method,
    id: event?.id,
    threadId: event?.params?.threadId,
    turnId: event?.params?.turnId ?? event?.params?.turn?.id,
    item: item ? {
      type: item.type,
      status: item.status,
      command: truncate(item.command, 300),
      text: truncate(item.text, 500),
      exitCode: item.exitCode,
    } : undefined,
  });
}

function truncate(value, limit) {
  if (value == null) return undefined;
  const text = String(value);
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
}

function formatNumber(value) {
  return new Intl.NumberFormat('ja-JP').format(Number(value) || 0);
}
