
import { NextResponse } from "next/server";
import { runExperienceOperatingLayer } from "../../../../lib/operating-layer/experienceOperatingLayer";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Tell Genius what real-world outcome to coordinate." }, { status: 400 });
  }

  const result = await runExperienceOperatingLayer({
    request,
    userKey: body.userKey || "anonymous_preview",
    currentLock: body.currentLock || null
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("experience_operating_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      confidence: result.finalDecision.confidence,
      next_action: result.finalDecision.nextAction,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
