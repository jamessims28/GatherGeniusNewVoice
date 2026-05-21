
const protectedTypes = ["payment","booking","contract","external_message","calendar_invite","sensitive_data_access"];

export function runAutonomousRealityExecution({ request = "", predictions = [], agents = [], permissions = {} } = {}) {
  const queue = [];

  queue.push(buildItem("internal_preparation", "Prepare protected operating plan", false, { request }));

  if (predictions.length) {
    queue.push(buildItem("internal_preparation", "Prepare backup path", false, { predictions }));
  }

  if (/vendor|dj|food|catering|tent|chairs|tables|hotel|venue|provider/i.test(request)) {
    queue.push(buildItem("external_message", "Prepare vendor outreach", true, { request }));
  }

  if (/payment|deposit|pay|stripe|invoice/i.test(request)) {
    queue.push(buildItem("payment", "Prepare payment workflow", true, { request }));
  }

  return {
    layer: "autonomous_reality_execution",
    queue: queue.map(item => {
      const requiresConfirmation = protectedTypes.includes(item.type) || item.external;
      const approved = !requiresConfirmation || permissions[item.type];
      return {
        ...item,
        requiresConfirmation,
        status: approved ? "prepared" : "awaiting_confirmation",
        message: approved ? "Prepared safely." : "Prepared in background. Confirmation required before execution."
      };
    })
  };
}

function buildItem(type, label, external, data) {
  return {
    id: `reality_action_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    label,
    external,
    data,
    createdAt: new Date().toISOString()
  };
}
