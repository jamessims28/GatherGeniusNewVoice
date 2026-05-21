
export function runRealityPredictionEngine({ world = {}, relationship = {}, graph = {} } = {}) {
  const predictions = [];
  if (world.weather?.risk === "watch") predictions.push(prediction("weather_disruption", 0.82, "prepare backup weather path"));
  if (world.riskLevel === "elevated") predictions.push(prediction("world_state_risk", 0.76, "pause execution until safer path is prepared"));
  if (relationship.trustScore < 0.7) predictions.push(prediction("trust_friction", 0.71, "show proof and ask confirmation"));
  if (graph.nodes?.some(n => n.status === "awaiting_confirmation")) predictions.push(prediction("execution_blocked", 0.9, "request approval for protected actions"));
  if (world.pricing?.mode === "budget") predictions.push(prediction("budget_overrun", 0.66, "protect budget before upgrades"));

  return {
    layer: "reality_prediction_engine",
    predictions,
    failureRisk: predictions.length >= 2 ? "elevated" : predictions.length ? "watch" : "stable",
    nextProtection: predictions[0]?.recommendation || "continue stable path"
  };
}

function prediction(type, probability, recommendation) {
  return { type, probability, recommendation, createdAt: new Date().toISOString() };
}
