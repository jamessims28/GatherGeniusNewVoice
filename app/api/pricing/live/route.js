import { NextResponse } from "next/server";
import { getLivePricing } from "../../../../lib/pricing/livePricingEngine";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const input = body.query || body.input || body.text || "";

  if (!input) {
    return NextResponse.json({
      ok: false,
      message: "Tell GeniusGather what you need priced."
    }, { status: 400 });
  }

  const result = await getLivePricing(input);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("pricing_requests").insert({
      query: input,
      category: result.intent.category,
      location: result.intent.location,
      pricing_result: result,
      confidence: result.pricing.confidence,
      mode: result.pricing.mode
    }).catch(() => null);
  }

  return NextResponse.json(result);
}
