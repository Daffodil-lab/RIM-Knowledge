export function setText(element, value) {
  element.textContent = value == null ? '' : String(value);
  return element;
}

export function approvalRequestText(method, requestId, request = {}) {
  const fileChanges = request.fileChanges && typeof request.fileChanges === 'object'
    ? Object.entries(request.fileChanges).map(([file, change]) => {
        const move = change?.move_path ? ` -> ${change.move_path}` : '';
        return `${file}: ${change?.type ?? 'change'}${move}`;
      })
    : [];
  const details = [
    `method: ${method ?? '-'}`,
    `requestId: ${requestId ?? '-'}`,
    `itemId: ${request.itemId ?? '-'}`,
    `threadId: ${request.threadId ?? request.conversationId ?? '-'}`,
    `turnId: ${request.turnId ?? '-'}`,
    `command: ${formatValue(request.command)}`,
    `cwd: ${request.cwd ?? '-'}`,
    `reason: ${request.reason ?? '-'}`,
    `grantRoot: ${request.grantRoot ?? '-'}`,
    `availableDecisions: ${formatValue(request.availableDecisions)}`,
    `additionalPermissions: ${formatValue(request.additionalPermissions)}`,
    `exec policy: ${formatValue(request.proposedExecpolicyAmendment)}`,
    `network policy: ${formatValue(request.proposedNetworkPolicyAmendments)}`,
  ];
  if (fileChanges.length) details.push(`file changes:\n${fileChanges.join('\n')}`);
  return details.join('\n');
}

export function createTextElement(documentRef, tagName, className, value) {
  const element = documentRef.createElement(tagName);
  if (className) element.className = className;
  return setText(element, value);
}

export function chatAvailability(run, connected) {
  if (!connected) return { enabled: false, phase: null, message: 'Codexへの接続を待っています' };
  if (!run) return { enabled: false, phase: null, message: '開発runを作成してください' };
  if (run.waitingFor?.type === 'app-server') {
    return { enabled: false, phase: null, message: 'Codexの権限要求へ先に回答してください' };
  }
  const phase = chatPhase(run);
  const runtime = phase ? run.phaseThreads?.[phase] : null;
  if (!runtime?.threadId) return { enabled: false, phase, message: 'この段階には会話threadがありません' };
  if (phase === 'review' && runtime.activeTurnId) {
    return { enabled: false, phase, message: '独立レビュー実行中は追加入力できません' };
  }
  if (runtime.activeTurnId) return { enabled: true, phase, message: `${phase}の実行中turnへ追記できます` };
  if (run.phaseGoals?.[phase]?.status === 'active') {
    return { enabled: false, phase, message: 'goalの次turn開始を待っています' };
  }
  return { enabled: true, phase, message: `${phase}の同一threadで質問できます` };
}

export function chatEntryHeading(entry = {}) {
  const role = entry.role === 'assistant'
    ? 'Codex'
    : entry.role === 'tool'
      ? 'Tool'
      : entry.role === 'system'
        ? 'Harness'
        : 'あなた';
  return [role, entry.phase, entry.status].filter(Boolean).join(' · ');
}

function chatPhase(run) {
  if (['planner', 'worker', 'review', 'repair'].includes(run.currentNode)) return run.currentNode;
  return {
    'approval-plan': 'planner',
    validation: 'worker',
    'approval-repair': 'review',
    'final-validation': 'repair',
  }[run.currentNode] ?? null;
}

function formatValue(value) {
  if (value == null) return '-';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return text.length > 1_000 ? `${text.slice(0, 1_000)}…` : text;
}
