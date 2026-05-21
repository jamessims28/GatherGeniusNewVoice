
import { getSupabaseAdmin } from "../supabaseAdmin";

export async function logObservabilityEvent({ userKey = "anonymous_preview", type = "info", message = "", data = {} } = {}) {
  const event = {
    user_key: userKey,
    event_type: type,
    message,
    event_data: data,
    created_at: new Date().toISOString()
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_observability_events").insert(event).catch(() => null);
  }

  return event;
}

export function measureOperation(name, startedAt = Date.now()) {
  const durationMs = Date.now() - startedAt;
  return {
    name,
    durationMs,
    grade: durationMs < 250 ? "excellent" : durationMs < 800 ? "good" : durationMs < 2000 ? "watch" : "slow"
  };
}
