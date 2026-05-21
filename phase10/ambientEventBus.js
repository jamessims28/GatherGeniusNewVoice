
export function createAmbientEvent({ type = "system", source = "unknown", payload = {}, priority = "normal" } = {}) {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    source,
    payload,
    priority,
    createdAt: new Date().toISOString()
  };
}

export function routeAmbientEvent(event = {}) {
  const routes = [];

  if (/weather|traffic|pricing|calendar|vendor|world/.test(event.type)) routes.push("reality_state");
  if (/memory|identity|relationship|preference/.test(event.type)) routes.push("memory_fabric");
  if (/approval|payment|booking|contract|external/.test(event.type)) routes.push("trust_router");
  if (/voice|emotion|human|conversation/.test(event.type)) routes.push("human_adaptation");
  if (/metric|investor|revenue|growth/.test(event.type)) routes.push("investor_intelligence");

  if (!routes.length) routes.push("orchestration_runtime");

  return {
    layer: "ambient_event_bus",
    event,
    routes,
    routedAt: new Date().toISOString()
  };
}
