
export function buildRealtimeVoiceOperatingSystem({ language = "en-US", emotion = "warm", mode = "ambient" } = {}) {
  return {
    layer: "realtime_voice_operating_system",
    fullDuplex: true,
    interruptionHandling: true,
    streamingResponses: true,
    emotionalAdaptation: true,
    multilingualSwitching: true,
    ambientListening: process.env.AMBIENT_LISTENING_ENABLED === "true",
    proactiveSpeechTiming: true,
    language,
    emotion,
    mode,
    voiceSettings: getVoiceSettings(emotion),
    safety: {
      requiresMicPermission: true,
      requiresUserGesture: true,
      canListenInBackground: process.env.AMBIENT_LISTENING_ENABLED === "true"
    }
  };
}

function getVoiceSettings(emotion) {
  if (emotion === "calm") return { rate: 0.74, pitch: 1.02, volume: 0.88 };
  if (emotion === "urgent") return { rate: 0.95, pitch: 1.05, volume: 0.94 };
  if (emotion === "excited") return { rate: 0.9, pitch: 1.12, volume: 0.96 };
  return { rate: 0.82, pitch: 1.08, volume: 0.94 };
}
