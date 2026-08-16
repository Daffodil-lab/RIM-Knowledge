import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { AppServerClient } from '../lib/app-server-client.mjs';
import { RunStore, assertInsideRepo } from '../lib/run-store.mjs';

const fixture = fileURLToPath(new URL('./fixtures/fake-app-server.mjs', import.meta.url));

test('real fake child covers handshake, token events, unknown input, malformed input, and explicit approval', async () => {
  const client = new AppServerClient({ command: process.execPath, args: [fixture] }).start();
  try {
    const initialized = await client.initialize();
    assert.equal(initialized.userAgent, 'fake-app-server/0.1');
    const models = await client.request('model/list', { limit: 100 });
    assert.deepEqual(models.data.map((entry) => entry.model), ['gpt-5.6-sol', 'gpt-5.6-luna']);

    client.notify('emit-token');
    client.notify('emit-unknown');
    client.notify('emit-malformed');
    client.notify('emit-approval');
    await waitFor(() => client.events.some((event) => event.id === 77));

    const tokenEvent = client.events.find((event) => event.method === 'thread/tokenUsage/updated');
    assert.equal(tokenEvent.params.tokenUsage.total.totalTokens, 110);
    assert.ok(client.events.some((event) => event.method === 'future/newEvent'));
    assert.ok(client.events.some((event) => event.type === 'malformed'));

    client.answerApproval(77, { decision: 'accept' });
    await waitFor(() => client.events.some((event) => event.method === 'approval/answered'));
    assert.equal(client.events.find((event) => event.method === 'approval/answered').params.decision, 'accept');
  } finally {
    await client.stop();
  }
});

test('child exit rejects pending requests and leaves the client stoppable', async () => {
  const client = new AppServerClient({ command: process.execPath, args: [fixture] }).start();
  await client.initialize();
  const pending = client.request('never', {}, 10_000);
  await client.stop();
  await assert.rejects(pending, /app-server exited/);
  assert.equal(client.child, null);
});

test('an exited app-server child can be started and initialized again', async () => {
  const client = new AppServerClient({ command: process.execPath, args: [fixture] }).start();
  try {
    await client.initialize();
    client.notify('exit-now');
    await waitFor(() => client.child === null);
    const initialized = await client.start().initialize();
    assert.equal(initialized.userAgent, 'fake-app-server/0.1');
    assert.equal(client.initialized, true);
  } finally {
    await client.stop();
  }
});

test('run store writes atomically inside the repository and restores current state', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'rim-harness-store-'));
  const store = new RunStore(root);
  const file = await store.save('run-1', { id: 'run-1', ok: true });
  assert.match(file, /\.git-sync[\\/]harness/);
  assert.deepEqual(await store.load('run-1'), { id: 'run-1', ok: true });
  assert.deepEqual(await store.loadCurrent(), { id: 'run-1', ok: true });
  assert.throws(() => assertInsideRepo(root, path.join(root, '..', 'outside')), /outside repository/);
  await assert.rejects(() => store.save('../bad', {}), /invalid run id/);
});

test('run store serializes concurrent Windows-style replacements without leaving temp files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'rim-harness-concurrent-'));
  const store = new RunStore(root);
  await Promise.all(Array.from({ length: 20 }, (_, index) => store.save('run-queue', { id: 'run-queue', index })));
  assert.equal((await store.load('run-queue')).index, 19);
  const files = await readdir(store.dir);
  assert.equal(files.some((file) => file.endsWith('.tmp') || file.endsWith('.bak')), false);
});

async function waitFor(predicate, timeoutMs = 2_000) {
  const started = Date.now();
  while (!predicate()) {
    if (Date.now() - started > timeoutMs) throw new Error('timed out waiting for fixture event');
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
