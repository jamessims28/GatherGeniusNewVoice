
export const gatherGeniusAgentMesh = [
  {
    id: "planning_agent",
    name: "Planning Agent",
    role: "Breaks the request into a protected real-world plan."
  },
  {
    id: "pricing_agent",
    name: "Pricing Agent",
    role: "Estimates cost, budget pressure, and value path."
  },
  {
    id: "vendor_agent",
    name: "Vendor Agent",
    role: "Prepares vendor search and trusted provider routing."
  },
  {
    id: "safety_agent",
    name: "Safety Agent",
    role: "Blocks risky, external, financial, or permission-sensitive actions."
  },
  {
    id: "calendar_agent",
    name: "Calendar Agent",
    role: "Prepares scheduling, timing conflicts, and reminders."
  },
  {
    id: "memory_agent",
    name: "Memory Agent",
    role: "Uses prior preferences and relationship memory."
  },
  {
    id: "execution_agent",
    name: "Execution Agent",
    role: "Moves approved safe actions through the execution queue."
  }
];

export function runAgentMesh({ request = "", human = {}, world = {}, memory = {}, permissions = {} } = {}) {
  const lower = String(request).toLowerCase();

  return gatherGeniusAgentMesh.map((agent) => {
    let status = "watching";
    let recommendation = "monitor quietly";
    let confidence = 0.72;

    if (agent.id === "planning_agent") {
      status = "active";
      recommendation = "create structured outcome plan";
      confidence = 0.9;
    }

    if (agent.id === "pricing_agent" && /price|cost|budget|estimate|quote|under \$?\d+/i.test(request)) {
      status = "active";
      recommendation = "estimate pricing and protect budget";
      confidence = 0.86;
    }

    if (agent.id === "vendor_agent" && /vendor|dj|food|catering|tent|chairs|tables|hotel|venue|provider/.test(lower)) {
      status = "active";
      recommendation = "prepare vendor sourcing workflow";
      confidence = 0.84;
    }

    if (agent.id === "safety_agent") {
      status = "active";
      recommendation = "require confirmation for payments, bookings, messages, and external actions";
      confidence = 0.96;
    }

    if (agent.id === "calendar_agent" && /date|schedule|calendar|remind|when|time/.test(lower)) {
      status = "active";
      recommendation = "prepare scheduling check";
      confidence = 0.82;
    }

    if (agent.id === "memory_agent" && (memory.summary || human?.preferences)) {
      status = "active";
      recommendation = `apply memory: ${memory.summary || "known preferences"}`;
      confidence = 0.8;
    }

    if (agent.id === "execution_agent") {
      status = permissions?.canExecute ? "ready" : "blocked";
      recommendation = permissions?.canExecute
        ? "safe execution may proceed"
        : "prepare only; execution requires permission";
      confidence = 0.91;
    }

    return {
      ...agent,
      status,
      recommendation,
      confidence
    };
  });
}
