
import { runSelfImprovingOrchestrationCore } from "../phase11/selfImprovingOrchestrationCore";
import { runMarketSignalEngine } from "./marketSignalEngine";
import { runEcosystemRoutingEngine } from "./ecosystemRoutingEngine";
import { runOpportunityDiscoveryEngine } from "./opportunityDiscoveryEngine";
import { runRevenueOptimizationEngine } from "./revenueOptimizationEngine";

export async function runEcosystemIntelligenceCore({
  request = "",
  userKey = "anonymous_preview",
  memory = {},
  location = "Virginia",
  permissions = {},
  role = "user"
} = {}) {
  const orchestration = await runSelfImprovingOrchestrationCore({
    request,
    userKey,
    memory,
    permissions,
    role
  });

  const market = runMarketSignalEngine({ request, location, memory });
  const routing = runEcosystemRoutingEngine({ request, market, trust: orchestration.fabric?.trust, memory });
  const opportunity = runOpportunityDiscoveryEngine({ request, market, routes: routing.routes });
  const revenue = runRevenueOptimizationEngine({ opportunities: opportunity.opportunities, trust: orchestration.fabric?.trust });

  return {
    ok: true,
    layer: "ecosystem_intelligence_core",
    name: "GatherGenius Predictive Market & Ecosystem Intelligence Core",
    backgroundOnly: true,
    orchestration,
    market,
    routing,
    opportunity,
    revenue,
    response: buildResponse({ opportunity, revenue }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ opportunity, revenue }) {
  if (revenue.revenueReadiness) {
    return `Background ecosystem intelligence found ${opportunity.opportunities.length} opportunity signal(s). Revenue recommendations are prepared for review.`;
  }
  return "Background ecosystem intelligence is active and monitoring for opportunity signals.";
}
