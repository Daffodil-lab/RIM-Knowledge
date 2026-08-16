import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AppServerClient } from '../lib/app-server-client.mjs';

const harnessRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(harnessRoot, '..', '..');
const client = new AppServerClient({ cwd: repoRoot }).start();

try {
  const initialized = await client.initialize();
  const catalog = await client.request('model/list', { limit: 100, includeHidden: true });
  if (!catalog?.data?.some((entry) => entry.model === 'gpt-5.6-sol' || entry.id === 'gpt-5.6-sol')) {
    throw new Error('required model is unavailable: gpt-5.6-sol');
  }

  const started = await client.request('thread/start', {
    cwd: repoRoot,
    model: 'gpt-5.6-sol',
    sandbox: 'read-only',
    approvalPolicy: 'on-request',
    config: { model_reasoning_effort: 'high' },
    developerInstructions: 'Protocol smoke only. Do not edit files. Return a concise review result.',
    serviceName: 'rim-dev-harness-live-review-smoke',
  });
  const threadId = started?.thread?.id;
  if (!threadId) throw new Error('thread/start did not return thread.id');

  const review = await client.request('review/start', {
    threadId,
    target: { type: 'uncommittedChanges' },
    delivery: 'inline',
  });
  const reviewThreadId = review?.reviewThreadId ?? threadId;
  const streamedStart = await waitForEvent(
    client,
    (event) => event.method === 'turn/started' && event.params?.threadId === reviewThreadId,
    10_000,
  );
  const turnId = streamedStart.params?.turn?.id ?? review?.turn?.id;
  if (!turnId) throw new Error('review/start did not produce a turn id');

  await client.request('turn/interrupt', { threadId: reviewThreadId, turnId });
  const completed = await waitForEvent(
    client,
    (event) => event.method === 'turn/completed'
      && event.params?.threadId === reviewThreadId
      && event.params?.turn?.id === turnId,
    10_000,
  );

  process.stdout.write(`${JSON.stringify({
    ok: true,
    userAgent: initialized?.userAgent,
    method: 'review/start',
    delivery: 'inline',
    target: 'uncommittedChanges',
    status: completed.params.turn.status,
  })}\n`);
} finally {
  await client.stop();
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
