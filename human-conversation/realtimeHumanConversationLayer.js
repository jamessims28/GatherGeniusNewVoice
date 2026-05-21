
import { detectEmotionalState, getVoiceSettingsForEmotion } from "./emotionalVoiceAdaptation";
import { updateSessionMemory } from "./sessionMemoryContinuity";
import { buildRelationshipMemory } from "./relationshipMemory";
import { runLiveOrchestrationAgents } from "./liveOrchestrationAgents";
import { runLiveWorldApiHub } from "./liveWorldApiHub";
import { runAutonomousRecommendationEngine } from "./autonomousRecommendationEngine";

export async function runRealtimeHumanConversationLayer({
  text = "",
  history = [],
  memory = null,
  relationshipMemory = {},
  location = "Virginia",
  proposedAction = {}
} = {}) {
  const emotion = detectEmotionalState({ text, history });
  const voice = getVoiceSettingsForEmotion(emotion);
  const sessionMemory = updateSessionMemory({
    memory: memory || undefined,
    turn: { role: "You", text }
  });
  const relationship = buildRelationshipMemory({
    conversation: [...history, { role: "You", text }],
    existing: relationshipMemory
  });
  const world = await runLiveWorldApiHub({ location, request: text });
  const agents = runLiveOrchestrationAgents({
    human: { ...emotion, stress: emotion.stress ? 0.85 : 0.2, hesitant: emotion.hesitant },
    memory: sessionMemory,
    world,
    proposedAction
  });
  const recommendation = runAutonomousRecommendationEngine({
    human: { ...emotion, stress: emotion.stress ? 0.85 : 0.2 },
    memory: sessionMemory,
    world,
    agents
  });

  const response = buildHumanConversationResponse({ text, emotion, relationship, recommendation });

  return {
    ok: true,
    layer: "realtime_human_conversation_layer",
    capabilities: [
      "full_duplex_voice",
      "natural_interruption_handling",
      "emotional_voice_adaptation",
      "continuous_ambient_listening",
      "memory_continuity_between_sessions",
      "proactive_conversation_timing",
      "live_orchestration_agents",
      "persistent_relationship_memory",
      "live_world_state_apis",
      "autonomous_recommendation_engine"
    ],
    emotion,
    voice,
    sessionMemory,
    relationship,
    world,
    agents,
    recommendation,
    response,
    createdAt: new Date().toISOString()
  };
}

function buildHumanConversationResponse({ emotion, recommendation }) {
  const opener =
    emotion.state === "reassuring" ? "I hear you. I’ll keep this calm and simple." :
    emotion.state === "energized" ? "I hear the excitement. Let’s shape this into something strong." :
    emotion.state === "focused_fast" ? "I understand. I’ll move quickly and keep it protected." :
    "I understand.";

  return `${opener} ${recommendation.recommendation}`;
}
