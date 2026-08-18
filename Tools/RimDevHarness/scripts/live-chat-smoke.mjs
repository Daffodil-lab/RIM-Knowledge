import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppServerClient } from '../lib/app-server-client.mjs';

const harnessRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(harnessRoot, '..', '..');
const client = new AppServerClient({ cwd: repoRoot }).start();
let approvalRequested = false;
client.on('approval', (event) => {
  approvalRequested = true;
  client.answerApproval(event.id, { decision: 'decline' });
});

try {
  const initialized = await client.initialize();
  const catalog = await client.request('model/list', { limit: 100, includeHidden: true });
  const model = catalog?.data?.find((entry) => entry.model === 'gpt-5.6-luna' || entry.id === 'gpt-5.6-luna');
  if (!model) throw new Error('required model is unavailable: gpt-5.6-luna');

  const started = await client.request('thread/start', {
    cwd: repoRoot,
    model: 'gpt-5.6-luna',
    sandbox: 'read-only',
    approvalPolicy: 'on-request',
    config: { model_reasoning_effort: 'medium' },
    developerInstructions: 'Protocol chat smoke only. Never inspect or edit files and never call tools. Reply with only the requested marker.',
    serviceName: 'rim-dev-harness-live-chat-smoke',
  });
  const threadId = started?.thread?.id;
  if (!threadId) throw new Error('thread/start did not return thread.id');

  const first = await runMessage(threadId, 'Reply with exactly RIM_CHAT_READY');
  const second = await runMessage(threadId, 'Reply with exactly RIM_CHAT_FOLLOWUP');
  if (approvalRequested) throw new Error('unexpected approval request during read-only chat smoke');
  if (!first.text.includes('RIM_CHAT_READY')) throw new Error(`unexpected first response: ${first.text}`);
  if (!second.text.includes('RIM_CHAT_FOLLOWUP')) throw new Error(`unexpected follow-up response: ${second.text}`);
  if (!first.sawDelta || !second.sawDelta) throw new Error('agent message delta was not observed for both chat turns');

  process.stdout.write(`${JSON.stringify({
    ok: true,
    userAgent: initialized?.userAgent,
    threadId,
    sameThread: first.threadId === second.threadId,
    first: { turnId: first.turnId, sawDelta: first.sawDelta, marker: 'RIM_CHAT_READY' },
    followup: { turnId: second.turnId, sawDelta: second.sawDelta, marker: 'RIM_CHAT_FOLLOWUP' },
  })}\n`);
} finally {
  await client.stop();
}

async function runMessage(threadId, text) {
  const result = await client.request('turn/start', {
    threadId,
    clientUserMessageId: `live-chat-${crypto.randomUUID()}`,
    model: 'gpt-5.6-luna',
    effort: 'medium',
    input: [{ type: 'text', text, text_elements: [] }],
  });
  const turnId = result?.turn?.id;
  if (!turnId) throw new Error('turn/start did not return turn.id');
  const completed = await waitForEvent(
    client,
    (event) => event.method === 'turn/completed'
      && event.params?.threadId === threadId
      && event.params?.turn?.id === turnId,
    90_000,
  );
  const textOutput = (completed.params?.turn?.items ?? [])
    .filter((item) => item.type === 'agentMessage')
    .map((item) => item.text ?? '')
    .join('\n');
  const sawDelta = client.events.some((event) => event.method === 'item/agentMessage/delta'
    && event.params?.threadId === threadId
    && event.params?.turnId === turnId);
  return { threadId, turnId, text: textOutput, sawDelta };
}

function waitForEvent(appServer, predicate, timeoutMs) {
  const existing = appServer.events.find(predicate);
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      appServer.off('event', onEvent);
      reject(new Error(`timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    const onEvent = (event) => {
      if (!predicate(event)) return;
      clearTimeout(timer);
      appServer.off('event', onEvent);
      resolve(event);
    };
    appServer.on('event', onEvent);
  });
}
