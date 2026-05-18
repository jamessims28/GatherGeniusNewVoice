import { parseEventIntent } from "./intentParser";
import { buildBudgetPlan } from "./budgetEngine";
import { selectVendorStack } from "./vendorEngine";
import { calculateExecutionConfidence } from "./confidenceEngine";

export function buildExperienceLockFromPrompt(prompt) {
  const intent = parseEventIntent(prompt);
  const budgetPlan = buildBudgetPlan(intent);
  const { primaryVendors, backupVendors, vendorPoolUsed } = selectVendorStack(intent, budgetPlan);
  const subtotal = primaryVendors.reduce((sum, vendor) => sum + Number(vendor.price || 0), 0);
  const platformFee = Math.round(subtotal * 0.08);
  const total = subtotal + platformFee;
  const deposit = Math.round(total * 0.15);
  const confidenceScore = calculateExecutionConfidence({ intent, primaryVendors, backupVendors, total });

  return {
    lockCode: `GG-LOCK-${Date.now()}`,
    status: "ready_to_lock",
    name: `${intent.eventType} — Guaranteed Experience Outcome`,
    intent,
    budgetPlan,
    primaryVendors,
    backupVendors,
    vendorPoolUsed,
    subtotal,
    platformFee,
    total,
    deposit,
    confidenceScore,
    backupCoverage: `${backupVendors.length}/${primaryVendors.length} roles covered`,
    replacementWindow: "2 hours",
    decisionsLeftForCustomer: 1,
    guaranteeStatus: confidenceScore >= 88 ? "guaranteed" : "review_required",
    createdAt: new Date().toISOString()
  };
}
