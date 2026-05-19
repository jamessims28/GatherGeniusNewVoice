const defaultSplits = {
  Wedding: { Venue: 0.30, Catering: 0.40, DJ: 0.08, Rentals: 0.12, Lighting: 0.05, Contingency: 0.05 },
  "Corporate Experience": { Venue: 0.35, Catering: 0.35, AV: 0.12, Rentals: 0.08, Staffing: 0.05, Contingency: 0.05 },
  "Backyard BBQ": { Venue: 0.10, Catering: 0.55, DJ: 0.08, Rentals: 0.17, Lighting: 0.03, Contingency: 0.07 },
  General: { Venue: 0.32, Catering: 0.38, DJ: 0.10, Rentals: 0.10, Contingency: 0.10 }
};

export function buildBudgetPlan(intent) {
  const splits = defaultSplits[intent.eventType] || defaultSplits.General;
  return Object.entries(splits).map(([category, pct]) => ({
    category,
    percent: pct,
    targetAmount: Math.round(intent.budget * pct)
  }));
}
