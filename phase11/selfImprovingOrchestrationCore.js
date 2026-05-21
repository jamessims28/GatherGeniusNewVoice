
import { runDistributedAmbientFabric } from "../phase10/distributedAmbientFabric";
import { scoreOutcome } from "./outcomeScoringEngine";
import { runStrategyLearningLoop } from "./strategyLearningLoop";
import { tuneAgentMesh } from "./agentSelfTuningEngine";
import { updateContinuousOptimizationMemory } from "./continuousOptimizationMemory";

export async function runSelfImprovingOrchestrationCore({
  request = "",
  userKey = "anonymous_preview",
  memory = {},
  devices = [],
  permissions = {},
  role = "user",
  userFeedback = {},
  metrics = {}
} = {}) {
  const startedAt = Date.now();

  const fabric = await runDistributedAmbientFabric({
    request,
    userKey,
    memory,
    devices,
    permissions,
    role
  });

  const measuredMetrics = {
    ...metrics,
    durationMs: Date.now() - startedAt
  };

  const outcome = scoreOutcome({
    request,
    result: fabric,
    userFeedback,
    metrics: measuredMetrics
  });

  const learning = runStrategyLearningLoop({
    outcome,
    priorStrategy: memory.currentStrategy || {},
    request
  });

  const agents = fabric.mesh?.agents || [];
  const tuning = tuneAgentMesh({
    agents,
    outcome,
    learning
  });

  const optimizationMemory = updateContinuousOptimizationMemory({
    memory,
    outcome,
    learning,
    tuning
  });

  return {
    ok: true,
    layer: "self_improving_orchestration_core",
    name: "GatherGenius Self-Improving Orchestration Core",
    fabric,
    outcome,
    learning,
    tuning,
    optimizationMemory,
    response: buildResponse({ fabric, outcome, learning }),
    backgroundOnly: true,
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ fabric, outcome, learning }) {
  if (learning.requiresReview) {
    return `I ran the background orchestration and scored the outcome ${outcome.outcomeScore}/100. Improvements are prepared for review.`;
  }

  if (outcome.grade === "elite") {
    return "The background orchestration is performing at an elite level.";
  }

  return fabric.response || "The background orchestration completed and learning signals were captured.";
}
