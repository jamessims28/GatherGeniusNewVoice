export function evaluateTrustSafety({ providerRisk = 2, paymentStatus = "ready", cancellationSignals = 0 } = {}) {
  const score = Math.max(0, Math.min(100, 100 - Number(providerRisk) * 8 - Number(cancellationSignals) * 12 - (paymentStatus === "failed" ? 30 : 0)));
  const status = score >= 85 ? "protected" : score >= 65 ? "watch" : "warning";

  return {
    layer: "trust_safety",
    score,
    status,
    actions:
      status === "warning"
        ? ["activate backup", "require confirmation", "notify user"]
        : status === "watch"
        ? ["monitor SLA", "prepare backup"]
        : ["continue"],
    message:
      status === "warning"
        ? "I detected elevated trust risk and will explain the safest next step."
        : "Trust and safety layer is protecting the execution path."
  };
}
