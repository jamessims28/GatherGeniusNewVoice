
import { NextResponse } from "next/server";
import { runAIEventOperatingSystem } from "../../../../lib/event-os/aiEventOperatingSystem";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runAIEventOperatingSystem({
    request,
    userKey: body.userKey || "anonymous_preview",
    memory: body.memory || {},
    location: body.location || process.env.EVENT_OS_DEFAULT_LOCATION || "Virginia",
    permissions: body.permissions || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_event_os_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      intent: result.intent,
      blueprint: result.blueprint,
      vendors: result.vendors,
      pricing: result.pricing,
      calendar: result.calendar,
      approvals: result.approvals,
      event_memory: result.eventMemory,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
