
import { runHumanIntentEngine } from "./humanIntentEngine";
import { runWorldSignalEngine } from "./worldSignalEngine";
import { runProactiveDecisionEngine } from "./proactiveDecisionEngine";
import { runOutcomeProtectionEngine } from "./outcomeProtectionEngine";

export async function runAmbientOperatingCoreV1({ text = "", readiness = {}, location = "Virginia" } = {}) {
  const intent = runHumanIntentEngine(text);
  const world = await runWorldSignalEngine({ text, location: intent.location || location });
  const proactive = runProactiveDecisionEngine({ readiness, intent, world });
  const protection = runOutcomeProtectionEngine({ readiness, intent, world, proactive });

  return {
    ok: true,
    layer: "ambient_operating_core_v1",
    readiness,
    intent,
    world,
    proactive,
    protection,
    response: buildCoreResponse({ readiness, intent, world, proactive, protection }),
    createdAt: new Date().toISOString()
  };
}

function buildCoreResponse({ readiness, intent, world, proactive, protection }) {
  if (!readiness?.ready) return protection.userMessage;
  if (proactive.shouldSpeak) return proactive.topAction.message;
  if (protection.risks.length) return protection.userMessage;
  return `I understand. Your intent is ${intent.intent}. I checked the world signals and can guide the next safe step. ${intent.nextQuestion}`;
}
