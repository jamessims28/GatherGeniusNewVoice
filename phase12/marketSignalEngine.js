
export function runMarketSignalEngine({ request = "", location = "Virginia", memory = {} } = {}) {
  const t = String(request).toLowerCase();

  const signals = {
    demand: /family|event|vendor|venue|booking|gathering|party|cookout/.test(t) ? "event_coordination" : "general_coordination",
    revenueIntent: /payment|pricing|subscription|vendor|marketplace|revenue|funding|investor/.test(t),
    localMarket: location,
    premiumPositioning: /premium|luxury|elite|exclusive/.test(t),
    budgetPressure: /budget|save|cheap|affordable/.test(t),
    vendorNeed: /vendor|dj|catering|tent|chairs|tables|hotel|venue/.test(t)
  };

  return {
    layer: "market_signal_engine",
    mode: process.env.MARKET_INTELLIGENCE_MODE || "shadow",
    signals,
    marketReadinessScore:
      (signals.revenueIntent ? 25 : 10) +
      (signals.vendorNeed ? 25 : 10) +
      (signals.premiumPositioning ? 20 : 10) +
      (memory.preferences?.premium ? 15 : 5),
    createdAt: new Date().toISOString()
  };
}
