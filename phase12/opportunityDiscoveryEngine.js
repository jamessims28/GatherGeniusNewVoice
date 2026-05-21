
export function runOpportunityDiscoveryEngine({ request = "", market = {}, routes = [] } = {}) {
  const opportunities = [];

  if (market.signals?.vendorNeed) opportunities.push(item("vendor_lead_revenue", "Capture vendor lead opportunity and potential marketplace fee."));
  if (market.signals?.premiumPositioning) opportunities.push(item("premium_plan_upgrade", "Recommend premium orchestration package when value is clear."));
  if (market.signals?.revenueIntent) opportunities.push(item("subscription_conversion", "Prepare subscription or plan recommendation."));
  if (market.marketReadinessScore >= 60) opportunities.push(item("investor_metric_signal", "Mark this workflow as revenue/traction relevant."));

  if (!opportunities.length) opportunities.push(item("engagement_learning", "Use this interaction to improve personalization and retention."));

  return {
    layer: "opportunity_discovery_engine",
    enabled: process.env.OPPORTUNITY_DISCOVERY_ENABLED !== "false",
    opportunities,
    opportunityScore: Math.min(100, market.marketReadinessScore + opportunities.length * 8)
  };
}

function item(type, recommendation) {
  return { type, recommendation, reviewRequired: true, createdAt: new Date().toISOString() };
}
