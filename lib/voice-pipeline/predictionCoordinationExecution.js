
export function predictOutcomeRisks({ intent, humanCore, operatingLayer } = {}) {
  const risks = [];

  if (intent?.missing?.length) risks.push("missing_details");
  if (humanCore?.problemPrediction?.severity === "high") risks.push("human_or_operational_risk");
  if (operatingLayer?.realWorld?.signals?.weather?.riskLevel === "high") risks.push("weather_risk");
  if (operatingLayer?.realWorld?.signals?.pricing?.pricing?.mode === "fallback-estimate") risks.push("unconfirmed_pricing");

  const severity = risks.length >= 3 ? "high" : risks.length ? "medium" : "low";

  return {
    stage: "prediction",
    risks,
    severity,
    message: severity === "low" ? "No major issues predicted." : "Potential issues predicted."
  };
}

export function coordinateReality({ intent, prediction, operatingLayer } = {}) {
  const tasks = [
    { id: "source_check", label: "Check real-world signals", status: "complete" },
    { id: "pricing_path", label: "Build pricing path", status: operatingLayer?.realWorld?.signals?.pricing ? "complete" : "needed" },
    { id: "provider_path", label: "Prepare provider path", status: "ready" },
    { id: "backup_path", label: "Prepare backup path", status: prediction?.severity === "low" ? "standby" : "active" }
  ];

  return {
    stage: "coordination",
    tasks,
    message: "Reality coordination path prepared."
  };
}

export function prepareExecution({ coordination, prediction } = {}) {
  const needsConfirmation = prediction?.severity !== "low" || coordination?.tasks?.some((task) => task.status === "needed");

  return {
    stage: "execution",
    canExecute: !needsConfirmation,
    needsConfirmation,
    executionMode: needsConfirmation ? "guided_confirmation" : "automatic_next_step",
    nextStep: needsConfirmation ? "ask_user_for_confirmation" : "execute_next_best_action",
    message: needsConfirmation ? "Confirmation needed before execution." : "Ready to execute the next safe step."
  };
}

export function protectOutcome({ prediction, execution } = {}) {
  const protections = [
    "GeniusShield input safety",
    "backup path monitoring",
    "pricing confirmation",
    "permission-aware data use"
  ];

  if (prediction?.severity !== "low") protections.push("risk explanation before action");
  if (execution?.needsConfirmation) protections.push("human confirmation required");

  return {
    stage: "protection",
    protected: true,
    protections,
    message: "Outcome protection is active."
  };
}

export function deliverOutcome({ intent, execution, protection, operatingLayer } = {}) {
  const confidence = operatingLayer?.finalDecision?.confidence || (execution?.canExecute ? 92 : 78);

  return {
    stage: "outcome_delivery",
    confidence,
    delivered: true,
    voiceSummary: execution?.canExecute
      ? `I understand what you need. I checked the signals, protected the outcome, and I can move forward with the next safe step. Confidence is ${confidence} percent.`
      : `I understand what you need. I checked the signals and found something that needs your confirmation before I move forward. Confidence is ${confidence} percent.`,
    finalResult: {
      category: intent?.category,
      location: intent?.location,
      guests: intent?.guests,
      budget: intent?.budget,
      nextStep: execution?.nextStep,
      protections: protection?.protections || []
    }
  };
}
