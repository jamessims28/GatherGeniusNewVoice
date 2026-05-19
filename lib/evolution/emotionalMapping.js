export function mapEmotionalState({ transcript = "", interactionSpeed = "normal" } = {}) {
  const text = String(transcript).toLowerCase();
  const stressed = ["stress", "worried", "confused", "overwhelmed", "help me", "i don't know"].some((word) => text.includes(word));
  const excited = ["excited", "amazing", "perfect", "love"].some((word) => text.includes(word));

  const emotionalState = stressed ? "stressed" : excited ? "excited" : interactionSpeed === "fast" ? "urgent" : "calm";

  return {
    layer: "emotional_mapping",
    emotionalState,
    voiceRate: stressed ? 0.78 : 0.84,
    visualIntensity: stressed ? "soft" : excited ? "bright" : "balanced",
    decisionLoad: stressed ? "minimum" : "normal",
    message:
      emotionalState === "stressed"
        ? "I’ll slow down, reduce choices, and guide this calmly."
        : "Voice and interface tone are adapted to the user’s current state."
  };
}
