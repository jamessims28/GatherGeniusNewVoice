
const agentDefinitions = [
  { id: "emotional_agent", role: "detect comfort and adapt tone" },
  { id: "logistics_agent", role: "coordinate timing, dependencies, and movement" },
  { id: "pricing_agent", role: "watch pricing and budget fit" },
  { id: "provider_agent", role: "watch provider reliability and backup paths" },
  { id: "risk_agent", role: "predict operational problems" },
  { id: "protection_agent", role: "protect outcome and safety" },
  { id: "continuity_agent", role: "preserve memory and context" },
  { id: "negotiation_agent", role: "prepare negotiation opportunities" }
];

export function runOperationalAgentMesh({ humanTwin, worldState, assistance } = {}) {
  const outputs = agentDefinitions.map((agent) => {
    let status = "monitoring";
    let recommendation = "continue monitoring";

    if (agent.id === "emotional_agent" && humanTwin?.model?.communicationStyle === "supportive-human") {
      status = "active";
      recommendation = "slow voice and reduce choices";
    }

    if (agent.id === "risk_agent" && worldState?.worldRisk !== "stable") {
      status = "active";
      recommendation = "prepare contingency path";
    }

    if (agent.id === "provider_agent" && assistance?.actions?.some((a) => a.id.includes("provider"))) {
      status = "active";
      recommendation = "warm provider backup";
    }

    return { ...agent, status, recommendation };
  });

  return {
    layer: "multi_agent_operational_intelligence",
    agents: outputs,
    activeAgents: outputs.filter((agent) => agent.status === "active").map((agent) => agent.id),
    unifiedRecommendation:
      outputs.some((agent) => agent.status === "active")
        ? "Genius should proactively guide the user with a protected path."
        : "Genius can stay quiet and ready."
  };
}
