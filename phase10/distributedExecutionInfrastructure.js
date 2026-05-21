
const protectedTypes = ["payment", "booking", "contract", "external_message", "personal_data_release", "autonomous_purchase"];

export function runDistributedExecutionInfrastructure({ optimizations = [], permissions = {} } = {}) {
  const actions = optimizations.map(opt => {
    const type =
      opt.type.includes("financial") ? "payment" :
      opt.type.includes("vendor") ? "external_message" :
      opt.type.includes("schedule") ? "calendar_invite" :
      "internal_preparation";

    const protectedAction = protectedTypes.includes(type) || type === "calendar_invite";
    const approved = !protectedAction || permissions[type];

    return {
      id: `fabric_action_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      type,
      label: opt.recommendation,
      status: approved ? "prepared" : "requires_confirmation",
      protectedAction,
      createdAt: new Date().toISOString()
    };
  });

  return {
    layer: "distributed_execution_infrastructure",
    actions,
    protectedCount: actions.filter(a => a.protectedAction).length,
    readyCount: actions.filter(a => a.status === "prepared").length,
    executionMode: "protected_autonomous_preparation"
  };
}
