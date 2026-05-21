
import { getSupabaseAdmin } from "../supabaseAdmin";

export async function writeAuditEvent({
  userKey = "anonymous_preview",
  actorRole = "user",
  action = "unknown",
  resource = "system",
  status = "recorded",
  reason = "",
  metadata = {}
} = {}) {
  const event = {
    user_key: userKey,
    actor_role: actorRole,
    action,
    resource,
    status,
    reason,
    metadata,
    created_at: new Date().toISOString()
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_audit_trail").insert(event).catch(() => null);
  }

  return event;
}
