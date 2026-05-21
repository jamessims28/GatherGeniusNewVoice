
import { resolveUserIdentity } from "./userIdentity";
import { loadPersistentMemory, savePersistentMemory, updateMemoryFromRun } from "./persistentMemoryStore";
import { getIntegrationRegistry, summarizeIntegrations } from "./integrationRegistry";
import { runProductionExecutionEngine } from "./productionExecutionEngine";
import { logObservabilityEvent, measureOperation } from "./observability";
import { runGatherGeniusRealityOrchestrationCore } from "../reality-orchestration/gatherGeniusRealityOrchestrationCore";

export async function runProductionAutonomyCore({
  request = "",
  userKey,
  email,
  displayName,
  location = "Virginia",
  permissions = {}
} = {}) {
  const startedAt = Date.now();
  const identity = await resolveUserIdentity({ userKey, email, displayName });
  const memory = await loadPersistentMemory({ userKey: identity.userKey });
  const registry = getIntegrationRegistry();
  const integrationSummary = summarizeIntegrations(registry);

  await logObservabilityEvent({
    userKey: identity.userKey,
    type: "production_autonomy_started",
    message: "Production Autonomy Core started.",
    data: { request, integrationSummary }
  });

  const reality = await runGatherGeniusRealityOrchestrationCore({
    request,
    location,
    userKey: identity.userKey,
    memory,
    permissions
  });

  const actions = reality.execution?.queue || [];
  const execution = await runProductionExecutionEngine({
    userKey: identity.userKey,
    actions,
    permissions
  });

  const nextMemory = updateMemoryFromRun({ memory, request, result: reality });
  await savePersistentMemory({ userKey: identity.userKey, memory: nextMemory });

  const metric = measureOperation("production_autonomy_core", startedAt);
  await logObservabilityEvent({
    userKey: identity.userKey,
    type: "production_autonomy_completed",
    message: "Production Autonomy Core completed.",
    data: { metric, execution }
  });

  return {
    ok: true,
    layer: "production_autonomy_core",
    name: "GatherGenius Production Autonomy Core",
    identity,
    integrations: registry,
    integrationSummary,
    reality,
    execution,
    memory: nextMemory,
    observability: metric,
    response:
      execution.needsApproval > 0
        ? `I prepared the plan and queued ${execution.needsApproval} action(s) for your approval.`
        : reality.response || "I prepared the safest next step in the background.",
    createdAt: new Date().toISOString()
  };
}
