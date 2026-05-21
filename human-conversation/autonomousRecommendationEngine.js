
export function runAutonomousRecommendationEngine({ human, memory, world, agents } = {}) {
  const blockers = [];
  if (agents?.some((agent) => agent.status === "blocked")) blockers.push("confirmation_required");
  if (world?.riskLevel === "elevated") blockers.push("world_risk");
  if (human?.stress > 0.7) blockers.push("human_pressure");

  const recommendation =
    blockers.includes("confirmation_required") ? "Ask for explicit confirmation before acting." :
    blockers.includes("world_risk") ? "Prepare a backup path before moving forward." :
    blockers.includes("human_pressure") ? "Reduce choices and give one calm next step." :
    memory?.preferences?.premium ? "Recommend the highest-trust premium option." :
    "Recommend the safest next step.";

  return {
    layer: "autonomous_recommendation_engine",
    recommendation,
    blockers,
    canAutoPrepare: true,
    canAutoExecute: blockers.length === 0,
    requiresConfirmation: blockers.includes("confirmation_required") || blockers.includes("world_risk")
  };
}
