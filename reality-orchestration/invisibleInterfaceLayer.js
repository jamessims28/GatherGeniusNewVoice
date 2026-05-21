
export function runInvisibleInterfaceLayer({ listening = false, speaking = false, risk = false, shouldSpeak = false } = {}) {
  return {
    layer: "invisible_interface_layer",
    visibleComplexity: "minimal",
    landingPageMode: "orb_voice_conversation_only",
    backgroundSystemsHidden: true,
    orbState:
      risk ? "protective_glow" :
      speaking ? "active_pulse" :
      listening ? "ambient_wave" :
      shouldSpeak ? "soft_attention" :
      "idle_presence",
    interfacePrinciple: "minimal visible interface, maximum background intelligence"
  };
}
