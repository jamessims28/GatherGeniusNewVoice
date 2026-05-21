
export function updateContinuousOptimizationMemory({ memory = {}, outcome = {}, learning = {}, tuning = {} } = {}) {
  const history = [
    ...(memory.optimizationHistory || []),
    {
      outcomeScore: outcome.outcomeScore,
      grade: outcome.grade,
      improvements: learning.improvements,
      tuningSummary: tuning.summary,
      at: new Date().toISOString()
    }
  ].slice(-200);

  const patterns = {
    ...(memory.optimizationPatterns || {}),
    lowLatencyEvents: history.filter((item) => item.improvements?.some((x) => x.type === "latency")).length,
    protectionEvents: history.filter((item) => item.improvements?.some((x) => x.type === "protection")).length,
    clarityEvents: history.filter((item) => item.improvements?.some((x) => x.type === "clarity")).length,
    executionEvents: history.filter((item) => item.improvements?.some((x) => x.type === "execution")).length
  };

  return {
    layer: "continuous_optimization_memory",
    optimizationHistory: history,
    optimizationPatterns: patterns,
    summary: `Optimization memory updated with ${history.length} historical run(s).`
  };
}
