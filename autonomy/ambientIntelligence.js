
export function runAmbientIntelligence({ text = "", context = {}, world = {} } = {}) {
  const t = String(text).toLowerCase();
  const signals = [];

  if (/stress|overwhelmed|worried|confused/.test(t)) signals.push("human_stress");
  if (/today|tomorrow|asap|urgent|soon/.test(t)) signals.push("time_pressure");
  if (world?.weather?.riskLevel === "high") signals.push("environment_risk");
  if (context?.lastActionFailed) signals.push("system_friction");
  if (context?.paymentStatus === "failed") signals.push("payment_friction");

  return {
    layer: "ambient_intelligence",
    active: true,
    signals,
    ambientState: signals.length >= 2 ? "needs_attention" : signals.length ? "watching" : "calm",
    proactiveMessage:
      signals.length >= 2
        ? "I noticed a few things that could affect the outcome, so I’m preparing the safest path."
        : "I’m quietly watching the background conditions."
  };
}
