
export function runAcquisitionStrategyEngine({ growth = {}, request = "" } = {}) {
  const strategies = [];

  if (growth.signals?.acquisitionIntent || growth.category !== "early_signal") {
    strategies.push(item("voice_demo_funnel", "Use the moving orb voice demo as the primary conversion hook."));
    strategies.push(item("premium_event_use_case", "Target premium family events, vendors, and private gatherings as early wedge."));
  }

  if (growth.signals?.referralIntent) {
    strategies.push(item("family_referral_loop", "Create invite flow where one planner brings family members and vendors into the network."));
  }

  if (growth.signals?.investorIntent) {
    strategies.push(item("investor_demo_path", "Show orchestration runs, approval safety, and revenue signals as live traction artifacts."));
  }

  if (!strategies.length) strategies.push(item("baseline_onboarding", "Focus on first-run experience and one clear use case."));

  return {
    layer: "acquisition_strategy_engine",
    strategies,
    primaryStrategy: strategies[0]?.id,
    requiresReview: true
  };
}

function item(id, recommendation) {
  return { id, recommendation, status: "prepared", createdAt: new Date().toISOString() };
}
