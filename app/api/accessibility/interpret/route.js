import { NextResponse } from "next/server";
import { findEventType, findVibe } from "../../../../lib/accessibility/templates";

export async function POST(req) {
  const body = await req.json();
  const input = body.input || {};
  const eventType = findEventType(input.eventType);
  const vibe = findVibe(input.vibe);
  const guests = Number(input.guests || 120);
  const budget = Number(input.budget || 20000);
  const location = input.location || "Virginia";
  const prompt = `Build a ${vibe.prompt} ${eventType.prompt} for ${guests} guests under $${budget} near ${location}.`;

  return NextResponse.json({
    ok: true,
    message: "Tap input converted correctly.",
    intent: { inputMode: body.mode || "tap", eventType: eventType.id, vibe: vibe.id, guests, budget, location, prompt }
  });
}
