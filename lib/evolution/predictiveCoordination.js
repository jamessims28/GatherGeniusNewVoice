export function predictCoordinationRisks({ providerResponses = [], weatherRisk = "unknown", timelineHours = 72 } = {}) {
  const slowProviders = providerResponses.filter((item) => Number(item.responseHours || 0) > 6);
  const highRisk =
    slowProviders.length > 1 ||
    weatherRisk === "high" ||
    Number(timelineHours) < 24;

  const risks = [];
  if (slowProviders.length) risks.push("provider_response_delay");
  if (weatherRisk === "high") risks.push("weather_instability");
  if (Number(timelineHours) < 24) risks.push("timeline_compression");

  return {
    layer: "predictive_coordination",
    riskLevel: highRisk ? "high" : risks.length ? "medium" : "low",
    risks,
    recommendedActions: highRisk
      ? ["activate backup providers", "reduce decision load", "confirm payment readiness"]
      : ["monitor provider SLA", "keep backup path warm"],
    message: highRisk
      ? "I predicted a possible execution issue and prepared a safer path."
      : "No major coordination risks detected."
  };
}
