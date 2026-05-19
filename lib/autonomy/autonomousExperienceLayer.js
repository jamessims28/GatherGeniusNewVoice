
import { realWorldExamples } from "./realWorldExamples";
import { runAmbientIntelligence } from "./ambientIntelligence";
import { mapContinuousReality } from "./worldStateEngine";
import { buildHumanTwinModel } from "./humanTwinModel";
import { planAutonomousAssistance } from "./autonomousAssistance";
import { runOperationalAgentMesh } from "./operationalAgentMesh";
import { buildComfortAwareVoice } from "./comfortAwareVoice";
import { ownOutcome } from "./outcomeOwnership";
import { evaluatePermissionSafeAutonomy, summarizePermissionBoundary } from "./permissionBoundaries";

export async function runAutonomousExperienceLayer({
  text = "",
  location = "Virginia",
  permissions = {},
  memory = {},
  history = [],
  context = {}
} = {}) {
  const worldState = await mapContinuousReality({ location });
  const ambient = runAmbientIntelligence({ text, context, world: { weather: worldState.weather } });
  const humanTwin = buildHumanTwinModel({ text, memory, history });
  const assistance = planAutonomousAssistance({ ambient, worldState, humanTwin, permissions });
  const agentMesh = runOperationalAgentMesh({ humanTwin, worldState, assistance });
  const comfortVoice = buildComfortAwareVoice({ humanTwin, ambient });
  const outcomeOwnership = ownOutcome({ assistance, agentMesh, worldState });
  const permissionDecisions = evaluatePermissionSafeAutonomy({ proposedActions: assistance.actions, permissions });
  const permissionBoundary = summarizePermissionBoundary(permissionDecisions);

  const operatingLayer = buildUnifiedOperatingLayer({
    worldState,
    ambient,
    humanTwin,
    assistance,
    agentMesh,
    comfortVoice,
    outcomeOwnership,
    permissionBoundary
  });

  const lifeCoordination = buildLifeCoordinationLayer({ operatingLayer, humanTwin, outcomeOwnership });

  return {
    ok: true,
    stack: "99_percent_autonomous_experience_layer",
    examplesUsed: realWorldExamples,
    layers: {
      ambient,
      continuousReality: worldState,
      humanTwin,
      autonomousAssistance: assistance,
      agentMesh,
      comfortVoice,
      outcomeOwnership,
      permissionBoundary,
      operatingLayer,
      lifeCoordination
    },
    finalResponse: buildFinalResponse({ operatingLayer, lifeCoordination, comfortVoice }),
    createdAt: new Date().toISOString()
  };
}

function buildUnifiedOperatingLayer(parts) {
  const blockers = [];
  if (parts.permissionBoundary?.blocked?.length) blockers.push("permission_needed");
  if (parts.continuousReality?.weather?.riskLevel === "high") blockers.push("weather_risk");

  const canProceed = blockers.length === 0;
  const confidence =
    canProceed ? 0.96 :
    blockers.length === 1 ? 0.88 :
    0.78;

  return {
    layer: "unified_real_world_operating_layer",
    canProceed,
    confidence,
    blockers,
    systemsUnified: [
      "voice",
      "memory",
      "permissions",
      "weather",
      "geocoding",
      "human behavior",
      "risk",
      "provider operations",
      "protection",
      "outcome delivery"
    ],
    nextAction: canProceed ? "proceed_quietly_with_next_safe_step" : "ask_only_for_blocking_confirmation"
  };
}

function buildLifeCoordinationLayer({ operatingLayer, humanTwin, outcomeOwnership }) {
  return {
    layer: "ai_life_coordination_layer",
    active: true,
    supportMode:
      humanTwin.model.timingBehavior === "urgent" ? "fast protected support" :
      humanTwin.model.communicationStyle === "supportive-human" ? "calm supportive guidance" :
      "quiet intelligent assistance",
    longRangeMemoryTarget: [
      "preferences",
      "trust thresholds",
      "spending psychology",
      "timing patterns",
      "social patterns",
      "communication style"
    ],
    coordinationGoal:
      operatingLayer.canProceed
        ? "reduce friction and move outcome forward"
        : "protect user from risk before proceeding",
    outcomeOwnership: outcomeOwnership.ownershipStatement
  };
}

function buildFinalResponse({ operatingLayer, lifeCoordination, comfortVoice }) {
  if (operatingLayer.canProceed) {
    return {
      speak: true,
      message: `I’m watching the background and can move the next safe step forward. Confidence is ${Math.round(operatingLayer.confidence * 100)} percent.`,
      voice: comfortVoice.settings,
      action: operatingLayer.nextAction
    };
  }

  return {
    speak: true,
    message: `I found something that needs confirmation before I move forward. I’ll keep it simple and guide you through only what matters.`,
    voice: comfortVoice.settings,
    action: operatingLayer.nextAction,
    blockers: operatingLayer.blockers
  };
}
