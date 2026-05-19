const pool = [
  { id: "venue-1", role: "Venue", name: "Venue Luxe Hall", price: 3500, reliability: 96, responseHours: 2, cancellationRisk: 2, rating: 4.9 },
  { id: "venue-2", role: "Venue", name: "Backup Estate Venue", price: 3700, reliability: 91, responseHours: 4, cancellationRisk: 4, rating: 4.7 },
  { id: "catering-1", role: "Catering", name: "Fresh Flame Catering", price: 4800, reliability: 94, responseHours: 3, cancellationRisk: 3, rating: 4.8 },
  { id: "catering-2", role: "Catering", name: "Backup Premier Catering", price: 5100, reliability: 90, responseHours: 4, cancellationRisk: 5, rating: 4.6 },
  { id: "dj-1", role: "DJ", name: "Elite Sound DJs", price: 900, reliability: 95, responseHours: 1, cancellationRisk: 2, rating: 4.9 },
  { id: "dj-2", role: "DJ", name: "Backup Sound Collective", price: 1000, reliability: 92, responseHours: 3, cancellationRisk: 3, rating: 4.7 },
  { id: "rentals-1", role: "Rentals", name: "Premier Event Rentals", price: 1800, reliability: 91, responseHours: 4, cancellationRisk: 4, rating: 4.6 },
  { id: "rentals-2", role: "Rentals", name: "Backup Rental House", price: 1900, reliability: 89, responseHours: 5, cancellationRisk: 5, rating: 4.5 },
  { id: "lighting-1", role: "Lighting", name: "GlowPro Lighting", price: 1100, reliability: 90, responseHours: 5, cancellationRisk: 5, rating: 4.6 },
  { id: "lighting-2", role: "Lighting", name: "Backup Light Lab", price: 1200, reliability: 88, responseHours: 6, cancellationRisk: 5, rating: 4.4 },
  { id: "av-1", role: "AV", name: "Pro AV Collective", price: 1400, reliability: 91, responseHours: 4, cancellationRisk: 4, rating: 4.6 },
  { id: "av-2", role: "AV", name: "Backup AV Team", price: 1500, reliability: 88, responseHours: 5, cancellationRisk: 5, rating: 4.4 }
];

export function vendorScore(vendor, targetAmount = 0) {
  const priceFit = targetAmount ? Math.max(0, 100 - Math.abs(vendor.price - targetAmount) / targetAmount * 100) : 80;
  return Math.round(vendor.reliability * 0.38 + priceFit * 0.24 + (100 - vendor.cancellationRisk * 10) * 0.20 + Math.max(0, 100 - vendor.responseHours * 10) * 0.10 + vendor.rating * 10 * 0.08);
}

export function selectVendorStack(intent, budgetPlan) {
  const neededRoles = budgetPlan
    .filter((item) => !["Contingency", "Staffing"].includes(item.category))
    .map((item) => item.category === "Entertainment" ? "DJ" : item.category);

  const primaryVendors = [];
  const backupVendors = [];

  for (const role of neededRoles) {
    const target = budgetPlan.find((item) => item.category === role)?.targetAmount || 0;
    const candidates = pool
      .filter((vendor) => vendor.role === role)
      .map((vendor) => ({ ...vendor, score: vendorScore(vendor, target) }))
      .sort((a, b) => b.score - a.score);

    if (candidates[0]) primaryVendors.push(candidates[0]);
    if (candidates[1]) backupVendors.push(candidates[1]);
  }

  return { primaryVendors, backupVendors, vendorPoolUsed: pool.length };
}
