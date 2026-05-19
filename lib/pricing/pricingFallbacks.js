
export const fallbackPricingRanges = {
  venue: { low: 1500, mid: 3500, high: 8500, unit: "booking" },
  catering: { low: 18, mid: 42, high: 95, unit: "per guest" },
  dj: { low: 450, mid: 900, high: 2200, unit: "booking" },
  rentals: { low: 2, mid: 6, high: 15, unit: "per item" },
  photography: { low: 700, mid: 1800, high: 5000, unit: "booking" },
  hotel: { low: 95, mid: 165, high: 320, unit: "per room/night" },
  transportation: { low: 350, mid: 900, high: 2500, unit: "booking" },
  decor: { low: 500, mid: 1800, high: 6500, unit: "booking" },
  general: { low: 500, mid: 1500, high: 5000, unit: "booking" }
};

export function buildFallbackPricing(intent) {
  const range = fallbackPricingRanges[intent.category] || fallbackPricingRanges.general;
  const quantity = intent.quantity || (range.unit === "per guest" ? 100 : 1);
  const multiplier = range.unit.startsWith("per") ? quantity : 1;

  return {
    mode: "fallback-estimate",
    source: "GatherGenius baseline pricing model",
    category: intent.category,
    location: intent.location,
    query: intent.query,
    quantity,
    unit: range.unit,
    low: Math.round(range.low * multiplier),
    mid: Math.round(range.mid * multiplier),
    high: Math.round(range.high * multiplier),
    confidence: "estimated",
    note: "Live pricing API keys are not configured, so this is a safe planning estimate."
  };
}
