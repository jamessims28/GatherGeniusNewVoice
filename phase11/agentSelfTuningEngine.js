
export function tuneAgentMesh({ agents = [], outcome = {}, learning = {} } = {}) {
  const tuned = agents.map((agent) => {
    let priority = agent.priority || 50;
    let tuning = "maintain";

    if (learning.improvements?.some((item) => item.type === "protection") && /protect|safety|trust|risk/i.test(agent.id || agent.name || "")) {
      priority += 12;
      tuning = "increase_priority";
    }

    if (learning.improvements?.some((item) => item.type === "latency") && /analytics|investor|background/i.test(agent.id || agent.name || "")) {
      priority -= 8;
      tuning = "defer_when_latency_sensitive";
    }

    if (learning.improvements?.some((item) => item.type === "execution") && /execution|planner|logistics/i.test(agent.id || agent.name || "")) {
      priority += 10;
      tuning = "increase_execution_granularity";
    }

    return {
      ...agent,
      priority: Math.max(1, Math.min(100, priority)),
      tuning
    };
  });

  return {
    layer: "agent_self_tuning_engine",
    tunedAgents: tuned,
    tuningMode: learning.requiresReview ? "review_required" : "auto_shadow",
    summary: `${tuned.filter((agent) => agent.tuning !== "maintain").length} agent(s) tuned in shadow mode.`
  };
}
