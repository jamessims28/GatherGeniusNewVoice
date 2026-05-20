
import { NextResponse } from "next/server";
import { runAmbientOperatingCoreV1 } from "../../../../lib/ambient-core/ambientOperatingCoreV1";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.query || body.request || "";

  if (!text) {
    return NextResponse.json({ ok: false, message: "Genius needs a spoken request first." }, { status: 400 });
  }

  const result = await runAmbientOperatingCoreV1({
    text,
    readiness: body.readiness || {},
    location: body.location || "Virginia"
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("ambient_core_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request: text,
      readiness: body.readiness || {},
      intent: result.intent,
      world: result.world,
      proactive: result.proactive,
      protection: result.protection,
      response_text: result.response,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
