
import { runAgentMesh } from "./agentMesh";
import { runToolConnectors } from "./toolConnectors";
import { buildRecommendedExecutionQueue } from "./executionQueue";

export async function runPhase4AgentMeshExecutionCore({
  request = "",
  human = {},
  world = {},
  memory = {},
  permissions = {},
  location = "Virginia"
} = {}) {
  const connectors = await runToolConnectors({ request, location });
  const agents = runAgentMesh({ request, human, world: connectors, memory, permissions });
  const executionQueue = buildRecommendedExecutionQueue({
    request,
    agents,
    connectors,
    userPermissions: permissions
  });

  const blocked = executionQueue.filter((item) => item.status === "blocked");
  const prepared = executionQueue.filter((item) => item.status === "prepared");

  const response =
    blocked.length
      ? `I prepared the plan and queued ${prepared.length} safe action(s). ${blocked.length} action(s) need your confirmation before execution.`
      : `I prepared the plan and queued ${prepared.length} safe action(s) for execution.`;

  return {
    ok: true,
    layer: "phase4_agent_mesh_execution_core",
    name: "GatherGenius Agent Mesh + Execution Core",
    agents,
    connectors,
    executionQueue,
    preparedCount: prepared.length,
    blockedCount: blocked.length,
    response,
    createdAt: new Date().toISOString()
  };
}
