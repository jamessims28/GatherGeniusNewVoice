
export function runLaunchReadinessEngine({ request = "", tenant = {}, env = process.env } = {}) {
  const checks = [
    check("supabase_configured", Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)),
    check("openai_configured", Boolean(env.OPENAI_API_KEY)),
    check("stripe_optional", Boolean(env.STRIPE_SECRET_KEY), "optional"),
    check("rollback_enabled", env.ROLLBACK_ENABLED !== "false"),
    check("deployment_stage_set", Boolean(env.DEPLOYMENT_STAGE)),
    check("tenant_context", Boolean(tenant.tenantId || tenant.tenant_id || tenant.id))
  ];

  const required = checks.filter((item) => item.level !== "optional");
  const passed = required.filter((item) => item.passed).length;
  const score = Math.round((passed / Math.max(1, required.length)) * 100);

  return {
    layer: "launch_readiness_engine",
    checks,
    readinessScore: score,
    stage: env.DEPLOYMENT_STAGE || "staging",
    status: score >= 90 ? "ready_for_review" : score >= 70 ? "staging_ready" : "not_ready",
    requiresReview: env.LAUNCH_READINESS_REQUIRES_REVIEW !== "false"
  };
}

function check(id, passed, level = "required") {
  return {
    id,
    passed,
    level,
    status: passed ? "pass" : level === "optional" ? "optional_missing" : "fail"
  };
}
