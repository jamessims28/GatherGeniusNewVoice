
export function runOperatingIntentEngine(text = "") {
  const raw = String(text || "");
  const t = raw.toLowerCase();

  const signals = {
    pricing: /price|cost|budget|estimate|how much|quote/.test(t),
    coordination: /build|create|plan|coordinate|organize|set up|arrange|handle/.test(t),
    protection: /risk|protect|safe|backup|secure|prevent|issue|problem/.test(t),
    emotion: /feel|think|idea|worried|overwhelmed|excited|concerned|confused/.test(t),
    timing: /now|asap|urgent|today|tomorrow|soon|quick|fast/.test(t),
    premium: /luxury|premium|elite|exclusive|best|high end/.test(t),
    budget: /cheap|save|budget|deal|affordable|lowest/.test(t)
  };

  const intent =
    signals.pricing ? "price_and_optimize" :
    signals.coordination ? "coordinate_outcome" :
    signals.protection ? "protect_outcome" :
    signals.emotion ? "human_exchange" :
    "open_guidance";

  const emotion =
    /overwhelmed|worried|stress|confused|concerned/.test(t) ? "needs_reassurance" :
    /excited|great|love|amazing|perfect/.test(t) ? "excited" :
    "calm";

  const spending =
    signals.premium ? "premium_value" :
    signals.budget ? "budget_protective" :
    "balanced";

  const locationMatch = raw.match(/(?:in|near|around)\s+([a-zA-Z ,]+)$/i);
  const guestMatch = raw.match(/(\d{1,5})\s*(guest|guests|people|person|persons)/i);
  const budgetMatch = raw.match(/\$?\s?(\d{1,3}(?:,\d{3})+|\d{2,7})(k)?/i);

  let budget = null;
  if (budgetMatch) {
    budget = Number(String(budgetMatch[1]).replace(/,/g, ""));
    if (budgetMatch[2]) budget *= 1000;
  }

  const missing = [];
  if (intent === "coordinate_outcome" && !guestMatch) missing.push("guest_count");
  if ((intent === "coordinate_outcome" || intent === "price_and_optimize") && !budget) missing.push("budget");
  if (!locationMatch) missing.push("location");

  const confidence = Math.min(
    0.97,
    0.58 +
      (raw.length > 12 ? 0.14 : 0) +
      (Object.values(signals).filter(Boolean).length * 0.04) +
      (missing.length === 0 ? 0.12 : 0)
  );

  return {
    layer: "operating_intent_engine",
    raw,
    intent,
    signals,
    urgency: signals.timing ? "urgent" : "normal",
    emotion,
    spending,
    location: locationMatch?.[1]?.trim() || "Virginia",
    guests: guestMatch ? Number(guestMatch[1]) : null,
    budget,
    missing,
    confidence,
    nextQuestion:
      missing.includes("guest_count") ? "About how many people should I plan for?" :
      missing.includes("budget") ? "What budget range should I protect?" :
      missing.includes("location") ? "What city or area should I use?" :
      intent === "price_and_optimize" ? "Should I optimize for lowest safe price or premium value?" :
      intent === "protect_outcome" ? "What outcome matters most to protect: timing, money, or quality?" :
      "What should Genius focus on first?"
  };
}
