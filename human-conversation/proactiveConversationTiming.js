
export function determineProactiveTiming({ human = {}, world = {}, memory = {}, lastSpokeAt = 0 } = {}) {
  const now = Date.now();
  const secondsSinceSpeech = (now - lastSpokeAt) / 1000;

  const reasons = [];
  if (human?.stress > 0.7) reasons.push("human_stress");
  if (human?.decisionFatigue) reasons.push("decision_fatigue");
  if (world?.riskLevel === "elevated") reasons.push("world_risk");
  if (memory?.importantReminder) reasons.push("memory_reminder");

  const shouldSpeak = reasons.length > 0 && secondsSinceSpeech > 8;

  return {
    layer: "proactive_conversation_timing",
    shouldSpeak,
    reasons,
    secondsSinceSpeech,
    message:
      reasons.includes("world_risk") ? "I noticed something that could affect the outcome." :
      reasons.includes("human_stress") ? "I can make this simpler if you want." :
      reasons.includes("decision_fatigue") ? "I’ll give one best next step." :
      reasons.includes("memory_reminder") ? "I remembered something important." :
      ""
  };
}
