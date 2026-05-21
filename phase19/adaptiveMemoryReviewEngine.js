
export function runAdaptiveMemoryReviewEngine({ request = "", memory = {}, userKey = "anonymous_preview" } = {}) {
  const text = String(request).toLowerCase();

  const candidateMemories = [
    /premium|luxury|elite|exclusive/.test(text) ? memoryItem("preference", "prefers_premium_experiences") : null,
    /family|cousin|aunt|uncle|kids|children/.test(text) ? memoryItem("context", "family_coordination_context") : null,
    /secure|privacy|safe|trusted|protect/.test(text) ? memoryItem("trust", "privacy_and_safety_sensitive") : null,
    /vendor|marketplace|payment|subscription/.test(text) ? memoryItem("business", "marketplace_monetization_context") : null
  ].filter(Boolean);

  return {
    layer: "adaptive_memory_review_engine",
    userKey,
    candidateMemories,
    reviewRequired: process.env.MEMORY_REVIEW_REQUIRED !== "false",
    retentionDays: Number(process.env.MEMORY_RETENTION_DAYS || 365),
    canAutoCommit: process.env.MEMORY_REVIEW_REQUIRED === "false",
    message: candidateMemories.length
      ? `${candidateMemories.length} memory update(s) prepared for review.`
      : "No durable memory update needed."
  };
}

function memoryItem(type, value) {
  return {
    id: `mem_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    value,
    confidence: 0.74,
    status: "review_pending",
    createdAt: new Date().toISOString()
  };
}
