
export function runProactiveDecisionEngine({ readiness, intent, world } = {}) {
  const actions = [];

  if (!readiness?.ready) {
    actions.push({
      id: "ask_enablement",
      priority: 100,
      speak: true,
      message: "I need one item enabled before we continue."
    });
  }

  if (world?.weather?.riskLevel === "high") {
    actions.push({
      id: "prepare_weather_backup",
      priority: 80,
      speak: true,
      message: "Weather may affect this outcome. I’m preparing a backup path."
    });
  }

  if (intent?.emotion === "needs_reassurance") {
    actions.push({
      id: "reduce_pressure",
      priority: 70,
      speak: true,
      message: "I’ll keep this simple and guide one step at a time."
    });
  }

  if (intent?.urgency === "urgent") {
    actions.push({
      id: "fast_track",
      priority: 65,
      speak: false,
      message: "Fast-track the next safe step."
    });
  }

  const top = actions.sort((a, b) => b.priority - a.priority)[0] || {
    id: "quiet_ready",
    priority: 10,
    speak: false,
    message: "No proactive interruption needed."
  };

  return {
    layer: "proactive_decision_engine",
    actions,
    topAction: top,
    shouldSpeak: Boolean(top.speak),
    nextMove: top.id
  };
}
