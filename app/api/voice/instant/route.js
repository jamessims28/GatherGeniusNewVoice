
import { NextResponse } from "next/server";
import { getInstantCommandResponse } from "../../../../lib/voice/instantResponseEngine";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || body.input || body.query || "";

  const instant = getInstantCommandResponse(text);

  return NextResponse.json({
    ok: true,
    instant,
    response: instant.response,
    intent: instant.intent,
    latencyMode: "instant-local"
  });
}
