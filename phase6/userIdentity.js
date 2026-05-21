
import { getSupabaseAdmin } from "../supabaseAdmin";

export async function resolveUserIdentity({ userKey, email, displayName } = {}) {
  const supabase = getSupabaseAdmin();
  const safeUserKey = userKey || email || "anonymous_preview";

  const identity = {
    userKey: safeUserKey,
    email: email || null,
    displayName: displayName || "GatherGenius User",
    authenticated: safeUserKey !== "anonymous_preview",
    resolvedAt: new Date().toISOString()
  };

  if (!supabase) return identity;

  await supabase.from("gg_user_profiles").upsert({
    user_key: identity.userKey,
    email: identity.email,
    display_name: identity.displayName,
    last_seen_at: new Date().toISOString()
  }, { onConflict: "user_key" }).catch(() => null);

  return identity;
}
