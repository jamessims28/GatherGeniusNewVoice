
import { getSupabaseAdmin } from "../supabaseAdmin";

export async function getInvestorMetrics({ userKey = "anonymous_preview" } = {}) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      source: "fallback",
      users: 1,
      approvalsPending: 0,
      actionsPrepared: 0,
      actionsApproved: 0,
      blockedActions: 0,
      avgLatencyMs: 0,
      revenueReady: false
    };
  }

  const [approvals, observability, audit] = await Promise.all([
    supabase.from("gg_approval_queue").select("*").eq("user_key", userKey),
    supabase.from("gg_observability_events").select("*").eq("user_key", userKey).limit(500),
    supabase.from("gg_audit_trail").select("*").eq("user_key", userKey).limit(500)
  ]);

  const approvalData = approvals.data || [];
  const obsData = observability.data || [];
  const auditData = audit.data || [];

  const latencyValues = obsData
    .map((event) => event.event_data?.metric?.durationMs)
    .filter((value) => typeof value === "number");

  return {
    source: "supabase",
    approvalsPending: approvalData.filter((item) => item.status === "needs_approval").length,
    actionsPrepared: approvalData.filter((item) => item.status === "auto_prepared").length,
    actionsApproved: approvalData.filter((item) => item.status === "approved").length,
    blockedActions: auditData.filter((item) => String(item.status).includes("blocked") || String(item.status).includes("denied")).length,
    avgLatencyMs: latencyValues.length ? Math.round(latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length) : 0,
    auditEvents: auditData.length,
    observabilityEvents: obsData.length,
    revenueReady: Boolean(process.env.STRIPE_SECRET_KEY)
  };
}
