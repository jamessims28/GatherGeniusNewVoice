
export function runLiveConnectorRouter({ request = "", integrations = {} } = {}) {
  const t = String(request).toLowerCase();
  const routes = [];

  if (/payment|subscription|checkout|stripe/.test(t)) routes.push(route("stripe", "payment and subscription route"));
  if (/calendar|schedule|date|time/.test(t)) routes.push(route("calendar", "calendar scheduling route"));
  if (/email|message|vendor|outreach/.test(t)) routes.push(route("email", "approved outbound message route"));
  if (/map|route|traffic|location|venue/.test(t)) routes.push(route("maps", "logistics and places route"));
  if (/vendor|catering|dj|tent|chairs/.test(t)) routes.push(route("vendor_search", "vendor discovery route"));

  if (!routes.length) routes.push(route("supabase", "memory and orchestration persistence route"));

  return {
    layer: "live_connector_router",
    routes,
    executionMode: "prepare_only_until_approved",
    message: `${routes.length} live connector route(s) prepared.`
  };
}

function route(id, purpose) {
  return {
    id,
    purpose,
    status: "prepared",
    requiresApproval: id !== "supabase"
  };
}
