
export function buildAmbientOperatingState({ text = "", readiness = {}, conversation = [], world = {} } = {}) {
  const lower = String(text || "").toLowerCase();
  const intent =
    /price|cost|budget/.test(lower) ? "pricing" :
    /build|create|coordinate|plan/.test(lower) ? "coordination" :
    /risk|protect|safe|backup/.test(lower) ? "protection" :
    /feel|think|idea|worried|excited/.test(lower) ? "human_exchange" :
    "open_conversation";

  const actions = [];

  if (!readiness.ready) {
    actions.push({
      id: "voice_readiness_required",
      status: "blocked",
      message: readiness.reason || "Voice readiness required."
    });
  }

  if (intent === "pricing") actions.push({ id: "pricing_layer", status: "prepare", message: "Check pricing signals." });
  if (intent === "coordination") actions.push({ id: "coordination_layer", status: "prepare", message: "Coordinate the real-world path." });
  if (intent === "protection") actions.push({ id: "protection_layer", status: "active", message: "Protect the outcome." });
  if (intent === "human_exchange") actions.push({ id: "human_layer", status: "active", message: "Respond with emotional intelligence." });

  return {
    layer: "next_generation_ambient_ai_operating_layer",
    intent,
    readiness,
    active: Boolean(readiness.ready),
    actions,
    conversationDepth: Array.isArray(conversation) ? conversation.length : 0,
    mode: readiness.ready ? "ambient_ready" : "readiness_gate",
    nextMove: readiness.ready ? "listen_and_orchestrate" : "ask_for_required_enablement"
  };
}
