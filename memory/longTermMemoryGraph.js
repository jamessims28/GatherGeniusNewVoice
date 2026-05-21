
export function buildMemoryNode({ type, value, confidence = 0.75, source = "conversation" }) {
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    value,
    confidence,
    source,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function updateMemoryGraph({ graph = { nodes: [], edges: [] }, observation = {} } = {}) {
  const nodes = Array.isArray(graph.nodes) ? [...graph.nodes] : [];
  const edges = Array.isArray(graph.edges) ? [...graph.edges] : [];

  const candidates = [];

  if (observation.intent?.spending) candidates.push(buildMemoryNode({ type: "spending_style", value: observation.intent.spending, confidence: 0.82 }));
  if (observation.intent?.emotion) candidates.push(buildMemoryNode({ type: "emotional_pattern", value: observation.intent.emotion, confidence: 0.7 }));
  if (observation.intent?.location) candidates.push(buildMemoryNode({ type: "preferred_location", value: observation.intent.location, confidence: 0.65 }));
  if (observation.intent?.intent) candidates.push(buildMemoryNode({ type: "common_intent", value: observation.intent.intent, confidence: 0.72 }));

  for (const candidate of candidates) {
    const existing = nodes.find((node) => node.type === candidate.type && node.value === candidate.value);
    if (existing) {
      existing.confidence = Math.min(0.99, existing.confidence + 0.04);
      existing.updatedAt = new Date().toISOString();
    } else {
      nodes.push(candidate);
    }
  }

  for (let i = 0; i < candidates.length - 1; i += 1) {
    edges.push({
      from: candidates[i].id,
      to: candidates[i + 1].id,
      relation: "observed_with",
      weight: 0.4,
      createdAt: new Date().toISOString()
    });
  }

  return {
    layer: "long_term_memory_graph",
    nodes,
    edges,
    summary: summarizeGraph(nodes)
  };
}

function summarizeGraph(nodes) {
  const top = [...nodes].sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  return top.map((node) => `${node.type}:${node.value}`).join(", ") || "No stable memory yet.";
}
