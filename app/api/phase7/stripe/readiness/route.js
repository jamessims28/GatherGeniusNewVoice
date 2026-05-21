
import { NextResponse } from "next/server";
import { getStripeReadiness } from "../../../../../lib/phase7/stripeReadiness";

export async function GET() {
  return NextResponse.json({ ok: true, stripe: getStripeReadiness() });
}
