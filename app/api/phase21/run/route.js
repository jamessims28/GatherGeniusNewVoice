
import { NextResponse } from "next/server";
import { runFinalProductionReleaseCore } from "../../../../lib/phase21/finalProductionReleaseCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runFinalProductionReleaseCore({
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
    await supabase.from("gg_final_production_release_runs").insert({
      tenant_id: body.tenantId || "default",
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      integration: result.integration,
      investor: result.investor,
      release: result.release,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
