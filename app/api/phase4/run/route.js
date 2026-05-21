
import { NextResponse } from "next/server";
import { runPhase4AgentMeshExecutionCore } from "../../../../lib/phase4/phase4AgentMeshExecutionCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Genius needs a request first." }, { status: 400 });
  }

  const result = await runPhase4AgentMeshExecutionCore({
    request,
    human: body.human || {},
    world: body.world || {},
    memory: body.memory || {},
    permissions: body.permissions || {},
    location: body.location || "Virginia"
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("phase4_execution_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      agents: result.agents,
      connectors: result.connectors,
      execution_queue: result.executionQueue,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
