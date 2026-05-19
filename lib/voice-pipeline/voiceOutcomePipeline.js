
import { understandIntent } from "./intentUnderstanding";
import { predictOutcomeRisks, coordinateReality, prepareExecution, protectOutcome, deliverOutcome } from "./predictionCoordinationExecution";
import { runAutonomousHumanCore } from "../human-intelligence/autonomousHumanCore";
import { runExperienceOperatingLayer } from "../operating-layer/experienceOperatingLayer";

export async function runVoiceOutcomePipeline({ text = "", userKey = "anonymous_preview", currentLock = null } = {}) {
  const intent = understandIntent(text);

  const humanCore = runAutonomousHumanCore({
    text,
    intent,
    currentLock
  });

  const operatingLayer = await runExperienceOperatingLayer({
    request: text,
    userKey,
    currentLock
  }).catch((error) => ({
    ok: false,
    error: error.message,
    finalDecision: {
      confidence: 70,
      userMessage: "Operating layer unavailable. Continuing with safe local intelligence."
    },
    realWorld: { signals: {} }
  }));

  const prediction = predictOutcomeRisks({ intent, humanCore, operatingLayer });
  const coordination = coordinateReality({ intent, prediction, operatingLayer });
  const execution = prepareExecution({ coordination, prediction });
  const protection = protectOutcome({ prediction, execution });
  const outcome = deliverOutcome({ intent, execution, protection, operatingLayer });

  return {
    ok: true,
    pipeline: "voice_outcome_delivery",
    stages: {
      intent,
      humanUnderstanding: humanCore,
      prediction,
      coordination,
      execution,
      protection,
      outcomeDelivery: outcome
    },
    voiceResponse: outcome.voiceSummary,
    nextAction: execution.nextStep,
    confidence: outcome.confidence,
    createdAt: new Date().toISOString()
  };
}
