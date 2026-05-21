
export function runReliabilityMonitor({ metrics = {}, readiness = {} } = {}) {
  const uptime = typeof metrics.uptime === "number" ? metrics.uptime : 99.5;
  const latency = typeof metrics.latencyMs === "number" ? metrics.latencyMs : 420;
  const errorRate = typeof metrics.errorRatePercent === "number" ? metrics.errorRatePercent : 0.4;
  const budget = Number(process.env.ERROR_BUDGET_PERCENT || 1);

  const incidents = [];
  if (uptime < 99) incidents.push("uptime_below_target");
  if (latency > 1500) incidents.push("latency_watch");
  if (errorRate > budget) incidents.push("error_budget_exceeded");
  if (readiness.status === "not_ready") incidents.push("launch_readiness_failed");

  return {
    layer: "reliability_monitor",
    uptime,
    latencyMs: latency,
    errorRatePercent: errorRate,
    errorBudgetPercent: budget,
    incidents,
    reliabilityStatus: incidents.length ? "watch" : "healthy",
    checkedAt: new Date().toISOString()
  };
}
