
export async function runReadinessGate({ selectedAudioDeviceId = "" } = {}) {
  const support = {
    browser: typeof window !== "undefined",
    speechRecognition: false,
    speechSynthesis: false,
    mediaDevices: false,
    microphone: "unknown",
    ready: false,
    blockers: []
  };

  if (!support.browser) {
    support.blockers.push("browser_unavailable");
    return support;
  }

  support.speechRecognition = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  support.speechSynthesis = Boolean("speechSynthesis" in window);
  support.mediaDevices = Boolean(navigator.mediaDevices?.getUserMedia);

  if (!support.speechRecognition) support.blockers.push("speech_recognition_unavailable");
  if (!support.speechSynthesis) support.blockers.push("speech_synthesis_unavailable");
  if (!support.mediaDevices) support.blockers.push("microphone_api_unavailable");

  if (support.blockers.length) {
    return support;
  }

  try {
    const constraints = selectedAudioDeviceId
      ? { audio: { deviceId: { exact: selectedAudioDeviceId } } }
      : { audio: true };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach((track) => track.stop());
    support.microphone = "granted";
  } catch {
    support.microphone = "needed";
    support.blockers.push("microphone_permission_needed");
  }

  support.ready = support.blockers.length === 0;
  return support;
}

export function readinessMessage(gate) {
  if (gate.ready) return "Everything is ready. You may speak naturally now.";
  if (gate.blockers.includes("microphone_permission_needed")) return "I need microphone permission before I can hear you.";
  if (gate.blockers.includes("speech_recognition_unavailable")) return "This browser does not support voice recognition. Please use Chrome or Edge.";
  if (gate.blockers.includes("speech_synthesis_unavailable")) return "This browser cannot speak responses right now.";
  return "I’m checking what needs to be enabled before we begin.";
}
