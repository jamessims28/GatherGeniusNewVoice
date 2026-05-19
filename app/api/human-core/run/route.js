
import { NextResponse } from "next/server";
import { runAutonomousHumanCore } from "../../../../lib/human-intelligence/autonomousHumanCore";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const result = runAutonomousHumanCore({
    text: body.text || body.query || "",
    intent: body.intent || {},
    comfort: body.comfort || {},
    currentLock: body.currentLock || null,
    prior: body.prior || {}
  });

  return NextResponse.json(result);
}
