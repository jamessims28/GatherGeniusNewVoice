
export const liveHumanConversationAgents = [
  { id: "turn_taking_agent", role: "detect when to speak, wait, or stop" },
  { id: "emotion_agent", role: "adapt tone based on human state" },
  { id: "memory_agent", role: "preserve continuity across sessions" },
  { id: "world_agent", role: "watch world conditions and timing" },
  { id: "recommendation_agent", role: "suggest one best next step" },
  { id: "safety_agent", role: "block unsafe or unapproved actions" }
];

export function runLiveOrchestrationAgents({ human, memory, world, proposedAction } = {}) {
  return liveHumanConversationAgents.map((agent) => {
    let status = "watching";
    let output = "continue monitoring";

    if (agent.id === "turn_taking_agent" && human?.hesitant) {
      status = "active";
      output = "pause and ask one clarifying question";
    }

    if (agent.id === "emotion_agent" && human?.stress > 0.7) {
      status = "active";
      output = "slow down and reassure";
    }

    if (agent.id === "memory_agent" && memory?.summary) {
      status = "active";
      output = `use memory: ${memory.summary}`;
    }

    if (agent.id === "world_agent" && world?.riskLevel === "elevated") {
      status = "active";
      output = "prepare backup path";
    }

    if (agent.id === "recommendation_agent") {
      status = "ready";
      output = "produce one best next recommendation";
    }

    if (agent.id === "safety_agent" && proposedAction?.requiresConfirmation) {
      status = "blocked";
      output = "requires explicit confirmation";
    }

    return { ...agent, status, output };
  });
}
