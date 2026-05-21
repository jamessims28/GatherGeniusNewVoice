
export function createAutonomousSafeExecutionLoop({ onDecision, onBlocked } = {}) {
  let stopped = false;
  const queue = [];

  function enqueue(action) {
    queue.push({
      ...action,
      createdAt: new Date().toISOString(),
      status: "queued"
    });
  }

  function canExecute(action) {
    if (action.requiresPermission && !action.permissionGranted) {
      return { ok: false, reason: "permission_required" };
    }

    if (action.riskLevel === "high") {
      return { ok: false, reason: "high_risk_requires_confirmation" };
    }

    if (action.type === "payment" || action.type === "booking" || action.type === "external_message") {
      return { ok: false, reason: "external_action_requires_confirmation" };
    }

    return { ok: true, reason: "safe_to_execute" };
  }

  async function runOnce() {
    if (stopped || !queue.length) return;

    const action = queue.shift();
    const safety = canExecute(action);

    if (!safety.ok) {
      action.status = "blocked";
      action.blockedReason = safety.reason;
      onBlocked?.(action);
      return;
    }

    action.status = "executed";
    action.executedAt = new Date().toISOString();
    onDecision?.(action);
  }

  const interval = setInterval(runOnce, 1200);

  return {
    enqueue,
    runOnce,
    stop() {
      stopped = true;
      clearInterval(interval);
    },
    snapshot() {
      return [...queue];
    }
  };
}
