
import { NextResponse } from "next/server";
import { runEcosystemIntelligenceCore } from "../../../../lib/phase12/ecosystemIntelligenceCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runEcosystemIntelligenceCore({
    request,
    userKey: body.userKey || "anonymous_preview",
    memory: body.memory || {},
    location: body.location || "Virginia",
    permissions: body.permissions || {},
    role: body.role || "user"
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_ecosystem_intelligence_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      orchestration: result.orchestration,
      market: result.market,
      routing: result.routing,
      opportunity: result.opportunity,
      revenue: result.revenue,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
