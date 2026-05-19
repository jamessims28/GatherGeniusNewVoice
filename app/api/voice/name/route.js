import { NextResponse } from "next/server";
import { buildVoiceResponseForName } from "../../../../lib/voice/voiceIdentity";

export async function POST(req) {
  const body = await req.json();
  const input = body.input || body.transcript || "";
  return NextResponse.json({
    ok: true,
    ...buildVoiceResponseForName(input)
  });
}
