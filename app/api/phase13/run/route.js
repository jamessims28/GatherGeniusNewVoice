
import { NextResponse } from "next/server";
import { runMarketplaceMonetizationCore } from "../../../../lib/phase13/marketplaceMonetizationCore";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const request = body.request || body.text || body.query || "";

  if (!request) {
    return NextResponse.json({ ok: false, message: "Request is required." }, { status: 400 });
  }

  const result = await runMarketplaceMonetizationCore({
    request,
    userKey: body.userKey || "anonymous_preview",
    memory: body.memory || {},
    location: body.location || "Virginia",
    permissions: body.permissions || {},
    role: body.role || "user",
    usage: body.usage || {}
  });

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("gg_marketplace_monetization_runs").insert({
      user_key: body.userKey || "anonymous_preview",
      request,
      response_text: result.response,
      ecosystem: result.ecosystem,
      marketplace: result.marketplace,
      subscription: result.subscription,
      forecast: result.forecast,
      trust: result.trust,
      result_data: result
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
