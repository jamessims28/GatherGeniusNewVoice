
export function runScaleReadinessEngine({ growth = {}, acquisition = {}, retention = {}, marketplace = {} } = {}) {
  const readiness = {
    productSignal: growth.growthScore >= 50,
    acquisitionSystem: acquisition.strategies?.length >= 2,
    retentionSystem: retention.loops?.length >= 3,
    monetizationSystem: Boolean(marketplace?.forecast?.monthlyPotential || marketplace?.revenue?.revenueReadiness),
    safetySystem: true
  };

  const score = Object.values(readiness).filter(Boolean).length * 20;

  return {
    layer: "scale_readiness_engine",
    readiness,
    scaleScore: score,
    stage: score >= 80 ? "scale_ready" : score >= 60 ? "pilot_ready" : "prototype_ready",
    nextScaleAction:
      score >= 80 ? "prepare investor-grade live pilot" :
      score >= 60 ? "launch controlled beta with approval workflows" :
      "tighten onboarding and one core use case",
    requiresReview: process.env.SCALE_RECOMMENDATIONS_REQUIRE_REVIEW !== "false"
  };
}
