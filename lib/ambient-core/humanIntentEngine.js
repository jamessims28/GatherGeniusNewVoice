
export function runHumanIntentEngine(text = "") {
  const t = String(text || "").toLowerCase();

  const intent =
    /price|cost|budget|estimate|how much/.test(t) ? "pricing" :
    /build|create|plan|coordinate|organize|set up/.test(t) ? "coordinate_outcome" :
    /risk|protect|safe|backup|secure/.test(t) ? "protect_outcome" :
    /feel|think|idea|worried|overwhelmed|excited/.test(t) ? "human_exchange" :
    "open_guidance";

  const urgency = /now|asap|urgent|today|tomorrow|soon|quick/.test(t) ? "urgent" : "normal";
  const emotion =
    /overwhelmed|worried|stress|confused/.test(t) ? "needs_reassurance" :
    /excited|great|love|amazing/.test(t) ? "excited" :
    "calm";

  const spending =
    /luxury|premium|elite|exclusive|best/.test(t) ? "premium_value" :
    /cheap|save|budget|deal|affordable/.test(t) ? "budget_protective" :
    "balanced";

  const locationMatch = String(text).match(/(?:in|near|around)\s+([a-zA-Z ,]+)$/i);

  return {
    layer: "human_intent_engine",
    intent,
    urgency,
    emotion,
    spending,
    location: locationMatch?.[1]?.trim() || "Virginia",
    confidence: text.length > 8 ? 0.86 : 0.55,
    nextQuestion:
      intent === "coordinate_outcome" ? "What outcome should I protect first: budget, timing, or quality?" :
      intent === "pricing" ? "Should I optimize for lowest safe price or best premium value?" :
      intent === "protect_outcome" ? "What risk worries you most right now?" :
      "What would you like Genius to help with first?"
  };
}
