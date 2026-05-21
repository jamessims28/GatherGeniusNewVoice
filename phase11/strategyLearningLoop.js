
export function runStrategyLearningLoop({ outcome = {}, priorStrategy = {}, request = "" } = {}) {
  const improvements = [];

  if ((outcome.scores?.latencyScore || 0) < 0.7) {
    improvements.push({
      type: "latency",
      recommendation: "Use shorter response path and reduce background sync calls before speaking."
    });
  }

  if ((outcome.scores?.clarityScore || 0) < 0.75) {
    improvements.push({
      type: "clarity",
      recommendation: "Use concise response shape: acknowledge, decision, next action."
    });
  }

  if ((outcome.scores?.protectionScore || 0) < 0.8) {
    improvements.push({
      type: "protection",
      recommendation: "Run trust and outcome protection before any external action."
    });
  }

  if ((outcome.scores?.executionScore || 0) < 0.8) {
    improvements.push({
      type: "execution",
      recommendation: "Split execution graph into smaller permission-gated steps."
    });
  }

  if (!improvements.length) {
    improvements.push({
      type: "maintain",
      recommendation: "Keep current orchestration strategy and continue monitoring."
    });
  }

  return {
    layer: "strategy_learning_loop",
    mode: process.env.ORCHESTRATION_LEARNING_MODE || "shadow",
    request,
    priorStrategy,
    improvements,
    requiresReview: process.env.SELF_IMPROVEMENT_REQUIRES_REVIEW !== "false",
    canAutoApply: process.env.STRATEGY_TUNING_ENABLED === "true" && process.env.SELF_IMPROVEMENT_REQUIRES_REVIEW === "false"
  };
}
