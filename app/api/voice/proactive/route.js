import { NextResponse } from "next/server";
import { shouldSpeakProactively, getProactiveMessage } from "../../../../lib/voice/proactiveVoiceEngine";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const trigger = body.trigger || "idle_checkin";
  const check = shouldSpeakProactively({
    enabled: body.enabled !== false,
    lastSpokenAt: body.lastSpokenAt || 0,
    trigger,
    cooldownMs: body.cooldownMs || 45000
  });

  return NextResponse.json({
    ok: true,
    allowed: check.allowed,
    reason: check.reason || null,
    trigger,
    message: check.moment?.message || getProactiveMessage(trigger)
  });
}
