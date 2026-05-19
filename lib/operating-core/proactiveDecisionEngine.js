
export function runOperatingProactiveDecisionEngine({ readiness, intent, world } = {}) {
  const actions = [];

  if (!readiness?.ready) {
    actions.push({
      id: "voice_enablement",
      priority: 100,
      speak: true,
      type: "enablement",
      message: "I need voice enabled before we continue."
    });
  }

  if (intent?.missing?.length) {
    actions.push({
      id: "ask_missing_detail",
      priority: 88,
      speak: true,
      type: "clarify",
      message: intent.nextQuestion
    });
  }

  if (world?.riskLevel === "elevated") {
    actions.push({
      id: "protect_world_risk",
      priority: 82,
      speak: true,
      type: "protect",
      message: "I see real-world risk, so I’m preparing a safer path before moving forward."
    });
  }

  if (intent?.emotion === "needs_reassurance") {
    actions.push({
      id: "comfort_first",
      priority: 74,
      speak: true,
      type: "comfort",
      message: "I’ll keep this calm and simple. We’ll take it one step at a time."
    });
  }

  if (intent?.urgency === "urgent") {
    actions.push({
      id: "fast_track_safe_path",
      priority: 68,
      speak: false,
      type: "execute",
      message: "Fast-track the safest next step."
    });
  }

  if (intent?.spending === "premium_value") {
    actions.push({
      id: "premium_path",
      priority: 55,
      speak: false,
      type: "optimize",
      message: "Prioritize premium quality and reliability."
    });
  }

  const ranked = actions.sort((a, b) => b.priority - a.priority);
  const topAction = ranked[0] || {
    id: "quiet_ready",
    priority: 10,
    speak: false,
    type: "ready",
    message: "No proactive interruption needed."
  };

  return {
    layer: "operating_proactive_decision_engine",
    actions: ranked,
    topAction,
    shouldSpeak: Boolean(topAction.speak),
    nextMove: topAction.id,
    autonomyLevel:
      topAction.type === "enablement" ? "blocked" :
      topAction.type === "clarify" ? "ask_one_question" :
      topAction.type === "protect" ? "protect_before_execute" :
      "quiet_execute_when_safe"
  };
}
