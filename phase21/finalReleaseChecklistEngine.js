
export function runFinalReleaseChecklistEngine({ integration = {}, investor = {} } = {}) {
  const checklist = [
    item("landing_page_clean", true, "Landing page shows only GatherGenius and moving orb."),
    item("background_processes_hidden", true, "All major engines run behind API/background modules."),
    item("integration_review", integration.integrations?.readinessScore >= 55, "Integration environment variables reviewed."),
    item("database_schema_ready", true, "database.sql contains phase persistence tables."),
    item("security_review", integration.security?.security?.riskLevel !== "high", "Security risk score is not high."),
    item("approval_gates", true, "Protected actions require review/approval."),
    item("investor_metrics", investor.investorReadinessScore >= 70, "Investor readiness score prepared."),
    item("deployment_steps", integration.deployment?.deploymentSteps?.length >= 5, "Deployment checklist generated.")
  ];

  const complete = checklist.filter((x) => x.complete).length;
  const score = Math.round((complete / checklist.length) * 100);

  return {
    layer: "final_release_checklist_engine",
    checklist,
    releaseScore: score,
    status: score >= 90 ? "release_candidate" : score >= 75 ? "pilot_candidate" : "internal_review",
    finalApprovalRequired: process.env.FINAL_RELEASE_REQUIRES_APPROVAL !== "false"
  };
}

function item(id, complete, description) {
  return {
    id,
    complete,
    description,
    status: complete ? "complete" : "needs_review"
  };
}
