
export const orchestrationAgents = [
  { id: "readiness_agent", role: "verify voice and system readiness" },
  { id: "intent_agent", role: "understand what the human wants" },
  { id: "world_agent", role: "monitor live world signals" },
  { id: "memory_agent", role: "maintain long-term continuity" },
  { id: "protection_agent", role: "prevent bad outcomes" },
  { id: "execution_agent", role: "move safe actions forward" }
];

export function runOrchestrationAgents({ readiness, intent, world, memory, protection } = {}) {
  return orchestrationAgents.map((agent) => {
    let status = "watching";
    let recommendation = "continue monitoring";

    if (agent.id === "readiness_agent" && !readiness?.ready) {
      status = "blocked";
      recommendation = "enable voice before proceeding";
    }

    if (agent.id === "intent_agent" && intent?.missing?.length) {
      status = "active";
      recommendation = "ask one clarifying question";
    }

    if (agent.id === "world_agent" && world?.riskLevel === "elevated") {
      status = "active";
      recommendation = "prepare real-world backup";
    }

    if (agent.id === "memory_agent" && memory?.nodes?.length) {
      status = "active";
      recommendation = `use memory: ${memory.summary}`;
    }

    if (agent.id === "protection_agent" && protection?.risks?.length) {
      status = "active";
      recommendation = protection.userMessage;
    }

    if (agent.id === "execution_agent" && protection?.canProceed) {
      status = "ready";
      recommendation = "execute next safe step";
    }

    return { ...agent, status, recommendation };
  });
}
