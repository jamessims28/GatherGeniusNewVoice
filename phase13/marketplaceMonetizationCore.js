
import { runEcosystemIntelligenceCore } from "../phase12/ecosystemIntelligenceCore";
import { runVendorMarketplaceEngine } from "./vendorMarketplaceEngine";
import { runSubscriptionMonetizationEngine } from "./subscriptionMonetizationEngine";
import { runRevenueForecastEngine } from "./revenueForecastEngine";
import { runMarketplaceTrustGuard } from "./marketplaceTrustGuard";

export async function runMarketplaceMonetizationCore({
  request = "",
  userKey = "anonymous_preview",
  memory = {},
  location = "Virginia",
  permissions = {},
  role = "user",
  usage = {}
} = {}) {
  const ecosystem = await runEcosystemIntelligenceCore({
    request,
    userKey,
    memory,
    location,
    permissions,
    role
  });

  const marketplace = runVendorMarketplaceEngine({ request, location, memory });
  const subscription = runSubscriptionMonetizationEngine({ request, user: { userKey }, usage });
  const forecast = runRevenueForecastEngine({
    marketplace,
    subscription,
    opportunity: ecosystem.opportunity
  });
  const trust = runMarketplaceTrustGuard({ marketplace, subscription, forecast });

  return {
    ok: true,
    layer: "marketplace_monetization_core",
    name: "GatherGenius Marketplace & Monetization Core",
    backgroundOnly: true,
    ecosystem,
    marketplace,
    subscription,
    forecast,
    trust,
    response: buildResponse({ marketplace, subscription, forecast, trust }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ marketplace, subscription, forecast }) {
  if (forecast.monthlyPotential > 0) {
    return `Background monetization prepared ${marketplace.leads.length} vendor lead(s), recommended ${subscription.recommendedPlan}, and estimated $${forecast.monthlyPotential}/month potential for review.`;
  }
  return "Background monetization is monitoring for marketplace and subscription opportunities.";
}
