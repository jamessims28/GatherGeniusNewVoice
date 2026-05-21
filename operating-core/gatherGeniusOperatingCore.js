
import { runOperatingIntentEngine } from "./intentEngine";
import { runOperatingWorldSignalEngine } from "./worldSignalEngine";
import { runOperatingProactiveDecisionEngine } from "./proactiveDecisionEngine";
import { runOperatingOutcomeProtectionEngine } from "./outcomeProtectionEngine";
import { composeSafeHumanResponse } from "../language/consentConversationStyleEngine";

export async function runGatherGeniusOperatingCore({ text = "", readiness = {}, location = "Virginia" } = {}) {
  const intent = runOperatingIntentEngine(text);
  const world = await runOperatingWorldSignalEngine({ text, location: intent.location || location });
  const proactive = runOperatingProactiveDecisionEngine({ readiness, intent, world });
  const protection = runOperatingOutcomeProtectionEngine({ readiness, intent, world, proactive });

  const decision = buildOperatingDecision({ readiness, intent, world, proactive, protection });
  const safeConversation = composeSafeHumanResponse({
    text,
    coreResponse: decision.message,
    examples: []
  });
  decision.message = safeConversation.response;
  decision.safeConversation = safeConversation;

  return {
    ok: true,
    layer: "gathergenius_operating_core",
    name: "GatherGenius Operating Core",
    version: "1.1",
    readiness,
    intent,
    world,
    proactive,
    protection,
    decision,
    response: decision.message,
    safeConversation: decision.safeConversation,
    createdAt: new Date().toISOString()
  };
}

function buildOperatingDecision({ readiness, intent, world, proactive, protection }) {
  if (!readiness?.ready) {
    return {
      action: "enable_voice",
      confidence: 0.99,
      message: protection.userMessage,
      speak: true
    };
  }

  if (proactive.shouldSpeak) {
    return {
      action: proactive.nextMove,
      confidence: 0.88,
      message: proactive.topAction.message,
      speak: true
    };
  }

  if (protection.risks.length) {
    return {
      action: protection.protectedAction,
      confidence: 0.82,
      message: protection.userMessage,
      speak: true
    };
  }

  return {
    action: "next_safe_step",
    confidence: Math.round((intent.confidence || 0.86) * 100) / 100,
    message: `I understand. I checked readiness, intent, world signals, proactive decisions, and outcome protection. ${intent.nextQuestion}`,
    speak: true
  };
}
