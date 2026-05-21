
import { runRealityStateEngine } from "./realityStateEngine";
import { runPredictiveOutcomeEngine } from "./predictiveOutcomeEngine";
import { runHumanBehaviorModel } from "./humanBehaviorModel";
import { runAmbientPresenceLayer } from "./ambientPresenceLayer";
import { runMultiAgentCivilizationLayer } from "./multiAgentCivilizationLayer";
import { runAutonomousRealityExecution } from "./autonomousRealityExecution";
import { runTrustArchitectureLayer } from "./trustArchitectureLayer";
import { runPersistentIdentityGraph } from "./persistentIdentityGraph";
import { runInvisibleInterfaceLayer } from "./invisibleInterfaceLayer";
import { runOutcomeProtectionLayer } from "./outcomeProtectionLayer";

export async function runGatherGeniusRealityOrchestrationCore({
  request = "",
  location = "Virginia",
  userKey = "anonymous_preview",
  history = [],
  memory = {},
  permissions = {},
  userState = {}
} = {}) {
  const reality = await runRealityStateEngine({ request, location, userState, memory });
  const human = runHumanBehaviorModel({ request, history, memory });
  const predictive = runPredictiveOutcomeEngine({ reality, memory });
  const ambient = runAmbientPresenceLayer({ reality, human, predictions: predictive.predictions });
  const agents = runMultiAgentCivilizationLayer({ request, reality, human, predictions: predictive.predictions });
  const execution = runAutonomousRealityExecution({ request, predictions: predictive.predictions, agents, permissions });
  const trust = runTrustArchitectureLayer({ execution, permissions });
  const identity = runPersistentIdentityGraph({ userKey, request, memory, human });
  const invisibleInterface = runInvisibleInterfaceLayer({
    listening: true,
    speaking: ambient.shouldSpeak,
    risk: predictive.predictions.length > 0,
    shouldSpeak: ambient.shouldSpeak
  });
  const protection = runOutcomeProtectionLayer({ predictions: predictive.predictions, human, reality, trust });

  const response = buildResponse({ ambient, protection, predictive, trust });

  return {
    ok: true,
    layer: "gathergenius_reality_orchestration_core",
    name: "GatherGenius Reality Orchestration Core",
    reality,
    predictive,
    human,
    ambient,
    agents,
    execution,
    trust,
    identity,
    invisibleInterface,
    protection,
    response,
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ ambient, protection, predictive, trust }) {
  if (trust.confirmationRequiredCount > 0) {
    return `I prepared the background plan. ${trust.confirmationRequiredCount} action(s) need your confirmation before execution.`;
  }
  if (protection.interventions?.length) {
    return `${protection.message} I found ${predictive.predictions.length} item(s) to protect.`;
  }
  if (ambient.shouldSpeak) {
    return ambient.message;
  }
  return "I’m quietly coordinating the background intelligence and the current path looks stable.";
}
