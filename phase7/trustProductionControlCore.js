
import { resolveRole, requirePermission } from "./roleAccessControl";
import { protectApiRequest } from "./securityHardening";
import { writeAuditEvent } from "./auditTrail";
import { listApprovals } from "./approvalControlCenter";
import { getStripeReadiness } from "./stripeReadiness";
import { getInvestorMetrics } from "./investorMetrics";
import { getIntegrationRegistry, summarizeIntegrations } from "../phase6/integrationRegistry";

export async function runTrustProductionControlCore({
  userKey = "anonymous_preview",
  email = "",
  requestedRole = "admin",
  request = ""
} = {}) {
  const role = resolveRole({ email, requestedRole });
  const access = requirePermission({ role, permission: "observability:view" });
  const protection = protectApiRequest({ payload: { request }, userKey });

  await writeAuditEvent({
    userKey,
    actorRole: role,
    action: "phase7_control_core_access",
    resource: "trust_production_control_core",
    status: access.allowed && protection.allowed ? "allowed" : "blocked",
    reason: access.message,
    metadata: { access, protection }
  });

  if (!access.allowed || !protection.allowed) {
    return {
      ok: false,
      layer: "trust_production_control_core",
      role,
      access,
      protection,
      response: "Access blocked by trust and production controls."
    };
  }

  const registry = getIntegrationRegistry();
  const approvalQueue = await listApprovals({ userKey });
  const stripe = getStripeReadiness();
  const metrics = await getInvestorMetrics({ userKey });

  return {
    ok: true,
    layer: "trust_production_control_core",
    name: "GatherGenius Trust & Production Control Core",
    role,
    access,
    protection,
    integrations: registry,
    integrationSummary: summarizeIntegrations(registry),
    approvalQueue,
    stripe,
    metrics,
    response: "Trust and production controls are active."
  };
}
