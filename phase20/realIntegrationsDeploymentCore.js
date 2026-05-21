
import { runAdaptiveMemorySecurityCore } from "../phase19/adaptiveMemorySecurityCore";
import { runIntegrationReadinessMatrix } from "./integrationReadinessMatrix";
import { runDeploymentWiringEngine } from "./deploymentWiringEngine";
import { runLiveConnectorRouter } from "./liveConnectorRouter";

export async function runRealIntegrationsDeploymentCore({
  request = "",
  tenantId = "default",
  userKey = "anonymous_preview",
  role = "admin",
  memory = {},
  permissions = {},
  metrics = {}
} = {}) {
  const security = await runAdaptiveMemorySecurityCore({
    request,
    tenantId,
    userKey,
    role,
    memory,
    permissions,
    metrics
  });

  const integrations = runIntegrationReadinessMatrix();
  const deployment = runDeploymentWiringEngine({ integrations, tenantId });
  const connectors = runLiveConnectorRouter({ request, integrations });

  return {
    ok: true,
    layer: "real_integrations_deployment_core",
    name: "GatherGenius Real Integrations & Deployment Wiring Core",
    backgroundOnly: true,
    security,
    integrations,
    deployment,
    connectors,
    response: buildResponse({ integrations, deployment, connectors }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ integrations, deployment, connectors }) {
  return `Real integration wiring is prepared in the background. Integration readiness: ${integrations.readinessScore}%. Deployment status: ${deployment.status}.`;
}
