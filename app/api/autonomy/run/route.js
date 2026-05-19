
import { NextResponse } from "next/server";
import { runAutonomousExperienceLayer } from "../../../../lib/autonomy/autonomousExperienceLayer";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.query || body.request || "";

  if (!text) {
    return NextResponse.json({ ok: false, message: "Genius needs a request or context first." }, { status: 400 });
  }

  const result = await runAutonomousExperienceLayer({
    text,
    location: body.location || "Virginia",
    permissions: body.permissions || {},
    memory: body.memory || {},
    history: body.history || [],
    context: body.context || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("autonomous_experience_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request: text,
      confidence: result.layers.operatingLayer.confidence,
      next_action: result.finalResponse.action,
      can_proceed: result.layers.operatingLayer.canProceed,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
