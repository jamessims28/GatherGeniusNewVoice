
export function runOutcomeProtectionLayer({ predictions = [], human = {}, reality = {}, trust = {} } = {}) {
  const interventions = [];

  for (const prediction of predictions) {
    if (prediction.type === "weather_disruption") interventions.push({ action: "prepare_backup_location", priority: "high" });
    if (prediction.type === "timeline_pressure") interventions.push({ action: "compress_to_next_safe_step", priority: "high" });
    if (prediction.type === "budget_pressure") interventions.push({ action: "protect_budget_before_upgrades", priority: "medium" });
    if (prediction.type === "decision_fatigue") interventions.push({ action: "reduce_choices_to_one", priority: "high" });
    if (prediction.type === "vendor_uncertainty") interventions.push({ action: "prepare_backup_vendor", priority: "medium" });
  }

  if (Number(human.stress || 0) > 0.7) {
    interventions.push({ action: "slow_down_and_reassure", priority: "high" });
  }

  if (trust.confirmationRequiredCount > 0) {
    interventions.push({ action: "request_confirmation_before_external_action", priority: "critical" });
  }

  return {
    layer: "outcome_protection_layer",
    protected: true,
    interventions,
    protectionMode: interventions.some(i => i.priority === "critical") ? "permission_protection" : interventions.length ? "active_protection" : "quiet_protection",
    message:
      interventions.length ? "I’m protecting the outcome before moving forward." : "The current path looks stable."
  };
}
