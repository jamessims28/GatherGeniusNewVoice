
import { NextResponse } from "next/server";
import { runRealtimeHumanConversationLayer } from "../../../../lib/human-conversation/realtimeHumanConversationLayer";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.query || body.request || "";

  if (!text) {
    return NextResponse.json({ ok: false, message: "Genius needs a conversation request first." }, { status: 400 });
  }

  const result = await runRealtimeHumanConversationLayer({
    text,
    history: body.history || [],
    memory: body.memory || null,
    relationshipMemory: body.relationshipMemory || {},
    location: body.location || "Virginia",
    proposedAction: body.proposedAction || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("human_conversation_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request: text,
      response_text: result.response,
      emotion: result.emotion,
      world: result.world,
      recommendation: result.recommendation,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
