
import { runEnterpriseMultiTenantCore } from "../phase15/enterpriseMultiTenantCore";
import { runLaunchReadinessEngine } from "./launchReadinessEngine";
import { runReliabilityMonitor } from "./reliabilityMonitor";
import { runRollbackRecoveryEngine } from "./rollbackRecoveryEngine";
import { runProgressiveRolloutEngine } from "./progressiveRolloutEngine";

export async function runProductionLaunchReliabilityCore({
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
  const enterprise = await runEnterpriseMultiTenantCore({
    request,
    tenantId,
    userKey,
    role,
    seats,
    memory,
    location,
    permissions
  });

  const readiness = runLaunchReadinessEngine({
    request,
    tenant: enterprise.tenant
  });

  const reliability = runReliabilityMonitor({
    metrics,
    readiness
  });

  const rollback = runRollbackRecoveryEngine({
    reliability,
    deployment: { stage: readiness.stage }
  });

  const rollout = runProgressiveRolloutEngine({
    readiness,
    reliability,
    tenant: enterprise.tenant
  });

  return {
    ok: true,
    layer: "production_launch_reliability_core",
    name: "GatherGenius Production Launch & Reliability Core",
    backgroundOnly: true,
    enterprise,
    readiness,
    reliability,
    rollback,
    rollout,
    response: buildResponse({ readiness, reliability, rollback, rollout }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ readiness, reliability, rollback, rollout }) {
  if (rollback.rollbackRequired) {
    return "Production reliability detected an issue. Rollback is recommended for review.";
  }

  if (rollout.publicLaunchAllowed) {
    return `Production launch reliability is healthy. Public launch is ready for review with ${readiness.readinessScore}% readiness.`;
  }

  return `Production reliability is active in the background. Current rollout gate: ${rollout.currentGate}. Readiness: ${readiness.readinessScore}%.`;
}
