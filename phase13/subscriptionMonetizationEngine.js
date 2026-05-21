
export function runSubscriptionMonetizationEngine({ request = "", user = {}, usage = {} } = {}) {
  const t = String(request).toLowerCase();

  const plans = [
    { id: "starter", name: "Starter", monthlyUsd: 19, features: ["basic voice", "simple planning", "limited memory"] },
    { id: "premium", name: "Premium", monthlyUsd: Number(process.env.PREMIUM_PLAN_MONTHLY_USD || 49), features: ["reality orchestration", "vendor preparation", "memory continuity", "approval queue"] },
    { id: "enterprise", name: "Enterprise", monthlyUsd: Number(process.env.ENTERPRISE_PLAN_MONTHLY_USD || 499), features: ["admin controls", "team workflows", "investor metrics", "custom integrations"] }
  ];

  const recommendedPlan =
    /enterprise|company|team|investor|vendor network/.test(t) ? "enterprise" :
    /premium|luxury|vendor|event|payment|calendar/.test(t) ? "premium" :
    "starter";

  return {
    layer: "subscription_monetization_engine",
    plans,
    recommendedPlan,
    upgradeSignal: recommendedPlan !== "starter",
    requiresApproval: true
  };
}
