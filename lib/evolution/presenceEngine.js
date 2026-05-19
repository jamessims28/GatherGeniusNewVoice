export function evaluatePresence({ transcript = "", permissions = {}, execution = {} } = {}) {
  const text = String(transcript).toLowerCase();
  const urgency =
    text.includes("urgent") || text.includes("today") || text.includes("tomorrow") ? "high" :
    text.includes("soon") || text.includes("quick") ? "medium" :
    "normal";

  const friction =
    text.includes("confused") || text.includes("stress") || text.includes("overwhelmed") ? "high" :
    text.length > 160 ? "medium" :
    "low";

  const coordinationRisk =
    execution.providerDelay || execution.paymentIssue || urgency === "high" ? "elevated" : "stable";

  return {
    layer: "presence",
    status: "active",
    urgency,
    friction,
    coordinationRisk,
    recommendedState: coordinationRisk === "elevated" ? "warning" : friction === "high" ? "listening" : "ready",
    message:
      coordinationRisk === "elevated"
        ? "I detected elevated coordination risk and will simplify the next step."
        : "Presence intelligence is active and watching for friction quietly."
  };
}
