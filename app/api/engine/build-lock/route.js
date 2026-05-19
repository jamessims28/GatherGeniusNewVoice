import { NextResponse } from "next/server";
import { buildExperienceLockFromPrompt } from "../../../../lib/engine/eventBuilder";
import { enrichPromptWithBackgroundTemplates } from "../../../../lib/engine/backgroundTemplateEngine";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const prompt = body.prompt || "Build my experience";
  const backgroundTemplates = enrichPromptWithBackgroundTemplates(prompt);
  const experienceLock = buildExperienceLockFromPrompt(prompt);
  experienceLock.backgroundTemplates = backgroundTemplates;
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("event_locks").insert({
      lock_code: experienceLock.lockCode,
      prompt,
      event_type: experienceLock.intent.eventType,
      location: experienceLock.intent.location,
      guests: experienceLock.intent.guests,
      budget: experienceLock.intent.budget,
      total: experienceLock.total,
      deposit: experienceLock.deposit,
      confidence_score: experienceLock.confidenceScore,
      guarantee_status: experienceLock.guaranteeStatus,
      status: experienceLock.status,
      event_lock_data: experienceLock
    });

    if (error) {
      return NextResponse.json({ ok: true, mode: "database-warning", message: "Experience built. Database insert warning: " + error.message, eventLock: experienceLock, experienceLock });
    }
  }

  return NextResponse.json({ ok: true, message: "Experience built correctly. One decision left.", eventLock: experienceLock, experienceLock });
}
