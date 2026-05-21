
import { NextResponse } from "next/server";
import { runDistributedAmbientFabric } from "../../../../lib/phase10/distributedAmbientFabric";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runDistributedAmbientFabric({
    request,
    userKey: body.userKey || "anonymous_preview",
    memory: body.memory || {},
    devices: body.devices || [],
    permissions: body.permissions || {},
    role: body.role || "user"
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_distributed_ambient_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      runtime: result.runtime,
      memory_fabric: result.memoryFabric,
      mesh: result.mesh,
      device_sync: result.deviceSync,
      optimization: result.optimization,
      execution: result.execution,
      trust: result.trust,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
