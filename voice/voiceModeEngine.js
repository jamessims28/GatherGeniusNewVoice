
export function getVoiceModeSupport() {
  if (typeof window === "undefined") {
    return {
      browser: false,
      speechRecognition: false,
      speechSynthesis: false,
      microphone: false,
      ready: false,
      message: "Voice Mode needs a browser."
    };
  }

  const speechRecognition = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const speechSynthesis = Boolean("speechSynthesis" in window);
  const microphone = Boolean(navigator.mediaDevices?.getUserMedia);

  return {
    browser: true,
    speechRecognition,
    speechSynthesis,
    microphone,
    ready: speechRecognition && speechSynthesis && microphone,
    message:
      speechRecognition && speechSynthesis && microphone
        ? "Voice Mode is supported."
        : "Voice Mode needs Chrome or Edge with microphone permission."
  };
}

export async function requestVoiceModePermission() {
  const support = getVoiceModeSupport();

  if (!support.ready) {
    return {
      ...support,
      permission: "unavailable",
      enabled: false,
      message: support.message
    };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());

    return {
      ...support,
      permission: "granted",
      enabled: true,
      message: "Voice Mode is enabled. You can speak naturally now."
    };
  } catch {
    return {
      ...support,
      permission: "needed",
      enabled: false,
      message: "Please allow microphone permission to use Voice Mode."
    };
  }
}

export function speakVoiceMode(text = "", options = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(String(text));
  utterance.rate = options.rate || 0.82;
  utterance.pitch = options.pitch || 1.08;
  utterance.volume = options.volume || 0.94;
  utterance.lang = options.lang || "en-US";

  const voices = window.speechSynthesis.getVoices?.() || [];
  const preferred =
    voices.find((voice) => /samantha|victoria|zira|jenny|aria|natural|female/i.test(voice.name)) ||
    voices.find((voice) => voice.lang?.startsWith("en")) ||
    voices[0];

  if (preferred) utterance.voice = preferred;

  if (typeof options.onEnd === "function") utterance.onend = options.onEnd;
  if (typeof options.onError === "function") utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
  return true;
}

export function createVoiceRecognition({ onText, onStart, onEnd, onError } = {}) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => onStart?.();
  recognition.onend = () => onEnd?.();
  recognition.onerror = (event) => onError?.(event);
  recognition.onresult = (event) => {
    const text = event.results?.[0]?.[0]?.transcript || "";
    onText?.(text);
  };

  return recognition;
}
