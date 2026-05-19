
export function buildHumanTwinModel({ text = "", memory = {}, history = [] } = {}) {
  const t = String(text).toLowerCase();

  const model = {
    spendingPsychology:
      /luxury|premium|elite|exclusive/.test(t) ? "premium-value" :
      /cheap|save|budget|deal|discount/.test(t) ? "cost-protective" :
      memory.spendingPsychology || "balanced",
    timingBehavior:
      /asap|today|tomorrow|urgent|quick/.test(t) ? "urgent" :
      /flexible|open|anytime/.test(t) ? "flexible" :
      memory.timingBehavior || "guided",
    socialPattern:
      /family|private|cousin|aunt|uncle|kids/.test(t) ? "private-family" :
      /client|business|team|corporate|investor/.test(t) ? "professional" :
      memory.socialPattern || "personal",
    trustPreference:
      /proof|verified|trusted|rating|safe|secure/.test(t) ? "proof-first" :
      /just do|handle it|you decide/.test(t) ? "delegate-first" :
      /ask me|show me|confirm/.test(t) ? "approval-first" :
      memory.trustPreference || "balanced-trust",
    communicationStyle:
      /short|direct|simple|quick/.test(t) ? "brief-direct" :
      /detail|explain|breakdown/.test(t) ? "clear-detailed" :
      /stress|worried|overwhelmed/.test(t) ? "supportive-human" :
      memory.communicationStyle || "friendly-concise"
  };

  return {
    layer: "human_digital_twin",
    model,
    confidence: history.length >= 5 ? 0.9 : 0.72,
    nextSupportLikelyNeeded:
      model.timingBehavior === "urgent" ? "fast protected action" :
      model.trustPreference === "proof-first" ? "confidence proof" :
      model.communicationStyle === "supportive-human" ? "calm reassurance" :
      "one clear recommendation"
  };
}
