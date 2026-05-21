
export function buildHumanRelationshipGraph({ userKey = "anonymous_preview", request = "", history = [], memory = {} } = {}) {
  const text = [request, ...history.map(h => h.text || "")].join(" ").toLowerCase();
  const nodes = Array.isArray(memory.relationshipNodes) ? [...memory.relationshipNodes] : [];

  const observations = [
    /family|cousin|aunt|uncle|mother|father|kids|children/.test(text) ? ["relationship_context", "family"] : null,
    /vendor|provider|dj|catering|venue/.test(text) ? ["relationship_context", "vendor"] : null,
    /investor|funding|capital|pitch/.test(text) ? ["relationship_context", "investor"] : null,
    /premium|luxury|elite|exclusive/.test(text) ? ["spending_psychology", "premium_value"] : null,
    /safe|secure|trusted|proof|verify/.test(text) ? ["trust_style", "proof_first"] : null,
    /quick|fast|asap|urgent/.test(text) ? ["communication_pacing", "fast"] : null,
    /calm|simple|stress|overwhelmed/.test(text) ? ["emotional_need", "reassurance"] : null
  ].filter(Boolean);

  observations.forEach(([type, value]) => {
    const existing = nodes.find(n => n.type === type && n.value === value);
    if (existing) {
      existing.confidence = Math.min(0.99, Number(existing.confidence || 0.65) + 0.04);
      existing.updatedAt = new Date().toISOString();
    } else {
      nodes.push({ id: `${type}_${Date.now()}_${Math.random().toString(16).slice(2)}`, userKey, type, value, confidence: 0.72, createdAt: new Date().toISOString() });
    }
  });

  return {
    layer: "human_relationship_graph",
    userKey,
    nodes,
    trustScore: nodes.some(n => n.type === "trust_style" && n.value === "proof_first") ? 0.68 : 0.78,
    toneAdaptation: nodes.some(n => n.type === "emotional_need") ? "reassuring" : "warm_direct",
    relationshipSummary: nodes.slice(-6).map(n => `${n.type}:${n.value}`).join(", ") || "relationship graph learning"
  };
}
