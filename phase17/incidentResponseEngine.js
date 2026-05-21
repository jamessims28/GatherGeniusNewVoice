
export function runIncidentResponseEngine({ commands = [], reliability = {}, request = "" } = {}) {
  const incidentCommand = commands.find((cmd) => cmd.id === "incident_response");
  const incidents = reliability.incidents || [];

  const severity =
    incidents.includes("error_budget_exceeded") ? "high" :
    incidents.includes("uptime_below_target") ? "high" :
    incidents.includes("latency_watch") ? "medium" :
    incidentCommand ? "medium" :
    "low";

  const playbook = severity === "high"
    ? ["freeze_external_actions", "alert_admin", "capture_logs", "prepare_rollback", "communicate_status"]
    : severity === "medium"
      ? ["capture_logs", "monitor_latency", "prepare_status_update", "review_recent_changes"]
      : ["continue_monitoring", "record_health_snapshot"];

  return {
    layer: "incident_response_engine",
    severity,
    incidents,
    playbook,
    autoExecute: false,
    requiresReview: process.env.INCIDENT_AUTOMATION_REQUIRES_REVIEW !== "false",
    status: severity === "low" ? "standby" : "prepared_for_review"
  };
}
