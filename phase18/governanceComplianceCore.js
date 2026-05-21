
import { runAutonomousOperationsCommandCore } from "../phase17/autonomousOperationsCommandCore";
import { runPolicyGovernanceEngine } from "./policyGovernanceEngine";
import { runPrivacyComplianceEngine } from "./privacyComplianceEngine";
import { runComplianceAuditEngine } from "./complianceAuditEngine";
import { runAutonomousBoundaryEngine } from "./autonomousBoundaryEngine";

export async function runGovernanceComplianceCore({
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
  const operations = await runAutonomousOperationsCommandCore({ request, tenantId, userKey, role, seats, memory, location, permissions, metrics });
  const governance = runPolicyGovernanceEngine({ request, role, tenantId });
  const privacy = runPrivacyComplianceEngine({ request, memory, tenantId });
  const audit = runComplianceAuditEngine({ governance, privacy, operations });
  const boundary = runAutonomousBoundaryEngine({ governance, privacy, audit });

  return {
    ok: true,
    layer: "governance_compliance_core",
    name: "GatherGenius Autonomous Intelligence Governance & Compliance Core",
    backgroundOnly: true,
    operations,
    governance,
    privacy,
    audit,
    boundary,
    response: buildResponse({ governance, privacy, audit, boundary }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ governance, privacy, audit, boundary }) {
  if (boundary.blocked) return "Governance is active. Sensitive external execution is blocked pending review.";
  if (boundary.reviewRequired) return "Governance is active. Protected actions are prepared and held for review.";
  return "Governance is active in the background. Internal preparation is clear.";
}
