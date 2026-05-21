
export function runInvestorIntelligenceLayer({ executionGraph = {}, swarm = [], predictions = [], metrics = {} } = {}) {
  const totalNodes = executionGraph.nodes?.length || 0;
  const blocked = executionGraph.nodes?.filter(n => n.status === "awaiting_confirmation").length || 0;
  const activeAgents = swarm.filter(a => a.status === "active").length;

  return {
    layer: "investor_intelligence_layer",
    executionSuccessPotential: totalNodes ? Math.round(((totalNodes - blocked) / totalNodes) * 100) : 100,
    activeAgents,
    orchestrationVolume: totalNodes,
    protectedActions: blocked,
    automationSavingsSignal: `${Math.max(1, activeAgents * 12)} minutes estimated saved`,
    revenueReadiness: Boolean(process.env.STRIPE_SECRET_KEY),
    aiOperationalEfficiency: predictions.length ? "protective" : "stable",
    investorSummary: "GatherGenius is moving from assistant behavior toward protected real-world autonomous orchestration."
  };
}
