import { NextResponse } from "next/server";
import { getStripe } from "../../../../lib/stripeServer";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const eventLock = body.eventLock || body.experienceLock || {};
  const amount = Number(eventLock.deposit || 500);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const stripe = getStripe();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("event_executions").insert({
      lock_code: eventLock.lockCode,
      status: "deposit_pending",
      event_type: eventLock.intent?.eventType || "Experience",
      total: eventLock.total || 0,
      deposit: amount,
      confidence_score: eventLock.confidenceScore || 0,
      execution_data: eventLock
    });
  }

  if (!stripe) {
    return NextResponse.json({ ok: true, mode: "safe-preview", message: "Experience Lock prepared. Add STRIPE_SECRET_KEY for checkout.", checkout: { amount, lockCode: eventLock.lockCode } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: eventLock.name || "GatherGenius Experience Lock" },
        unit_amount: Math.max(100, Math.round(amount * 100))
      },
      quantity: 1
    }],
    metadata: { lockCode: eventLock.lockCode || "", type: "experience_lock_deposit" },
    success_url: `${appUrl}/execution?locked=true&lock=${encodeURIComponent(eventLock.lockCode || "")}`,
    cancel_url: `${appUrl}/?cancelled=true`
  });

  return NextResponse.json({ ok: true, message: "Stripe checkout created.", url: session.url });
}
