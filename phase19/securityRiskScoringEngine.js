
export function runSecurityRiskScoringEngine({ privacy = {}, memoryReview = {}, operations = {}, request = "" } = {}) {
  let score = 0.12;
  if (privacy.requiresConsent) score += 0.28;
  if ((privacy.sensitiveSignals || []).length) score += Math.min(0.3, privacy.sensitiveSignals.length * 0.1);
  if ((memoryReview.candidateMemories || []).length > 2) score += 0.12;
  if (/urgent|asap|now|immediately/.test(String(request).toLowerCase())) score += 0.08;
  if (operations.incident?.severity === "high") score += 0.25;

  const riskScore = Math.min(1, score);
  const threshold = Number(process.env.SECURITY_RISK_THRESHOLD || 0.72);

  return {
    layer: "security_risk_scoring_engine",
    riskScore,
    threshold,
    riskLevel: riskScore >= threshold ? "high" : riskScore >= 0.45 ? "medium" : "low",
    action: riskScore >= threshold ? "block_and_review" : riskScore >= 0.45 ? "review_before_execution" : "allow_background_preparation",
    createdAt: new Date().toISOString()
  };
}
