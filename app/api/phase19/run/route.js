
import { NextResponse } from "next/server";
import { runAdaptiveMemorySecurityCore } from "../../../../lib/phase19/adaptiveMemorySecurityCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runAdaptiveMemorySecurityCore({
    request,
    tenantId: body.tenantId || "default",
    userKey: body.userKey || "anonymous_preview",
    role: body.role || "admin",
    memory: body.memory || {},
    permissions: body.permissions || {},
    metrics: body.metrics || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_adaptive_memory_security_runs").insert({
      tenant_id: body.tenantId || "default",
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      operations: result.operations,
      memory_review: result.memoryReview,
      privacy: result.privacy,
      security: result.security,
      governance: result.governance,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
