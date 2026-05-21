
export function runMarketplaceTrustGuard({ marketplace = {}, subscription = {}, forecast = {} } = {}) {
  const protectedActions = [];

  if ((marketplace.leads || []).length) {
    protectedActions.push("vendor_lead_outreach_requires_approval");
  }

  if (subscription.upgradeSignal) {
    protectedActions.push("subscription_offer_requires_user_consent");
  }

  if (forecast.monthlyPotential > 0) {
    protectedActions.push("revenue_projection_not_guaranteed");
  }

  return {
    layer: "marketplace_trust_guard",
    protectedActions,
    canAutoExecute: false,
    canPrepare: true,
    trustMessage: "Marketplace and monetization actions are prepared only. User approval is required before outreach, charges, subscriptions, or commitments."
  };
}
