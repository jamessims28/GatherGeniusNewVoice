
import { NextResponse } from "next/server";
import { buildConversationExchange, shouldInterruptAssistant } from "../../../../lib/conversation/interactiveExchangeEngine";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.input || body.query || "";
  const userKey = body.userKey || "anonymous_preview";

  if (!text) {
    return NextResponse.json({ ok: false, message: "Genius needs something to respond to." }, { status: 400 });
  }

  const exchange = buildConversationExchange({
    text,
    history: body.history || [],
    humanProfile: body.humanProfile || null
  });

  const interruption = shouldInterruptAssistant({
    incomingSpeech: text,
    assistantSpeaking: Boolean(body.assistantSpeaking)
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("conversation_exchanges").insert({
      user_key: userKey,
      input_text: text,
      conversation_type: exchange.conversationType,
      turn_state: exchange.turnState,
      active_listening: exchange.listening,
      follow_up: exchange.followUp,
      memory_item: exchange.memory,
      interruption,
      result_data: exchange
    }).catch(() => null);
  }

  return NextResponse.json({
    ok: true,
    exchange,
    interruption,
    response: exchange.suggestedResponse
  });
}
