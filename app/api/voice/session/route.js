import { NextResponse } from "next/server";
import { buildConversationSystemPrompt } from "../../../../lib/conversation/personality";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      mode: "missing-openai-key",
      message: "OPENAI_API_KEY is missing. Add it in Vercel environment variables to enable realtime voice."
    }, { status: 200 });
  }

  const model = process.env.OPENAI_REALTIME_MODEL || "gpt-4o-realtime-preview";
  const voice = process.env.OPENAI_VOICE || "alloy";
  const instructions = buildConversationSystemPrompt({
    approvedContext: body.approvedContext || "No approved context yet.",
    currentState: body.currentState || "voice-ready"
  });

  const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      voice,
      instructions,
      modalities: ["audio", "text"],
      input_audio_format: "pcm16",
      output_audio_format: "pcm16"
    })
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({
      ok: false,
      mode: "realtime-session-error",
      message: data?.error?.message || "Realtime session could not be created.",
      details: data
    }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    model,
    voice,
    session: data
  });
}
