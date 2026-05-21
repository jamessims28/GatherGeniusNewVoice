
export function runAmbientPresenceLayer({ reality = {}, human = {}, predictions = [] } = {}) {
  const shouldSpeak =
    Number(human.stress || 0) > 0.7 ||
    predictions.some(p => p.probability > 0.8) ||
    reality.riskMatrix?.weatherRisk ||
    reality.riskMatrix?.logisticsRisk;

  return {
    layer: "ambient_presence_layer",
    active: true,
    shouldSpeak,
    presenceMode: shouldSpeak ? "protective_guidance" : "quiet_monitoring",
    message:
      shouldSpeak ? "I noticed something that may affect the outcome, so I’m preparing a safer path." : "I’ll keep monitoring quietly."
  };
}
