
import { buildHumanUnderstandingProfile } from "./humanPatternEngine";
import { predictProblems } from "./problemPredictionEngine";
import { orchestrateOutcome, buildAutomaticExecutionPlan } from "./outcomeOrchestrator";

export function runAutonomousHumanCore({ text = "", intent = {}, comfort = {}, currentLock = null, prior = {} } = {}) {
  const humanProfile = buildHumanUnderstandingProfile({ text, prior, comfort });

  const problemPrediction = predictProblems({
    text,
    timing: humanProfile.timing,
    providerSignals: prior.providerSignals || {},
    paymentSignals: prior.paymentSignals || {}
  });

  const orchestration = orchestrateOutcome({
    intent: intent || currentLock?.intent || {},
    humanProfile,
    problemPrediction
  });

  const automaticExecution = buildAutomaticExecutionPlan({ orchestration, currentLock });

  return {
    ok: true,
    stack: "autonomous-human-core",
    conversational: true,
    proactive: true,
    predictive: true,
    emotionallyAware: true,
    operationallyIntelligent: true,
    understandsIntent: true,
    coordinatesReality: true,
    protectsOutcomes: true,
    executesAutomatically: true,
    understandsHumans: true,
    predictsProblems: true,
    orchestratesOutcomes: true,
    protectsExecution: true,
    adaptsEmotionally: true,
    coordinatesRealWorld: true,
    humanProfile,
    problemPrediction,
    orchestration,
    automaticExecution,
    responseGuidance: buildResponseGuidance({ humanProfile, problemPrediction, orchestration, automaticExecution })
  };
}

function buildResponseGuidance({ humanProfile, problemPrediction, orchestration, automaticExecution }) {
  const style = humanProfile.communication.communicationStyle;
  const trustMove = humanProfile.trust.nextTrustMove;
  const prevention = problemPrediction.recommendedPrevention?.join(", ") || "continue";

  return {
    style,
    trustMove,
    prevention,
    nextBestAction: orchestration.nextBestAction,
    canAutoProceed: automaticExecution.canAutoProceed,
    instruction: `Respond in ${style}. Trust move: ${trustMove}. Prevention: ${prevention}. Next action: ${orchestration.nextBestAction}.`
  };
}
