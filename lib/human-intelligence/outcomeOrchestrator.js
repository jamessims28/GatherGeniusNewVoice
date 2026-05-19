
export function orchestrateOutcome({ intent = {}, humanProfile = {}, problemPrediction = {}, pricing = null } = {}) {
  const outcome = intent.eventType || intent.category || "guided experience";
  const needsProtection = problemPrediction.severity === "high" || problemPrediction.severity === "medium";
  const actionPlan = [];

  actionPlan.push("understand intent");
  if (humanProfile.trust?.trustPreference === "proof-first") actionPlan.push("show proof and confidence");
  if (humanProfile.spending?.spendingPsychology === "budget-protective") actionPlan.push("optimize cost");
  if (humanProfile.spending?.spendingPsychology === "premium-value") actionPlan.push("prioritize premium fit");
  if (needsProtection) actionPlan.push("activate outcome protection");
  actionPlan.push("produce next best result");

  return {
    layer: "outcome_orchestration",
    orchestratesOutcomes: true,
    targetOutcome: outcome,
    needsProtection,
    actionPlan,
    nextBestAction: needsProtection ? "protect and proceed" : "proceed with recommended result",
    message: `Genius is orchestrating ${outcome} toward the safest successful path.`
  };
}

export function buildAutomaticExecutionPlan({ orchestration, currentLock = null } = {}) {
  const steps = [
    { id: "confirm_intent", status: "ready", label: "Confirm intent" },
    { id: "price_check", status: "ready", label: "Check price intelligence" },
    { id: "provider_match", status: "ready", label: "Match provider path" },
    { id: "risk_protection", status: orchestration?.needsProtection ? "active" : "standby", label: "Protect outcome" },
    { id: "result_delivery", status: "ready", label: "Deliver result" }
  ];

  return {
    layer: "automatic_execution",
    executesAutomatically: true,
    steps,
    canAutoProceed: orchestration?.needsProtection ? false : true,
    reason: orchestration?.needsProtection ? "User should be informed before protected-path change." : "Safe to proceed with guided result.",
    message: "Automatic execution plan prepared."
  };
}
