
export function runIntegrationReadinessMatrix({ env = process.env } = {}) {
  const integrations = [
    item("supabase", Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY), "memory, logs, approvals, tenants"),
    item("openai", Boolean(env.OPENAI_API_KEY), "voice, reasoning, streaming intelligence"),
    item("stripe", Boolean(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY), "payments and subscriptions"),
    item("calendar", Boolean(env.GOOGLE_CALENDAR_CLIENT_ID && env.GOOGLE_CALENDAR_CLIENT_SECRET), "calendar holds and scheduling"),
    item("email", Boolean(env.SENDGRID_API_KEY || env.EMAIL_PROVIDER_API_KEY), "drafts and approved outbound messages"),
    item("maps", Boolean(env.GOOGLE_MAPS_API_KEY || env.MAPBOX_ACCESS_TOKEN), "routing, places, logistics"),
    item("vendor_search", Boolean(env.VENDOR_SEARCH_API_KEY), "marketplace/vendor discovery")
  ];

  const ready = integrations.filter((x) => x.ready).length;
  const score = Math.round((ready / integrations.length) * 100);

  return {
    layer: "integration_readiness_matrix",
    integrations,
    readinessScore: score,
    status: score >= 85 ? "deployment_ready" : score >= 55 ? "staging_ready" : "needs_configuration",
    createdAt: new Date().toISOString()
  };
}

function item(id, ready, purpose) {
  return {
    id,
    ready,
    purpose,
    status: ready ? "ready" : "needs_env"
  };
}
