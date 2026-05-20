
import { NextResponse } from "next/server";
import { runPhase123OperatingUpgrade } from "../../../../lib/phase123/phase123OperatingUpgrade";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.query || body.request || "";

  if (!text) {
    return NextResponse.json({ ok: false, message: "Genius needs a request first." }, { status: 400 });
  }

  const result = await runPhase123OperatingUpgrade({
    text,
    readiness: body.readiness || { ready: true },
    location: body.location || "Virginia",
    history: body.history || [],
    memory: body.memory || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("phase123_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request: text,
      response_text: result.response,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
