
export const persistentAgentClasses = {
  humanCoordination: ["relationship_agent", "family_agent", "emotional_stabilizer", "communication_pacing_agent"],
  operational: ["logistics_agent", "finance_agent", "scheduling_agent", "workflow_agent", "procurement_agent"],
  protection: ["trust_agent", "safety_agent", "compliance_agent", "execution_gating_agent", "risk_agent"],
  intelligence: ["prediction_agent", "optimization_agent", "investor_agent", "analytics_agent", "world_monitoring_agent"]
};

export function runAmbientIntelligenceMesh({ request = "", eventRoutes = [], memory = {} } = {}) {
  const activeRoutes = new Set(eventRoutes.flatMap(route => route.routes || []));
  const agents = Object.entries(persistentAgentClasses).flatMap(([group, names]) =>
    names.map(name => {
      let status = "watching";
      let output = "background monitoring";

      if (activeRoutes.has("trust_router") && group === "protection") { status = "active"; output = "protecting approval and execution path"; }
      if (activeRoutes.has("reality_state") && name === "world_monitoring_agent") { status = "active"; output = "synchronizing world-state"; }
      if (activeRoutes.has("memory_fabric") && name === "relationship_agent") { status = "active"; output = "updating relationship memory"; }
      if (/pricing|cost|budget|payment/.test(request.toLowerCase()) && name === "finance_agent") { status = "active"; output = "optimizing financial path"; }
      if (/schedule|calendar|time|date/.test(request.toLowerCase()) && name === "scheduling_agent") { status = "active"; output = "preparing schedule coordination"; }

      return { group, id: name, status, output };
    })
  );

  return {
    layer: "ambient_intelligence_mesh",
    agents,
    activeAgents: agents.filter(agent => agent.status === "active").length,
    meshMode: "persistent_background_agents"
  };
}
