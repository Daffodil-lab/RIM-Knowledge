import readline from 'node:readline';

let threadIndex = 0;
let turnIndex = 0;
const reader = readline.createInterface({ input: process.stdin });

reader.on('line', (line) => {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    return;
  }

  if (message.id === 77 && message.result) {
    notify('approval/answered', { decision: message.result.decision });
    return;
  }
  if (message.id !== undefined) {
    handleRequest(message);
    return;
  }
  handleNotification(message);
});

function handleRequest(message) {
  const { id, method, params = {} } = message;
  if (method === 'initialize') return reply(id, { userAgent: 'fake-app-server/0.1' });
  if (method === 'model/list') return reply(id, { data: modelCatalog() });
  if (method === 'thread/start') return reply(id, { thread: { id: `thread-${++threadIndex}` }, model: params.model });
  if (method === 'thread/goal/set') {
    return reply(id, { goal: { threadId: params.threadId, objective: params.objective, tokenBudget: params.tokenBudget, tokensUsed: 0 } });
  }
  if (method === 'thread/goal/get') return reply(id, { goal: { threadId: params.threadId, tokenBudget: null, tokensUsed: 42 } });
  if (method === 'turn/start') return reply(id, { turn: { id: `turn-${++turnIndex}`, status: 'inProgress', items: [] } });
  if (method === 'review/start') return reply(id, { reviewThreadId: params.threadId, turn: { id: `turn-${++turnIndex}`, status: 'inProgress', items: [] } });
  if (method === 'never') return;
  reply(id, { ok: true });
}

function handleNotification(message) {
  if (message.method === 'exit-now') process.exit(17);
  if (message.method === 'emit-token') {
    notify('thread/tokenUsage/updated', {
      threadId: 'thread-1',
      turnId: 'turn-1',
      tokenUsage: {
        total: { inputTokens: 80, cachedInputTokens: 20, outputTokens: 30, reasoningOutputTokens: 10, totalTokens: 110 },
        last: { inputTokens: 8, cachedInputTokens: 2, outputTokens: 3, reasoningOutputTokens: 1, totalTokens: 11 },
        modelContextWindow: 200000,
      },
    });
  }
  if (message.method === 'emit-unknown') notify('future/newEvent', { value: 1 });
  if (message.method === 'emit-malformed') process.stdout.write('{bad json\n');
  if (message.method === 'emit-approval') {
    process.stdout.write(`${JSON.stringify({
      id: 77,
      method: 'item/commandExecution/requestApproval',
      params: { command: 'git status', cwd: process.cwd(), reason: 'test', threadId: 'thread-1', turnId: 'turn-1', itemId: 'item-1', startedAtMs: Date.now() },
    })}\n`);
  }
}

function modelCatalog() {
  return ['gpt-5.6-sol', 'gpt-5.6-luna'].map((model) => ({
    id: model,
    model,
    displayName: model,
    defaultReasoningEffort: model.endsWith('sol') ? 'high' : 'medium',
    supportedReasoningEfforts: [{ reasoningEffort: 'medium' }, { reasoningEffort: 'high' }],
    hidden: false,
    isDefault: false,
    description: 'fake',
  }));
}

function reply(id, result) {
  process.stdout.write(`${JSON.stringify({ id, result })}\n`);
}

function notify(method, params) {
  process.stdout.write(`${JSON.stringify({ method, params })}\n`);
}
