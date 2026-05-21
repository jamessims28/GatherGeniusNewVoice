
export function runTrustArchitectureLayer({ execution = {}, permissions = {} } = {}) {
  const protectedActions = ["payment","booking","contract","external_message","calendar_invite","sensitive_data_access"];
  const queue = execution.queue || [];

  const evaluated = queue.map(item => {
    const protectedAction = protectedActions.includes(item.type) || item.external;
    const allowed = !protectedAction || Boolean(permissions[item.type]);
    return {
      ...item,
      trustStatus: allowed ? "allowed" : "confirmation_required",
      trustMessage: allowed ? "Safe to prepare." : "Requires explicit confirmation before execution."
    };
  });

  return {
    layer: "trust_architecture_layer",
    protectedActionTypes: protectedActions,
    evaluated,
    safeAutomationCount: evaluated.filter(x => x.trustStatus === "allowed").length,
    confirmationRequiredCount: evaluated.filter(x => x.trustStatus === "confirmation_required").length,
    trustMode: "permission_first"
  };
}
