
export function runPrivacyComplianceEngine({ request = "", memory = {}, tenantId = "default" } = {}) {
  const t = String(request).toLowerCase();
  const privacyFlags = [];
  if (/personal|private|identity|profile|memory|address|phone|email/.test(t)) privacyFlags.push("personal_data_reference");
  if (/share|send|export|download|third party|vendor/.test(t)) privacyFlags.push("data_disclosure_risk");
  if (/remember|store|save/.test(t)) privacyFlags.push("memory_persistence_notice");

  return {
    layer: "privacy_compliance_engine",
    tenantId,
    privacyFlags,
    privacyStatus: privacyFlags.length ? "privacy_review_required" : "privacy_clear",
    dataMinimization: true,
    reviewRequired: process.env.PRIVACY_REVIEW_REQUIRED !== "false",
    message: privacyFlags.length ? "Privacy review required before sharing or persisting sensitive data." : "No privacy flags detected."
  };
}
