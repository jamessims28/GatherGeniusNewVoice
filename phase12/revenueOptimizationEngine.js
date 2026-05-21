
export function runRevenueOptimizationEngine({ opportunities = [], trust = {} } = {}) {
  const recommendations = opportunities.map((op) => {
    const plan =
      op.type === "premium_plan_upgrade" ? "Pro / Premium" :
      op.type === "vendor_lead_revenue" ? "Vendor Marketplace" :
      op.type === "subscription_conversion" ? "Subscription" :
      "Retention";

    return {
      opportunityType: op.type,
      plan,
      recommendation: op.recommendation,
      requiresReview: process.env.REVENUE_OPTIMIZATION_REQUIRES_REVIEW !== "false",
      status: "prepared"
    };
  });

  return {
    layer: "revenue_optimization_engine",
    recommendations,
    revenueReadiness: recommendations.some(r => ["Pro / Premium", "Subscription", "Vendor Marketplace"].includes(r.plan)),
    reviewMode: process.env.REVENUE_OPTIMIZATION_REQUIRES_REVIEW !== "false"
  };
}
