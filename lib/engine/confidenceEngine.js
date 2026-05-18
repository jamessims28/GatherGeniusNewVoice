export function calculateExecutionConfidence({ intent, primaryVendors, backupVendors, total }) {
  if (!primaryVendors?.length) return 0;
  const avgReliability = primaryVendors.reduce((sum, v) => sum + Number(v.reliability || 0), 0) / primaryVendors.length;
  const avgResponseHours = primaryVendors.reduce((sum, v) => sum + Number(v.responseHours || 8), 0) / primaryVendors.length;
  const avgCancellationRisk = primaryVendors.reduce((sum, v) => sum + Number(v.cancellationRisk || 5), 0) / primaryVendors.length;
  const budgetFit = total <= intent.budget ? 8 : -10;
  const backupCoverage = backupVendors.length >= primaryVendors.length ? 8 : backupVendors.length / primaryVendors.length * 8;
  const responseScore = avgResponseHours <= 4 ? 5 : avgResponseHours <= 8 ? 1 : -5;
  const riskPenalty = avgCancellationRisk * 1.5;
  return Math.max(50, Math.min(98, Math.round(avgReliability + budgetFit + backupCoverage + responseScore - riskPenalty)));
}
