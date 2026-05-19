
import { NextResponse } from "next/server";
import { generateSourceAwareCode } from "../../../../lib/codeforge/sourceAwareCodeEngine";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { analyzeThreat, buildShieldResponse } from "../../../../lib/security/geniusShield";

export async function POST(req) {
  const body = await req.json();
  const request = body.request || body.query || body.text || "";
  const userKey = body.userKey || "anonymous_preview";
  const permissions = body.permissions || {};

  const threat = analyzeThreat({
    text: request,
    path: "/api/codeforge/generate",
    method: "POST",
    userAgent: req.headers.get("user-agent") || "",
    ip: req.headers.get("x-forwarded-for") || "unknown"
  });

  if (threat.blocked) {
    return NextResponse.json(buildShieldResponse(threat), { status: 403 });
  }

  if (!request) {
    return NextResponse.json({ ok: false, message: "Describe what code GeniusGather should create." }, { status: 400 });
  }

  const result = await generateSourceAwareCode({ request, userKey, permissions });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("source_aware_code_generations").insert({
      user_key: userKey,
      request,
      generation_mode: result.generationMode,
      code_preview: String(result.code || "").slice(0, 4000),
      sources_used: result.sourceBundle?.availableSources || [],
      safety_result: result.safety,
      metadata: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
