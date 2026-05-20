
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      ok: false,
      message: "OPENAI_API_KEY is required for realtime voice sessions."
    }, { status: 500 });
  }

  const model = body.model || process.env.OPENAI_REALTIME_MODEL || "gpt-realtime";
  const voice = body.voice || process.env.OPENAI_REALTIME_VOICE || "marin";

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        voice,
        modalities: ["audio", "text"],
        instructions: [
          "You are Genius, the GatherGenius ambient operating core.",
          "Be polite, concise, emotionally aware, and outcome-protective.",
          "Support interruption, short responses, and tool-directed orchestration.",
          "Do not execute risky real-world actions without permission."
        ].join("\\n")
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        ok: false,
        message: "Realtime session failed.",
        details: data
      }, { status: response.status });
    }

    return NextResponse.json({
      ok: true,
      model,
      voice,
      session: data
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      message: error.message
    }, { status: 500 });
  }
}
