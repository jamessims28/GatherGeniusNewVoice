
export function runOperationsCommandRouter({ request = "", reliability = {}, enterprise = {} } = {}) {
  const t = String(request).toLowerCase();
  const commands = [];

  if (/incident|error|bug|down|failure|broken|crash/.test(t) || reliability.reliabilityStatus === "watch") {
    commands.push(command("incident_response", "Prepare incident response workflow."));
  }

  if (/deploy|release|launch|production/.test(t)) {
    commands.push(command("deployment_control", "Route to launch readiness and rollout controls."));
  }

  if (/vendor|marketplace|payment|approval/.test(t)) {
    commands.push(command("business_operations", "Route to approval, vendor, and monetization operations."));
  }

  if (/scale|growth|users|traffic|enterprise/.test(t)) {
    commands.push(command("scale_operations", "Route to enterprise scale monitoring and growth operations."));
  }

  if (!commands.length) {
    commands.push(command("quiet_background_ops", "Monitor operations quietly and prepare one safest next step."));
  }

  return {
    layer: "operations_command_router",
    mode: process.env.OPERATIONS_COMMAND_MODE || "shadow",
    commands,
    primaryCommand: commands[0]?.id,
    createdAt: new Date().toISOString()
  };
}

function command(id, purpose) {
  return {
    id,
    purpose,
    status: "prepared",
    reviewRequired: true
  };
}
