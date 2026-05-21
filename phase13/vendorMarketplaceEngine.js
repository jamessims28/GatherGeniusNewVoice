
export function runVendorMarketplaceEngine({ request = "", location = "Virginia", memory = {} } = {}) {
  const t = String(request).toLowerCase();
  const categories = [
    /dj|music/.test(t) ? "dj" : null,
    /catering|food|chef|bbq/.test(t) ? "catering" : null,
    /tent/.test(t) ? "tent_rental" : null,
    /chairs|tables/.test(t) ? "tables_chairs" : null,
    /venue|hall|space/.test(t) ? "venue" : null,
    /hotel|lodging/.test(t) ? "hotel" : null,
    /transport|shuttle|car/.test(t) ? "transportation" : null
  ].filter(Boolean);

  const leads = categories.map((category) => ({
    id: `lead_${category}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    category,
    location,
    status: "prepared",
    leadFeeUsd: Number(process.env.VENDOR_LEAD_FEE_USD || 25),
    requiresApproval: true
  }));

  return {
    layer: "vendor_marketplace_engine",
    categories,
    leads,
    marketplaceReady: leads.length > 0,
    takeRatePercent: Number(process.env.MARKETPLACE_TAKE_RATE_PERCENT || 10),
    message: leads.length ? `${leads.length} vendor lead opportunity(s) prepared.` : "No vendor marketplace category detected."
  };
}
