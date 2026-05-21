
import { createAmbientEvent, routeAmbientEvent } from "./ambientEventBus";

export function runDistributedAmbientRuntime({ request = "", userKey = "anonymous_preview", devices = [] } = {}) {
  const events = [
    createAmbientEvent({ type: "human_request", source: "landing_or_voice", payload: { request, userKey }, priority: "high" }),
    createAmbientEvent({ type: "memory_sync", source: "memory_runtime", payload: { userKey }, priority: "normal" }),
    createAmbientEvent({ type: "world_sync", source: "reality_runtime", payload: { location: "Virginia" }, priority: "normal" }),
    createAmbientEvent({ type: "device_sync", source: "device_runtime", payload: { devices }, priority: "normal" })
  ];

  return {
    layer: "distributed_ambient_runtime",
    runtimeMode: "event_driven_background",
    userKey,
    events,
    routedEvents: events.map(routeAmbientEvent),
    activeServices: [
      "orchestration_runtime",
      "memory_runtime",
      "synchronization_runtime",
      "prediction_runtime",
      "execution_runtime",
      "relationship_runtime",
      "observability_runtime"
    ],
    createdAt: new Date().toISOString()
  };
}
