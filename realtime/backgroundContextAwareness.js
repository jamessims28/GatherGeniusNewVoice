
export function buildBackgroundContextSnapshot({
  conversation = [],
  readiness = {},
  world = {},
  permissions = {},
  browser = {}
} = {}) {
  const recent = Array.isArray(conversation) ? conversation.slice(-8) : [];

  return {
    layer: "continuous_background_context_awareness",
    timestamp: new Date().toISOString(),
    conversationTail: recent,
    readiness,
    world,
    permissions,
    browser: {
      online: typeof navigator !== "undefined" ? navigator.onLine : browser.online,
      language: typeof navigator !== "undefined" ? navigator.language : browser.language,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : browser.userAgent
    },
    inferredState: inferState({ conversation: recent, readiness, world })
  };
}

function inferState({ conversation, readiness, world }) {
  const text = conversation.map((item) => item.text || "").join(" ").toLowerCase();
  const needsHelp = /help|confused|overwhelmed|worried|stuck/.test(text);
  const urgent = /urgent|asap|today|now|quick/.test(text);
  const worldRisk = world?.riskLevel === "elevated" || world?.weather?.riskLevel === "high";

  return {
    needsHelp,
    urgent,
    worldRisk,
    shouldProactivelySpeak: Boolean(readiness?.ready && (needsHelp || urgent || worldRisk)),
    reason:
      needsHelp ? "human_needs_support" :
      urgent ? "timing_pressure" :
      worldRisk ? "world_risk_detected" :
      "quiet_monitoring"
  };
}
