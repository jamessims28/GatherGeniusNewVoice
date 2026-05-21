
export function runPredictiveOutcomeEngine({ reality = {}, memory = {} } = {}) {
  const state = reality.worldState || {};
  const risk = reality.riskMatrix || {};
  const predictions = [];

  if (risk.weatherRisk) {
    predictions.push({ type: "weather_disruption", probability: 0.82, recommendation: "prepare backup indoor or covered option" });
  }
  if (risk.timingRisk) {
    predictions.push({ type: "timeline_pressure", probability: 0.76, recommendation: "compress plan to the safest next decision" });
  }
  if (risk.financialRisk) {
    predictions.push({ type: "budget_pressure", probability: 0.72, recommendation: "protect budget before recommending premium add-ons" });
  }
  if (risk.emotionalRisk) {
    predictions.push({ type: "decision_fatigue", probability: 0.86, recommendation: "reduce choices to one best path" });
  }
  if (state.logistics?.vendorNeeded && memory?.vendorReliability === "unknown") {
    predictions.push({ type: "vendor_uncertainty", probability: 0.64, recommendation: "prepare trusted vendor shortlist" });
  }

  return {
    layer: "predictive_outcome_engine",
    predictions,
    likelyOutcome: predictions.length ? "needs_protection" : "stable_path",
    confidence: predictions.length ? 0.84 : 0.72
  };
}
