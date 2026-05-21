import { evaluatePresence } from "./presenceEngine";
import { predictCoordinationRisks } from "./predictiveCoordination";
import { mapEmotionalState } from "./emotionalMapping";
import { runAgentNetwork } from "./agentNetwork";
import { updateBehaviorModel } from "./behaviorModel";
import { selectAmbientSurface } from "./ambientSurface";
import { simulateNegotiation } from "./negotiationEngine";
import { evaluateTrustSafety } from "./trustSafetyEngine";
import { getLivingSparkState } from "./livingSpark";
import { computeOutcomeConsciousness } from "./outcomeConsciousness";

export function runEvolutionStack(context = {}) {
  const presence = evaluatePresence(context);
  const prediction = predictCoordinationRisks(context);
  const emotion = mapEmotionalState(context);
  const agents = runAgentNetwork(context);
  const behavior = updateBehaviorModel({ current: context.intent || context });
  const ambient = selectAmbientSurface(context);
  const negotiation = simulateNegotiation({ total: context.total || 12800, demand: context.demand, flexibility: context.flexibility });
  const trust = evaluateTrustSafety(context);
  const spark = getLivingSparkState({ presence, trust, confidence: context.confidence || 94 });
  const outcome = computeOutcomeConsciousness({ intent: context.intent || {}, prediction, trust, negotiation });

  return {
    ok: true,
    stackVersion: "20-year-ai-v1",
    layers: { presence, prediction, emotion, agents, behavior, ambient, negotiation, trust, spark, outcome },
    visibleState: spark.state,
    nextBestAction: outcome.nextBestAction,
    userMessage: outcome.needsRecovery
      ? "I found a risk and prepared a safer path."
      : "I’m evolving the experience quietly and keeping the outcome protected."
  };
}
