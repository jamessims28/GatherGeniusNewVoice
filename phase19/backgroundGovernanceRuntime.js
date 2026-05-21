
export function runBackgroundGovernanceRuntime({ memoryReview = {}, privacy = {}, security = {} } = {}) {
  const controls = [
    { id: "memory_review", status: memoryReview.reviewRequired ? "review_required" : "auto_allowed" },
    { id: "privacy_boundary", status: privacy.requiresConsent ? "consent_required" : "clear" },
    { id: "security_risk", status: security.action },
    { id: "background_only", status: process.env.BACKGROUND_INTELLIGENCE_ONLY !== "false" ? "enabled" : "disabled" }
  ];

  const holds = controls.filter((item) => /required|block|review/.test(item.status)).length;

  return {
    layer: "background_governance_runtime",
    controls,
    holds,
    backgroundOnly: process.env.BACKGROUND_INTELLIGENCE_ONLY !== "false",
    status: holds ? "governed_background_preparation" : "quiet_background_ready",
    message: holds
      ? `${holds} governance control(s) are holding sensitive actions for review.`
      : "Background intelligence is clear to continue preparing safely."
  };
}
