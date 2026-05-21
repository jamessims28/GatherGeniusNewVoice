
import { buildRealtimeVoiceOperatingSystem } from "./realtimeVoiceOperatingSystem";
import { runAgentSwarm } from "./agentSwarmArchitecture";
import { runLiveWorldStateSynchronization } from "./liveWorldStateSynchronization";
import { buildAutonomousExecutionGraph } from "./autonomousExecutionGraph";
import { buildHumanRelationshipGraph } from "./humanRelationshipGraph";
import { runRealityPredictionEngine } from "./realityPredictionEngine";
import { runAmbientPresenceNetwork } from "./ambientPresenceNetwork";
import { runInvestorIntelligenceLayer } from "./investorIntelligenceLayer";
import { runMultiDeviceAmbientSync } from "./multiDeviceAmbientSync";
import { buildRealityApiInfrastructure } from "./realityApiInfrastructure";

export async function runAutonomousRealityNetwork({
  request = "",
  userKey = "anonymous_preview",
  location = "Virginia",
  history = [],
  memory = {},
  permissions = {},
  devices = []
} = {}) {
  const relationship = buildHumanRelationshipGraph({ userKey, request, history, memory });
  const emotion = relationship.toneAdaptation === "reassuring" ? "calm" : "warm";
  const voice = buildRealtimeVoiceOperatingSystem({ emotion, mode: "ambient" });
  const world = await runLiveWorldStateSynchronization({ location, request });
  const swarm = runAgentSwarm({ request, reality: world, human: relationship, permissions });
  const executionGraph = buildAutonomousExecutionGraph({ request, agents: swarm, world, permissions });
  const predictions = runRealityPredictionEngine({ world, relationship, graph: executionGraph });
  const ambient = runAmbientPresenceNetwork({ voice, predictions, relationship, permissions });
  const investor = runInvestorIntelligenceLayer({ executionGraph, swarm, predictions: predictions.predictions });
  const devicesSync = runMultiDeviceAmbientSync({ userKey, devices });
  const api = buildRealityApiInfrastructure();

  return {
    ok: true,
    layer: "autonomous_reality_network",
    name: "GatherGenius Autonomous Reality Network",
    voice,
    swarm,
    world,
    executionGraph,
    relationship,
    predictions,
    ambient,
    investor,
    devices: devicesSync,
    api,
    response: buildResponse({ ambient, executionGraph, predictions, investor }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ ambient, executionGraph, predictions, investor }) {
  const approvals = executionGraph.nodes?.filter(n => n.status === "awaiting_confirmation").length || 0;
  if (approvals) return `I prepared the autonomous reality network and found ${approvals} protected action(s) that need confirmation.`;
  if (predictions.failureRisk === "elevated") return "I detected elevated reality risk and prepared a protected path.";
  if (ambient.softlyProactive) return ambient.message;
  return `Autonomous Reality Network is active. Execution success potential: ${investor.executionSuccessPotential}%.`;
}
