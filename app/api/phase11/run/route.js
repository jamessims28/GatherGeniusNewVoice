
import { NextResponse } from "next/server";
import { runSelfImprovingOrchestrationCore } from "../../../../lib/phase11/selfImprovingOrchestrationCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runSelfImprovingOrchestrationCore({
    request,
    userKey: body.userKey || "anonymous_preview",
    memory: body.memory || {},
    devices: body.devices || [],
    permissions: body.permissions || {},
    role: body.role || "user",
    userFeedback: body.userFeedback || {},
    metrics: body.metrics || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_self_improving_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      fabric: result.fabric,
      outcome: result.outcome,
      learning: result.learning,
      tuning: result.tuning,
      optimization_memory: result.optimizationMemory,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
