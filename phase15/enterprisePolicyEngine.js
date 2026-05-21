
const sensitiveActions = ["payment", "booking", "contract", "external_message", "vendor_outreach", "calendar_invite", "data_export"];

export function runEnterprisePolicyEngine({ action = {}, tenant = {}, organization = {} } = {}) {
  const requiresApproval = sensitiveActions.includes(action.type) || organization.policies?.approvalRequired;
  const allowed = !requiresApproval || action.approved === true;

  return {
    layer: "enterprise_policy_engine",
    actionType: action.type || "internal_preparation",
    requiresApproval,
    allowed,
    policyReason: allowed ? "enterprise_policy_allowed" : "enterprise_admin_approval_required",
    tenantId: tenant.tenantId
  };
}
