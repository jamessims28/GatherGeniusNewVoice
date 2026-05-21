
export const autonomousAgentSwarm = [
  "planner",
  "negotiator",
  "logistics",
  "finance",
  "legal",
  "scheduling",
  "relationship_manager",
  "vendor_coordinator",
  "investor_intelligence",
  "emergency_protection"
];

export function runAgentSwarm({ request = "", reality = {}, human = {}, permissions = {} } = {}) {
  const t = String(request).toLowerCase();

  return autonomousAgentSwarm.map((agent) => {
    let status = "watching";
    let output = "monitor quietly";
    let autonomy = "prepare_only";

    if (agent === "planner") { status = "active"; output = "build autonomous operating plan"; }
    if (agent === "negotiator" && /price|quote|vendor|deal|cost/.test(t)) { status = "active"; output = "prepare negotiation strategy"; }
    if (agent === "logistics" && /travel|venue|chairs|tables|tent|hotel|route/.test(t)) { status = "active"; output = "coordinate logistics dependencies"; }
    if (agent === "finance" && /budget|payment|deposit|invoice|stripe/.test(t)) { status = "active"; output = "protect payment and budget path"; }
    if (agent === "legal" && /contract|agreement|liability|terms/.test(t)) { status = "active"; output = "flag legal review before execution"; }
    if (agent === "scheduling" && /date|calendar|schedule|time|remind/.test(t)) { status = "active"; output = "prepare scheduling workflow"; }
    if (agent === "relationship_manager" && /family|client|vendor|investor|team/.test(t)) { status = "active"; output = "protect relationship tone and trust"; }
    if (agent === "vendor_coordinator" && /vendor|dj|catering|food|venue/.test(t)) { status = "active"; output = "prepare vendor coordination graph"; }
    if (agent === "investor_intelligence") { status = "ready"; output = "track execution metrics and platform value"; }
    if (agent === "emergency_protection" && (reality?.riskLevel === "elevated" || /emergency|urgent|risk/.test(t))) { status = "active"; output = "prepare protective intervention"; }

    if (permissions[agent]) autonomy = "execute_allowed";

    return { id: agent, status, output, autonomy };
  });
}
