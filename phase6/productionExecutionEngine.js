
import { queueApproval, needsApproval } from "./approvalWorkflow";

export async function runProductionExecutionEngine({ userKey = "anonymous_preview", actions = [], permissions = {} } = {}) {
  const results = [];

  for (const action of actions) {
    const approvalNeeded = needsApproval(action);
    const permissionGranted = Boolean(permissions[action.type]) || Boolean(action.permissionGranted);

    if (approvalNeeded && !permissionGranted) {
      results.push(await queueApproval({ userKey, action }));
      continue;
    }

    results.push({
      id: action.id || `executed_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      user_key: userKey,
      action_type: action.type || "internal_preparation",
      label: action.label || "Prepared action",
      status: action.type === "internal_preparation" ? "auto_prepared" : "approved_ready",
      action_data: action,
      reason: "Prepared by Production Autonomy Core.",
      created_at: new Date().toISOString()
    });
  }

  return {
    layer: "production_execution_engine",
    results,
    prepared: results.filter((item) => item.status === "auto_prepared" || item.status === "approved_ready").length,
    needsApproval: results.filter((item) => item.status === "needs_approval").length
  };
}
