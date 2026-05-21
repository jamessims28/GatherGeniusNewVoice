
export function runRetentionOptimizationEngine({ growth = {}, memory = {}, usage = {} } = {}) {
  const loops = [
    { id: "memory_continuity", recommendation: "Remind users Genius remembers preferences and protected outcomes." },
    { id: "weekly_outcome_review", recommendation: "Prepare weekly summary of plans, approvals, risks, and completed actions." },
    { id: "ambient_check_in", recommendation: "Use polite proactive check-ins only when value is clear." }
  ];

  if (growth.signals?.premiumSignal) {
    loops.push({ id: "premium_value_recap", recommendation: "Show how Genius saved time, reduced risk, or improved outcome quality." });
  }

  return {
    layer: "retention_optimization_engine",
    loops,
    retentionScore: Math.min(100, 45 + loops.length * 12 + (memory.optimizationHistory?.length ? 10 : 0)),
    reviewRequired: true
  };
}
