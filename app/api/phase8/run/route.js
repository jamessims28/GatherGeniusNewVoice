
import { NextResponse } from "next/server";
import { runAutonomousRealityNetwork } from "../../../../lib/phase8/autonomousRealityNetwork";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runAutonomousRealityNetwork({
    request,
    userKey: body.userKey || "anonymous_preview",
    location: body.location || "Virginia",
    history: body.history || [],
    memory: body.memory || {},
    permissions: body.permissions || {},
    devices: body.devices || []
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_autonomous_reality_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      voice: result.voice,
      swarm: result.swarm,
      world: result.world,
      execution_graph: result.executionGraph,
      relationship_graph: result.relationship,
      predictions: result.predictions,
      ambient: result.ambient,
      investor: result.investor,
      devices: result.devices,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
