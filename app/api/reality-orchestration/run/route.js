
import { NextResponse } from "next/server";
import { runGatherGeniusRealityOrchestrationCore } from "../../../../lib/reality-orchestration/gatherGeniusRealityOrchestrationCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Genius needs a request first." }, { status: 400 });
  }

  const result = await runGatherGeniusRealityOrchestrationCore({
    request,
    location: body.location || "Virginia",
    userKey: body.userKey || "anonymous_preview",
    history: body.history || [],
    memory: body.memory || {},
    permissions: body.permissions || {},
    userState: body.userState || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("reality_orchestration_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      reality: result.reality,
      predictive: result.predictive,
      human: result.human,
      ambient: result.ambient,
      agents: result.agents,
      execution: result.execution,
      trust: result.trust,
      identity_graph: result.identity,
      protection: result.protection,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
