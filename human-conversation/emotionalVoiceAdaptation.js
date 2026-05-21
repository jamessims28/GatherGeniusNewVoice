
export function detectEmotionalState({ text = "", history = [] } = {}) {
  const t = String(text || "").toLowerCase();

  const stress = /overwhelmed|worried|stress|confused|tired|angry|frustrated|anxious/.test(t);
  const excited = /excited|great|amazing|love|perfect|beautiful|excellent/.test(t);
  const urgent = /urgent|asap|now|today|quick|fast/.test(t);
  const hesitant = /maybe|not sure|i don't know|unsure|wait/.test(t);

  return {
    layer: "emotional_voice_adaptation",
    stress,
    excited,
    urgent,
    hesitant,
    state:
      stress ? "reassuring" :
      excited ? "energized" :
      urgent ? "focused_fast" :
      hesitant ? "patient_clarifying" :
      "warm_neutral",
    confidence: stress || excited || urgent || hesitant ? 0.86 : 0.62
  };
}

export function getVoiceSettingsForEmotion(emotion = {}) {
  switch (emotion.state) {
    case "reassuring":
      return { rate: 0.72, pitch: 1.02, volume: 0.88, tone: "calm and reassuring" };
    case "energized":
      return { rate: 0.9, pitch: 1.12, volume: 0.96, tone: "bright and engaged" };
    case "focused_fast":
      return { rate: 0.96, pitch: 1.06, volume: 0.94, tone: "clear and efficient" };
    case "patient_clarifying":
      return { rate: 0.76, pitch: 1.04, volume: 0.9, tone: "patient and clear" };
    default:
      return { rate: 0.82, pitch: 1.08, volume: 0.94, tone: "warm and natural" };
  }
}
