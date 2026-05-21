
export function scoreOutcome({ request = "", result = {}, userFeedback = {}, metrics = {} } = {}) {
  const executionGraph = result.executionGraph || result.execution || {};
  const trust = result.trust || {};
  const response = result.response || "";

  const latencyScore =
    typeof metrics.durationMs === "number"
      ? metrics.durationMs < 300 ? 1 : metrics.durationMs < 1000 ? 0.82 : metrics.durationMs < 2500 ? 0.62 : 0.38
      : 0.74;

  const protectionScore =
    (trust.holds || trust.confirmationRequiredCount || 0) > 0 ? 0.92 :
    response.toLowerCase().includes("protect") ? 0.86 : 0.72;

  const clarityScore =
    response.length > 20 && response.length < 600 ? 0.86 :
    response.length >= 600 ? 0.64 : 0.52;

  const executionScore =
    Array.isArray(executionGraph.nodes)
      ? executionGraph.nodes.filter((n) => n.status !== "failed").length / Math.max(1, executionGraph.nodes.length)
      : 0.74;

  const feedbackScore =
    userFeedback.rating ? Math.max(0, Math.min(1, Number(userFeedback.rating) / 5)) : 0.75;

  const weighted =
    latencyScore * 0.16 +
    protectionScore * 0.24 +
    clarityScore * 0.18 +
    executionScore * 0.22 +
    feedbackScore * 0.20;

  return {
    layer: "outcome_scoring_engine",
    request,
    scores: {
      latencyScore,
      protectionScore,
      clarityScore,
      executionScore,
      feedbackScore
    },
    outcomeScore: Math.round(weighted * 100),
    grade: weighted >= 0.9 ? "elite" : weighted >= 0.78 ? "strong" : weighted >= 0.64 ? "needs_tuning" : "weak",
    createdAt: new Date().toISOString()
  };
}
