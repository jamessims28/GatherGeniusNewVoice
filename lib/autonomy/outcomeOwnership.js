
export function ownOutcome({ assistance, agentMesh, worldState } = {}) {
  const unresolved = [];

  if (worldState?.weather?.riskLevel === "high") unresolved.push("weather contingency");
  if (assistance?.actions?.some((action) => action.id === "proof_pack")) unresolved.push("confidence proof");
  if (agentMesh?.activeAgents?.includes("risk_agent")) unresolved.push("risk prevention");

  return {
    layer: "outcome_ownership",
    ownsOutcome: true,
    unresolved,
    recoveryPlan:
      unresolved.length
        ? ["explain risk", "prepare backup", "ask for confirmation only if needed", "continue monitoring"]
        : ["continue monitoring", "execute next safe step"],
    ownershipStatement:
      unresolved.length
        ? "Genius has taken ownership of the outcome and prepared recovery paths."
        : "Genius owns the outcome and sees no blockers right now."
  };
}
