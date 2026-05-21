
import { getSupabaseAdmin } from "../supabaseAdmin";

export async function loadPersistentMemory({ userKey = "anonymous_preview" } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { userKey, preferences: {}, identityGraph: {}, actionHistory: [], source: "fallback_memory" };

  const { data } = await supabase
    .from("gg_persistent_memory")
    .select("*")
    .eq("user_key", userKey)
    .maybeSingle();

  return data?.memory_data || { userKey, preferences: {}, identityGraph: {}, actionHistory: [], source: "new_memory" };
}

export async function savePersistentMemory({ userKey = "anonymous_preview", memory = {} } = {}) {
  const supabase = getSupabaseAdmin();
  const next = { ...memory, userKey, updatedAt: new Date().toISOString() };

  if (!supabase) return next;

  await supabase.from("gg_persistent_memory").upsert({
    user_key: userKey,
    memory_data: next,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_key" }).catch(() => null);

  return next;
}

export function updateMemoryFromRun({ memory = {}, request = "", result = {} } = {}) {
  const text = String(request).toLowerCase();
  const preferences = {
    ...(memory.preferences || {}),
    premium: /premium|luxury|elite|exclusive/.test(text) || memory.preferences?.premium || false,
    budgetProtective: /budget|save|cheap|affordable/.test(text) || memory.preferences?.budgetProtective || false,
    proofFirst: /proof|verify|safe|secure|trusted/.test(text) || memory.preferences?.proofFirst || false,
    familyContext: /family|cousin|aunt|uncle|kids|children/.test(text) || memory.preferences?.familyContext || false
  };

  return {
    ...memory,
    preferences,
    lastRequest: request,
    lastRealityResponse: result.response || "",
    actionHistory: [...(memory.actionHistory || []), {
      request,
      response: result.response,
      at: new Date().toISOString()
    }].slice(-100)
  };
}
