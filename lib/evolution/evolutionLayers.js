export const evolutionLayers = [
  {
    id: "presence",
    number: 1,
    name: "Presence Intelligence",
    description: "Continuously senses context, urgency, friction, and coordination risk.",
    state: "active",
    signals: ["voice", "timing", "provider status", "payment state", "interaction speed"]
  },
  {
    id: "predictive_coordination",
    number: 2,
    name: "Predictive Coordination",
    description: "Predicts execution problems before they happen and prepares alternate paths.",
    state: "active",
    signals: ["provider delay", "weather risk", "timeline compression", "cancellation risk"]
  },
  {
    id: "emotional_mapping",
    number: 3,
    name: "Emotional Intelligence Mapping",
    description: "Adapts voice, UI intensity, and decision load based on stress or confidence.",
    state: "active",
    signals: ["hesitation", "tone hints", "silence", "rapid changes", "uncertainty"]
  },
  {
    id: "multi_agent_network",
    number: 4,
    name: "Multi-Agent Intelligence Network",
    description: "Runs specialist agents under one calm GatherGenius spark.",
    state: "active",
    agents: ["Experience", "Budget", "Logistics", "Trust", "Recovery", "Negotiation", "Safety"]
  },
  {
    id: "behavior_model",
    number: 5,
    name: "Behavioral Intelligence Modeling",
    description: "Learns user decision patterns, trust thresholds, budget comfort, and communication style.",
    state: "active",
    signals: ["budget range", "selection speed", "preferred vibe", "region", "past locks"]
  },
  {
    id: "spatial_ambient",
    number: 6,
    name: "Spatial + Ambient Computing",
    description: "Prepares the interface to move beyond screens into ambient devices and environments.",
    state: "prototype",
    surfaces: ["voice", "mobile", "car", "earbuds", "wearables", "spatial displays"]
  },
  {
    id: "negotiation",
    number: 7,
    name: "Autonomous Negotiation",
    description: "Suggests negotiation moves for pricing, schedule, deposits, and provider availability.",
    state: "simulated",
    targets: ["price", "schedule", "deposit", "availability", "packages"]
  },
  {
    id: "trust_safety",
    number: 8,
    name: "Trust + Safety Intelligence",
    description: "Detects reliability, cancellation, fraud, payment, and safety risks.",
    state: "active",
    signals: ["cancellation risk", "payment anomaly", "provider score", "response delay"]
  },
  {
    id: "living_spark",
    number: 9,
    name: "Living Spark Identity",
    description: "The spark becomes the emotional visible identity of the system.",
    state: "active",
    states: ["idle", "listening", "thinking", "building", "warning", "success"]
  },
  {
    id: "outcome_consciousness",
    number: 10,
    name: "Outcome Consciousness",
    description: "Continuously reorganizes execution paths toward a successful protected outcome.",
    state: "active",
    outputs: ["next best action", "risk reduction", "provider reroute", "budget reallocation"]
  }
];

export function getEvolutionLayer(id) {
  return evolutionLayers.find((layer) => layer.id === id);
}
