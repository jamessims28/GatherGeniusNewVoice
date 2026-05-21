
const defaults = {
  venue_location: 1200,
  tables_chairs: 450,
  food_catering: 2200,
  weather_backup: 800,
  grills: 250,
  porta_potties: 400,
  trash_cleanup_supplies: 250,
  payment_invoice_provider: 0,
  calendar_invite_workflow: 0
};

export function priceEventPlan({ intent = {}, vendors = {}, blueprint = {} } = {}) {
  const guestCount = intent.guestCount || blueprint.blueprint?.guestCount || 100;
  const items = (vendors.vendors || []).map((vendor) => {
    const key = slug(vendor.category);
    const base = defaults[key] ?? Math.round(guestCount * 12);
    return {
      category: vendor.category,
      estimatedCost: base,
      confidence: vendor.confidence || 0.65,
      status: "estimate_pending_real_quote"
    };
  });

  const foodEstimate = Math.round(guestCount * (intent.eventType === "barbecue" ? 24 : 32));
  if (!items.some((item) => /food|catering/.test(item.category))) {
    items.push({ category: "food estimate", estimatedCost: foodEstimate, confidence: 0.7, status: "estimate_pending_real_quote" });
  }

  const subtotal = items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const contingency = Math.round(subtotal * 0.12);
  const total = subtotal + contingency;

  return {
    layer: "event_pricing_engine",
    items,
    subtotal,
    contingency,
    total,
    budget: intent.budget,
    budgetStatus: intent.budget ? (total <= intent.budget ? "within_budget" : "over_budget") : "no_budget_set",
    approvalRequiredBeforeSpend: true
  };
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
