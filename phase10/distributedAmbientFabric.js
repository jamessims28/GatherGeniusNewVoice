
import { runDistributedAmbientRuntime } from "./distributedRuntime";
import { runMemoryCivilizationFabric } from "./memoryCivilizationFabric";
import { runAmbientIntelligenceMesh } from "./ambientIntelligenceMesh";
import { runDeviceSynchronizationRuntime } from "./deviceSynchronizationRuntime";
import { runAutonomousOptimizationEngine } from "./autonomousOptimizationEngine";
import { runDistributedExecutionInfrastructure } from "./distributedExecutionInfrastructure";
import { runTrustVerificationRouter } from "./trustVerificationRouter";

export async function runDistributedAmbientFabric({
  request = "",
  userKey = "anonymous_preview",
  memory = {},
  devices = [],
  permissions = {},
  role = "user"
} = {}) {
  const runtime = runDistributedAmbientRuntime({ request, userKey, devices });
  const memoryFabric = runMemoryCivilizationFabric({ userKey, memory, eventRoutes: runtime.routedEvents });
  const mesh = runAmbientIntelligenceMesh({ request, eventRoutes: runtime.routedEvents, memory: memoryFabric });
  const deviceSync = runDeviceSynchronizationRuntime({ userKey, devices });
  const optimization = runAutonomousOptimizationEngine({ request, mesh, memory: memoryFabric, runtime });
  const execution = runDistributedExecutionInfrastructure({ optimizations: optimization.optimizations, permissions });
  const trust = runTrustVerificationRouter({ execution, role });

  return {
    ok: true,
    layer: "distributed_ambient_intelligence_fabric",
    name: "GatherGenius Distributed Ambient Intelligence Fabric",
    runtime,
    memoryFabric,
    mesh,
    deviceSync,
    optimization,
    execution,
    trust,
    response: buildResponse({ trust, mesh, optimization }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ trust, mesh, optimization }) {
  if (trust.holds > 0) return `Distributed fabric prepared ${optimization.optimizations.length} optimization(s). ${trust.holds} protected action(s) require confirmation.`;
  return `Distributed ambient fabric is active with ${mesh.activeAgents} active background agent(s).`;
}
