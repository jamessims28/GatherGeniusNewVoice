import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const permissions = body.permissions || {};
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("user_data_permissions").insert({
      user_key: body.userKey || "anonymous_preview",
      permissions,
      approved_sources: Object.keys(permissions).filter((key) => permissions[key]),
      consent_version: "v1",
      consent_data: body
    });

    if (error) {
      return NextResponse.json({ ok: true, mode: "local-only", message: "Permissions saved locally. Database warning: " + error.message });
    }
  }

  return NextResponse.json({ ok: true, message: "Permissions saved." });
}
