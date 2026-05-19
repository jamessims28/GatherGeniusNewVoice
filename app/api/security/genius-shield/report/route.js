
import { NextResponse } from "next/server";
import { analyzeThreat, buildShieldResponse } from "../../../../../lib/security/geniusShield";
import { getSupabaseAdmin } from "../../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const headers = req.headers;

  const threat = analyzeThreat({
    text: body.text || body.input || body.query || JSON.stringify(body),
    path: body.path || "",
    method: "POST",
    userAgent: headers.get("user-agent") || "",
    ip: headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown"
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("security_incidents").insert({
      shield_version: threat.shieldVersion,
      severity: threat.severity,
      blocked: threat.blocked,
      threat_ids: threat.threatIds,
      evidence: threat.evidence,
      response_message: threat.responseMessage
    }).catch(() => null);
  }

  if (threat.blocked) {
    return NextResponse.json(buildShieldResponse(threat), { status: 403 });
  }

  return NextResponse.json({ ok: true, shield: "GeniusShield", message: "No active threat detected.", threat });
}
