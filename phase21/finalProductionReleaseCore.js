
import { runRealIntegrationsDeploymentCore } from "../phase20/realIntegrationsDeploymentCore";
import { runInvestorLaunchMetricsEngine } from "./investorLaunchMetricsEngine";
import { runFinalReleaseChecklistEngine } from "./finalReleaseChecklistEngine";

export async function runFinalProductionReleaseCore({
  request = "",
  tenantId = "default",
  userKey = "anonymous_preview",
  role = "admin",
  memory = {},
  permissions = {},
  metrics = {}
} = {}) {
  const integration = await runRealIntegrationsDeploymentCore({
    request,
    tenantId,
    userKey,
    role,
    memory,
    permissions,
    metrics
  });

  const investor = runInvestorLaunchMetricsEngine({
    integration,
    request
  });

  const release = runFinalReleaseChecklistEngine({
    integration,
    investor
  });

  return {
    ok: true,
    layer: "final_production_release_core",
    name: "GatherGenius Investor Launch Package & Final Production Release",
    backgroundOnly: true,
    integration,
    investor,
    release,
    response: buildResponse({ investor, release }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ investor, release }) {
  return `Final production release package is prepared in the background. Release status: ${release.status}. Investor readiness: ${investor.investorReadinessScore}%.`;
}
