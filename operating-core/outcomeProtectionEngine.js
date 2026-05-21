
export function runOperatingOutcomeProtectionEngine({ readiness, intent, world, proactive } = {}) {
  const risks = [];
  const protections = [
    "readiness-gated voice startup",
    "single premium conversation stream",
    "permission-aware execution",
    "one-question clarification",
    "human comfort pacing"
  ];

  if (!readiness?.ready) risks.push("voice_not_ready");
  if (intent?.confidence < 0.74) risks.push("intent_confidence_low");
  if (intent?.missing?.length) risks.push("missing_operating_details");
  if (intent?.urgency === "urgent") risks.push("compressed_timeline");
  if (world?.riskLevel === "elevated") risks.push("real_world_risk_elevated");
  if (world?.weather?.riskLevel === "high") risks.push("weather_risk");

  if (world?.weather?.riskLevel !== "low") protections.push("weather-aware backup planning");
  if (intent?.spending === "budget_protective") protections.push("budget safety guardrail");
  if (intent?.spending === "premium_value") protections.push("premium quality guardrail");

  const protectedAction =
    risks.includes("voice_not_ready") ? "enable_voice_first" :
    risks.includes("missing_operating_details") ? "ask_one_clarifying_question" :
    risks.includes("real_world_risk_elevated") ? "prepare_backup_before_action" :
    risks.includes("compressed_timeline") ? "fast_track_with_confirmation" :
    "proceed_to_next_safe_step";

  return {
    layer: "operating_outcome_protection_engine",
    protected: true,
    risks,
    protections,
    protectedAction,
    canProceed: protectedAction === "proceed_to_next_safe_step" || protectedAction === "fast_track_with_confirmation",
    userMessage:
      protectedAction === "enable_voice_first" ? "I need voice enabled before I can continue." :
      protectedAction === "ask_one_clarifying_question" ? intent.nextQuestion :
      protectedAction === "prepare_backup_before_action" ? "I’ll prepare a backup path before moving forward." :
      protectedAction === "fast_track_with_confirmation" ? "I can fast-track this, but I’ll confirm the important step first." :
      "I can move to the next safe step."
  };
}
