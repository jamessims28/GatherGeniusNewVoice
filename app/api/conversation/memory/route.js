import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function GET(req) {
  const url = new URL(req.url);
  const userKey = url.searchParams.get("userKey") || "anonymous_preview";
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "local-only", memories: [] });
  }

  const { data, error } = await supabase
    .from("conversation_memory")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ ok: true, mode: "database-warning", memories: [], message: error.message });
  }

  return NextResponse.json({ ok: true, memories: data || [] });
}
