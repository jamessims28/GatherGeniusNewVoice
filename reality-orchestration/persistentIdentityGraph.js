
export function runPersistentIdentityGraph({ userKey = "anonymous_preview", request = "", memory = {}, human = {} } = {}) {
  const nodes = Array.isArray(memory.nodes) ? [...memory.nodes] : [];
  const edges = Array.isArray(memory.edges) ? [...memory.edges] : [];

  const observations = [
    human.spendingPsychology ? { type: "spending_psychology", value: human.spendingPsychology } : null,
    human.trustMode ? { type: "trust_mode", value: human.trustMode } : null,
    human.communicationStyle ? { type: "communication_style", value: human.communicationStyle } : null,
    /family|cousin|aunt|uncle|kids|children/i.test(request) ? { type: "relationship_context", value: "family" } : null,
    /business|investor|vendor|client/i.test(request) ? { type: "relationship_context", value: "business" } : null
  ].filter(Boolean);

  observations.forEach(obs => {
    const existing = nodes.find(n => n.type === obs.type && n.value === obs.value);
    if (existing) {
      existing.confidence = Math.min(0.99, Number(existing.confidence || 0.6) + 0.05);
      existing.updatedAt = new Date().toISOString();
    } else {
      nodes.push({
        id: `${obs.type}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        userKey,
        type: obs.type,
        value: obs.value,
        confidence: 0.72,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  });

  return {
    layer: "persistent_identity_graph",
    userKey,
    nodes,
    edges,
    summary: nodes.slice(-5).map(n => `${n.type}:${n.value}`).join(", ") || "identity graph learning"
  };
}
