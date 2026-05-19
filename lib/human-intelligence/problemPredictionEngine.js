
export function predictProblems({ text = "", providerSignals = {}, paymentSignals = {}, timing = {} } = {}) {
  const t = String(text).toLowerCase();
  const risks = [];

  if (timing.timingBehavior === "urgent" || /asap|tomorrow|today/.test(t)) risks.push("timeline_compression");
  if (/outdoor|outside|rain|weather/.test(t)) risks.push("weather_dependency");
  if (/cheap|lowest|tight budget/.test(t)) risks.push("budget_quality_mismatch");
  if (providerSignals.delayedResponses > 0) risks.push("provider_delay");
  if (paymentSignals.status === "failed") risks.push("payment_blocker");
  if (/large|200|300|500/.test(t)) risks.push("scale_complexity");

  const severity = risks.includes("payment_blocker") || risks.length >= 3 ? "high" : risks.length ? "medium" : "low";

  return {
    layer: "problem_prediction",
    predictsProblems: true,
    severity,
    risks,
    recommendedPrevention:
      severity === "high" ? ["activate backup path", "reduce scope options", "confirm payment", "notify user"] :
      severity === "medium" ? ["warm backup providers", "confirm constraints", "watch timing"] :
      ["continue quietly"],
    message: severity === "low" ? "No major issues predicted." : "Potential issues predicted and prevention steps prepared."
  };
}
