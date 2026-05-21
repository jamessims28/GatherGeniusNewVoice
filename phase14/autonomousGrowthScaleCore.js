
import { runMarketplaceMonetizationCore } from "../phase13/marketplaceMonetizationCore";
import { runGrowthSignalEngine } from "./growthSignalEngine";
import { runAcquisitionStrategyEngine } from "./acquisitionStrategyEngine";
import { runRetentionOptimizationEngine } from "./retentionOptimizationEngine";
import { runScaleReadinessEngine } from "./scaleReadinessEngine";

export async function runAutonomousGrowthScaleCore({
  request = "",
  userKey = "anonymous_preview",
  memory = {},
  location = "Virginia",
  permissions = {},
  role = "user",
  usage = {}
} = {}) {
  const marketplace = await runMarketplaceMonetizationCore({
    request,
    userKey,
    memory,
    location,
    permissions,
    role,
    usage
  });

  const growth = runGrowthSignalEngine({ request, marketplace, memory });
  const acquisition = runAcquisitionStrategyEngine({ growth, request });
  const retention = runRetentionOptimizationEngine({ growth, memory, usage });
  const scale = runScaleReadinessEngine({ growth, acquisition, retention, marketplace });

  return {
    ok: true,
    layer: "autonomous_growth_scale_core",
    name: "GatherGenius Autonomous Growth & Scale Intelligence Core",
    backgroundOnly: true,
    marketplace,
    growth,
    acquisition,
    retention,
    scale,
    response: buildResponse({ growth, scale }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ growth, scale }) {
  return `Background growth intelligence is active. Growth score: ${growth.growthScore}. Scale stage: ${scale.stage}.`;
}
