export function updateBehaviorModel({ prior = {}, current = {} } = {}) {
  const model = {
    preferredVibe: current.vibe || prior.preferredVibe || "luxury",
    budgetComfort: current.budget || prior.budgetComfort || 20000,
    preferredRegion: current.location || prior.preferredRegion || "Virginia",
    decisionStyle: current.quickApproval ? "fast-trust" : prior.decisionStyle || "guided",
    communicationStyle: current.voicePreferred ? "voice-first" : prior.communicationStyle || "calm-summary"
  };

  return {
    layer: "behavior_model",
    model,
    message: "Behavior model updated from approved interaction patterns."
  };
}
