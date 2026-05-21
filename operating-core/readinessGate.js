
export async function runOperatingReadinessGate({ selectedAudioDeviceId = "", requireLiveVoice = false } = {}) {
  const gate = {
    layer: "operating_readiness_gate",
    browser: typeof window !== "undefined",
    speechRecognition: false,
    speechSynthesis: false,
    mediaDevices: false,
    microphone: "unknown",
    liveVoice: requireLiveVoice ? "required" : "optional",
    ready: false,
    blockers: [],
    warnings: [],
    enabled: []
  };

  if (!gate.browser) {
    gate.blockers.push("browser_unavailable");
    return gate;
  }

  gate.speechRecognition = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  gate.speechSynthesis = Boolean("speechSynthesis" in window);
  gate.mediaDevices = Boolean(navigator.mediaDevices?.getUserMedia);

  if (gate.speechRecognition) gate.enabled.push("speech_recognition");
  else gate.blockers.push("speech_recognition_unavailable");

  if (gate.speechSynthesis) gate.enabled.push("speech_synthesis");
  else gate.blockers.push("speech_synthesis_unavailable");

  if (gate.mediaDevices) gate.enabled.push("microphone_api");
  else gate.blockers.push("microphone_api_unavailable");

  if (gate.blockers.length) return gate;

  try {
    const constraints = selectedAudioDeviceId
      ? { audio: { deviceId: { exact: selectedAudioDeviceId } } }
      : { audio: true };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const audioTracks = stream.getAudioTracks();
    stream.getTracks().forEach((track) => track.stop());

    gate.microphone = audioTracks.length ? "granted" : "not_found";
    if (audioTracks.length) gate.enabled.push("microphone_permission");
    else gate.blockers.push("microphone_not_found");
  } catch {
    gate.microphone = "needed";
    gate.blockers.push("microphone_permission_needed");
  }

  if (requireLiveVoice && !process.env.NEXT_PUBLIC_REALTIME_VOICE_ENABLED) {
    gate.warnings.push("live_voice_not_configured_using_browser_voice");
  }

  gate.ready = gate.blockers.length === 0;
  return gate;
}

export function buildReadinessPrompt(gate) {
  if (gate.ready) {
    return "Everything needed for voice is enabled. You may speak naturally now.";
  }

  if (gate.blockers.includes("microphone_permission_needed")) {
    return "I need microphone permission before I can hear you. Please allow microphone access.";
  }

  if (gate.blockers.includes("speech_recognition_unavailable")) {
    return "This browser does not support speech recognition. Chrome or Edge is recommended.";
  }

  if (gate.blockers.includes("speech_synthesis_unavailable")) {
    return "This browser cannot speak responses right now.";
  }

  if (gate.blockers.includes("microphone_not_found")) {
    return "I could not find a microphone. Please connect a microphone, headset, or intercom input.";
  }

  return "I need one item enabled before we continue.";
}
