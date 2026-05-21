
import { runProductionLaunchReliabilityCore } from "../phase16/productionLaunchReliabilityCore";
import { runOperationsCommandRouter } from "./operationsCommandRouter";
import { runIncidentResponseEngine } from "./incidentResponseEngine";
import { runOpsEscalationEngine } from "./opsEscalationEngine";
import { updateOperationalMemoryLedger } from "./operationalMemoryLedger";

export async function runAutonomousOperationsCommandCore({
  request = "",
  tenantId = "default",
  userKey = "anonymous_preview",
  role = "admin",
  seats = 1,
  memory = {},
  location = "Virginia",
  permissions = {},
  metrics = {}
} = {}) {
  const reliabilityCore = await runProductionLaunchReliabilityCore({
    request,
    tenantId,
    userKey,
    role,
    seats,
    memory,
    location,
    permissions,
    metrics
  });

  const command = runOperationsCommandRouter({
    request,
    reliability: reliabilityCore.reliability,
    enterprise: reliabilityCore.enterprise
  });

  const incident = runIncidentResponseEngine({
    commands: command.commands,
    reliability: reliabilityCore.reliability,
    request
  });

  const escalation = runOpsEscalationEngine({
    incident,
    tenant: reliabilityCore.enterprise?.tenant,
    role
  });

  const ledger = updateOperationalMemoryLedger({
    memory,
    command,
    incident,
    escalation
  });

  return {
    ok: true,
    layer: "autonomous_operations_command_core",
    name: "GatherGenius Autonomous Operations Command Core",
    backgroundOnly: true,
    reliabilityCore,
    command,
    incident,
    escalation,
    ledger,
    response: buildResponse({ command, incident, escalation }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ command, incident, escalation }) {
  if (incident.severity === "high") {
    return "Autonomous operations detected a high-severity condition. Incident response is prepared for review.";
  }

  if (escalation.escalationRequired) {
    return `Operations command routed to ${command.primaryCommand}. Escalation is prepared for review.`;
  }

  return `Operations command core is active in the background. Primary route: ${command.primaryCommand}.`;
}
