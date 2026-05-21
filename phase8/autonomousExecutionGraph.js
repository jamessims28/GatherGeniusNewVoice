
const confirmationRequired = ["payment", "booking", "external_message", "contract", "legal", "calendar_invite"];

export function buildAutonomousExecutionGraph({ request = "", agents = [], world = {}, permissions = {} } = {}) {
  const nodes = [
    node("observe", "Collect reality, human, and system state", "internal"),
    node("plan", "Build protected operating plan", "internal"),
    node("predict", "Predict risks and dependencies", "internal"),
    node("prepare", "Prepare recommended actions", "internal")
  ];

  const t = String(request).toLowerCase();
  if (/vendor|dj|catering|food|venue/.test(t)) nodes.push(node("vendor_outreach", "Prepare vendor coordination", "external_message"));
  if (/calendar|schedule|date|time/.test(t)) nodes.push(node("calendar_hold", "Prepare calendar hold", "calendar_invite"));
  if (/payment|deposit|pay|stripe|invoice/.test(t)) nodes.push(node("payment_path", "Prepare payment workflow", "payment"));
  if (/contract|agreement|terms|legal/.test(t)) nodes.push(node("legal_review", "Prepare legal review", "legal"));

  const evaluated = nodes.map((item) => {
    const needsConfirmation = confirmationRequired.includes(item.actionType);
    return {
      ...item,
      status: needsConfirmation && !permissions[item.actionType] ? "awaiting_confirmation" : "ready",
      canExecute: !needsConfirmation || Boolean(permissions[item.actionType])
    };
  });

  return {
    layer: "autonomous_execution_graph",
    nodes: evaluated,
    edges: evaluated.slice(1).map((item, index) => ({ from: evaluated[index].id, to: item.id })),
    executionMode: "permission_controlled"
  };
}

function node(id, label, actionType) {
  return { id, label, actionType, createdAt: new Date().toISOString() };
}
