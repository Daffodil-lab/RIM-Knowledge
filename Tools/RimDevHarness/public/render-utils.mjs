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

function formatValue(value) {
  if (value == null) return '-';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return text.length > 1_000 ? `${text.slice(0, 1_000)}…` : text;
}
