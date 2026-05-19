
import { NextResponse } from "next/server";
import { runVoiceOutcomePipeline } from "../../../../lib/voice-pipeline/voiceOutcomePipeline";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.query || body.request || "";

  if (!text) {
    return NextResponse.json({ ok: false, message: "Genius needs a voice request first." }, { status: 400 });
  }

  const result = await runVoiceOutcomePipeline({
    text,
    userKey: body.userKey || "anonymous_preview",
    currentLock: body.currentLock || null
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("voice_outcome_pipeline_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request: text,
      confidence: result.confidence,
      next_action: result.nextAction,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
