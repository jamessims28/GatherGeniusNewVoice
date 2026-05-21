
export function getStripeReadiness() {
  const configured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const prices = {
    starter: process.env.STRIPE_PRICE_ID_STARTER || null,
    pro: process.env.STRIPE_PRICE_ID_PRO || null,
    enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE || null
  };

  return {
    configured,
    webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    prices,
    readyForCheckout: configured && Boolean(prices.starter || prices.pro || prices.enterprise),
    missing: [
      !process.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY" : null,
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" : null,
      !process.env.STRIPE_WEBHOOK_SECRET ? "STRIPE_WEBHOOK_SECRET" : null
    ].filter(Boolean)
  };
}

export async function createCheckoutSessionPlaceholder({ plan = "pro", userKey = "anonymous_preview" } = {}) {
  const readiness = getStripeReadiness();

  if (!readiness.readyForCheckout) {
    return {
      ok: false,
      message: "Stripe is not fully configured.",
      readiness
    };
  }

  return {
    ok: true,
    mode: "placeholder",
    plan,
    userKey,
    message: "Stripe checkout route is ready for live session creation once Stripe SDK is installed/configured."
  };
}
