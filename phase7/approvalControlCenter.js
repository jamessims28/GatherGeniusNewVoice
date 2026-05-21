
import { getSupabaseAdmin } from "../supabaseAdmin";
import { writeAuditEvent } from "./auditTrail";

export async function listApprovals({ userKey = "anonymous_preview", status = null } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  let query = supabase.from("gg_approval_queue").select("*").eq("user_key", userKey).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data } = await query;
  return data || [];
}

export async function updateApprovalStatus({ approvalId, userKey = "anonymous_preview", actorRole = "admin", status = "approved", reason = "" } = {}) {
  const supabase = getSupabaseAdmin();
  const updatedAt = new Date().toISOString();

  const update = {
    status,
    reason: reason || (status === "approved" ? "Approved by control center." : "Updated by control center."),
    approved_at: status === "approved" ? updatedAt : null
  };

  let data = { id: approvalId, user_key: userKey, ...update };

  if (supabase) {
    const response = await supabase
      .from("gg_approval_queue")
      .update(update)
      .eq("id", approvalId)
      .eq("user_key", userKey)
      .select()
      .maybeSingle();

    data = response.data || data;
  }

  await writeAuditEvent({
    userKey,
    actorRole,
    action: `approval_${status}`,
    resource: approvalId,
    status,
    reason,
    metadata: data
  });

  return data;
}
