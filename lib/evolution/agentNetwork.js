const agents = [
  { id: "experience_agent", name: "Experience Agent", job: "understand intent and shape the outcome" },
  { id: "budget_agent", name: "Budget Agent", job: "optimize deposit, total cost, and allocation" },
  { id: "logistics_agent", name: "Logistics Agent", job: "coordinate timing, location, and dependencies" },
  { id: "trust_agent", name: "Trust Agent", job: "score provider reliability and risk" },
  { id: "recovery_agent", name: "Recovery Agent", job: "activate backups and recovery paths" },
  { id: "negotiation_agent", name: "Negotiation Agent", job: "suggest negotiation and pricing moves" },
  { id: "safety_agent", name: "Safety Agent", job: "detect safety, payment, and fraud risks" }
];

export function runAgentNetwork(context = {}) {
  return {
    layer: "multi_agent_network",
    agents: agents.map((agent) => ({
      ...agent,
      status: "ready",
      output: `${agent.name} is monitoring ${agent.job}.`
    })),
    unifiedResponse: "Specialist agents are working quietly under one GatherGenius spark.",
    nextBestAction: context.hasExperienceLock ? "lock experience" : "build protected first version"
  };
}
