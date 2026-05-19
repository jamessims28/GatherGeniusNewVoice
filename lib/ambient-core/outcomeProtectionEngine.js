
export function runOutcomeProtectionEngine({ readiness, intent, world, proactive } = {}) {
  const protections = [
    "permission-aware voice startup",
    "single conversation record",
    "human comfort pacing",
    "safe confirmation before risky actions"
  ];

  const risks = [];
  if (!readiness?.ready) risks.push("voice_not_ready");
  if (world?.weather?.riskLevel === "high") risks.push("weather_outcome_risk");
  if (intent?.confidence < 0.7) risks.push("intent_unclear");
  if (intent?.urgency === "urgent") risks.push("compressed_timeline");

  const protectedAction =
    risks.includes("voice_not_ready") ? "ask_for_enablement" :
    risks.includes("intent_unclear") ? "ask_one_clarifying_question" :
    risks.includes("weather_outcome_risk") ? "prepare_backup_path" :
    "continue_to_next_safe_step";

  return {
    layer: "outcome_protection_engine",
    protected: true,
    risks,
    protections,
    protectedAction,
    userMessage:
      protectedAction === "ask_for_enablement" ? "I need voice enabled before I can continue." :
      protectedAction === "ask_one_clarifying_question" ? intent.nextQuestion :
      protectedAction === "prepare_backup_path" ? "I’ll prepare a backup path before we move forward." :
      "I can move to the next safe step."
  };
}
