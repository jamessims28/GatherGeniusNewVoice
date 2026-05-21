
export function matchEventVendors({ intent = {}, blueprint = {}, location = "Virginia" } = {}) {
  const needs = blueprint.blueprint?.sections?.find((s) => s.id === "vendors")?.items || [];
  const vendors = needs.map((need) => ({
    id: `vendor_${slug(need)}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    category: need,
    location,
    status: "candidate_prepared",
    confidence: 0.72,
    outreachStatus: "approval_required",
    source: "local_vendor_connector_placeholder"
  }));

  return {
    layer: "vendor_matcher",
    vendors,
    totalCandidates: vendors.length,
    connectorStatus: "ready_for_real_provider_api",
    approvalRequired: true
  };
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
