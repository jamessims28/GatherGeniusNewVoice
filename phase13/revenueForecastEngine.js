
export function runRevenueForecastEngine({ marketplace = {}, subscription = {}, opportunity = {} } = {}) {
  const leadRevenue = (marketplace.leads || []).reduce((sum, lead) => sum + Number(lead.leadFeeUsd || 0), 0);
  const takeRate = Number(marketplace.takeRatePercent || 10) / 100;
  const estimatedVendorTransaction = marketplace.leads?.length ? marketplace.leads.length * 500 : 0;
  const takeRateRevenue = estimatedVendorTransaction * takeRate;

  const plan = subscription.plans?.find((p) => p.id === subscription.recommendedPlan);
  const subscriptionRevenue = subscription.upgradeSignal ? Number(plan?.monthlyUsd || 0) : 0;

  const monthlyPotential = Math.round(leadRevenue + takeRateRevenue + subscriptionRevenue);

  return {
    layer: "revenue_forecast_engine",
    leadRevenue,
    estimatedVendorTransaction,
    takeRateRevenue: Math.round(takeRateRevenue),
    subscriptionRevenue,
    monthlyPotential,
    annualizedPotential: monthlyPotential * 12,
    confidence: monthlyPotential > 500 ? 0.78 : monthlyPotential > 100 ? 0.64 : 0.48,
    reviewRequired: true
  };
}
