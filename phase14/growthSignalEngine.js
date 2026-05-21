
export function runGrowthSignalEngine({ request = "", ecosystem = {}, marketplace = {}, memory = {} } = {}) {
  const t = String(request).toLowerCase();

  const signals = {
    acquisitionIntent: /market|ads|social|growth|users|customers|viral|traffic/.test(t),
    retentionIntent: /return|repeat|memory|habit|daily|weekly|loyal/.test(t),
    referralIntent: /share|invite|family|friends|network|referral/.test(t),
    revenueIntent: /revenue|subscription|payment|vendor|marketplace|pricing/.test(t),
    investorIntent: /investor|funding|valuation|pitch|traction/.test(t),
    premiumSignal: /premium|luxury|elite|exclusive/.test(t)
  };

  const growthScore =
    (signals.acquisitionIntent ? 20 : 5) +
    (signals.retentionIntent ? 18 : 5) +
    (signals.referralIntent ? 16 : 4) +
    (signals.revenueIntent ? 22 : 6) +
    (signals.investorIntent ? 16 : 4) +
    (signals.premiumSignal ? 8 : 3);

  return {
    layer: "growth_signal_engine",
    mode: process.env.GROWTH_INTELLIGENCE_MODE || "shadow",
    signals,
    growthScore,
    category: growthScore >= 75 ? "high_growth" : growthScore >= 50 ? "growth_ready" : "early_signal",
    createdAt: new Date().toISOString()
  };
}
