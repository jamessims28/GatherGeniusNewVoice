
export function buildComfortAwareVoice({ humanTwin, ambient } = {}) {
  const style = humanTwin?.model?.communicationStyle || "friendly-concise";
  const needsAttention = ambient?.ambientState === "needs_attention";

  const settings =
    style === "supportive-human" || needsAttention
      ? { rate: 0.72, pitch: 1.04, volume: 0.88, tone: "gentle supportive friend" }
      : style === "brief-direct"
      ? { rate: 0.88, pitch: 1.02, volume: 0.94, tone: "clear direct friend" }
      : { rate: 0.8, pitch: 1.08, volume: 0.92, tone: "warm natural friend" };

  return {
    layer: "human_comfort_aware_voice",
    settings,
    spokenStyleInstruction: `Speak as a ${settings.tone}. Ask one question at a time. Do not sound robotic.`,
    proactivePhrase:
      needsAttention
        ? "I noticed something that may affect the outcome. I’m preparing a safer path."
        : "I’m here and watching quietly."
  };
}
