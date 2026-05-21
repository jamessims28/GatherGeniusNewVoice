
const protectedDomains = ["payments", "contracts", "external_messages", "personal_data", "calendar_invites", "vendor_outreach", "tenant_admin"];

export function runPolicyGovernanceEngine({ request = "", role = "user", tenantId = "default" } = {}) {
  const t = String(request).toLowerCase();
  const triggered = protectedDomains.filter((domain) => {
    if (domain === "payments") return /payment|pay|deposit|invoice|stripe|charge/.test(t);
    if (domain === "contracts") return /contract|agreement|legal|terms/.test(t);
    if (domain === "external_messages") return /email|text|send|contact|message|outreach/.test(t);
    if (domain === "personal_data") return /personal|private|profile|memory|identity|data/.test(t);
    if (domain === "calendar_invites") return /calendar|invite|schedule|meeting/.test(t);
    if (domain === "vendor_outreach") return /vendor|dj|catering|venue|provider/.test(t);
    if (domain === "tenant_admin") return /admin|tenant|enterprise|role|user/.test(t);
    return false;
  });

  return {
    layer: "policy_governance_engine",
    tenantId,
    role,
    protectedDomains,
    triggered,
    governanceStatus: triggered.length ? "review_required" : "clear_for_internal_preparation",
    canAutoExecute: false,
    createdAt: new Date().toISOString()
  };
}
