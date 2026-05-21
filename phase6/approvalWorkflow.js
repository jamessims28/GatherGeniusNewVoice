
import { getSupabaseAdmin } from "../supabaseAdmin";

export const approvalRequiredTypes = [
  "payment",
  "booking",
  "external_message",
  "contract",
  "calendar_invite",
  "personal_data_access",
  "sensitive_database_write"
];

export function needsApproval(action = {}) {
  return approvalRequiredTypes.includes(action.type) || Boolean(action.external) || Boolean(action.requiresApproval);
}

export async function queueApproval({ userKey = "anonymous_preview", action = {} } = {}) {
  const supabase = getSupabaseAdmin();
  const item = {
    id: action.id || `approval_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    user_key: userKey,
    action_type: action.type || "internal_preparation",
    label: action.label || "Prepared action",
    status: needsApproval(action) ? "needs_approval" : "auto_prepared",
    action_data: action,
    reason: needsApproval(action) ? "Confirmation required before execution." : "Safe internal preparation.",
    created_at: new Date().toISOString()
  };

  if (supabase) {
    await supabase.from("gg_approval_queue").insert(item).catch(() => null);
  }

  return item;
}

export async function approveAction({ approvalId, userKey = "anonymous_preview" } = {}) {
  const supabase = getSupabaseAdmin();
  const approvedAt = new Date().toISOString();

  if (supabase) {
    const { data } = await supabase
      .from("gg_approval_queue")
      .update({ status: "approved", approved_at: approvedAt })
      .eq("id", approvalId)
      .eq("user_key", userKey)
      .select()
      .maybeSingle();
    return data || { id: approvalId, user_key: userKey, status: "approved", approved_at: approvedAt };
  }

  return { id: approvalId, user_key: userKey, status: "approved", approved_at: approvedAt };
}
