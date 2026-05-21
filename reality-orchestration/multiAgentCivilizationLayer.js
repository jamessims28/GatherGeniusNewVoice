
export const civilizationAgents = [
  "planner","scheduler","negotiator","strategist","protector","finance_optimizer","logistics_coordinator","memory_historian","execution_manager","emotional_stabilizer"
];

export function runMultiAgentCivilizationLayer({ request = "", reality = {}, human = {}, predictions = [] } = {}) {
  return civilizationAgents.map(agent => {
    let status = "watching";
    let output = "monitor quietly";

    if (agent === "planner") { status = "active"; output = "build protected operating plan"; }
    if (agent === "protector" && predictions.length) { status = "active"; output = "protect against predicted risk"; }
    if (agent === "finance_optimizer" && reality.worldState?.finance?.pricingRequested) { status = "active"; output = "protect pricing and budget"; }
    if (agent === "logistics_coordinator" && reality.worldState?.logistics?.vendorNeeded) { status = "active"; output = "coordinate vendor and logistics path"; }
    if (agent === "emotional_stabilizer" && Number(human.stress || 0) > 0.7) { status = "active"; output = "reduce pressure and slow pacing"; }
    if (agent === "execution_manager") { status = "ready"; output = "prepare safe execution queue"; }

    return { id: agent, status, output };
  });
}
