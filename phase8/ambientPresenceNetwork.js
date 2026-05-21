
export function runAmbientPresenceNetwork({ voice = {}, predictions = {}, relationship = {}, permissions = {} } = {}) {
  const shouldSpeak =
    predictions.failureRisk === "elevated" ||
    relationship.toneAdaptation === "reassuring" ||
    voice.mode === "ambient_alert";

  return {
    layer: "ambient_presence_network",
    invisible: true,
    alwaysAware: true,
    listeningWithPermission: Boolean(permissions.microphone || voice.safety?.canListenInBackground),
    softlyProactive: shouldSpeak,
    conversationalMode: relationship.toneAdaptation || "warm_direct",
    message: shouldSpeak
      ? "I noticed something important and prepared a safer path."
      : "I’ll stay quietly aware and only speak when useful."
  };
}
