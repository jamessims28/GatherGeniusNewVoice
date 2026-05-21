
import { NextResponse } from "next/server";
import { runGovernanceComplianceCore } from "../../../../lib/phase18/governanceComplianceCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runGovernanceComplianceCore({
    request,
    tenantId: body.tenantId || "default",
    userKey: body.userKey || "anonymous_preview",
    role: body.role || "admin",
    seats: body.seats || 1,
    memory: body.memory || {},
    location: body.location || "Virginia",
    permissions: body.permissions || {},
    metrics: body.metrics || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_governance_compliance_runs").insert({
      tenant_id: body.tenantId || "default",
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      operations: result.operations,
      governance: result.governance,
      privacy: result.privacy,
      audit: result.audit,
      boundary: result.boundary,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
