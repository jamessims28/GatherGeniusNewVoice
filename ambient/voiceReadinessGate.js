
export async function checkAmbientVoiceReadiness() {
  const checks = {
    browser: typeof window !== "undefined",
    speechRecognition: false,
    speechSynthesis: false,
    mediaDevices: false,
    microphonePermission: "unknown",
    ready: false,
    reason: ""
  };

  if (!checks.browser) {
    checks.reason = "Browser environment unavailable.";
    return checks;
  }

  checks.speechRecognition = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  checks.speechSynthesis = Boolean("speechSynthesis" in window);
  checks.mediaDevices = Boolean(navigator.mediaDevices?.getUserMedia);

  if (!checks.speechRecognition) {
    checks.reason = "Speech recognition is not supported in this browser.";
    return checks;
  }

  if (!checks.speechSynthesis) {
    checks.reason = "Speech output is not supported in this browser.";
    return checks;
  }

  if (!checks.mediaDevices) {
    checks.reason = "Microphone access is not supported in this browser.";
    return checks;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    checks.microphonePermission = "granted";
    checks.ready = true;
    checks.reason = "Voice interaction is ready.";
  } catch {
    checks.microphonePermission = "needed";
    checks.ready = false;
    checks.reason = "Microphone permission is needed before verbal interaction can begin.";
  }

  return checks;
}

export function buildPoliteReadinessGreeting(checks) {
  if (checks.ready) {
    return "Hello, I’m Genius. Everything is ready. You may speak naturally now.";
  }

  if (!checks.speechRecognition) {
    return "Hello, I’m Genius. This browser does not support speech recognition. Please use Chrome or Edge so I can hear you.";
  }

  if (!checks.speechSynthesis) {
    return "Hello, I’m Genius. This browser cannot speak responses yet. Please enable speech output or try another browser.";
  }

  if (checks.microphonePermission === "needed") {
    return "Hello, I’m Genius. I need microphone permission before we begin. Please allow microphone access, then I can listen and respond.";
  }

  return "Hello, I’m Genius. I’m checking voice readiness before we begin.";
}
