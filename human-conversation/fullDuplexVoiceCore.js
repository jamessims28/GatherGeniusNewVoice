
export class FullDuplexVoiceCore {
  constructor({ onUserText, onAssistantText, onState, onInterrupt, onError } = {}) {
    this.recognition = null;
    this.listening = false;
    this.speaking = false;
    this.continuous = true;
    this.onUserText = onUserText;
    this.onAssistantText = onAssistantText;
    this.onState = onState;
    this.onInterrupt = onInterrupt;
    this.onError = onError;
  }

  isSupported() {
    if (typeof window === "undefined") return false;
    return Boolean((window.SpeechRecognition || window.webkitSpeechRecognition) && "speechSynthesis" in window);
  }

  async requestMicrophone() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone API unavailable.");
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  }

  startListening() {
    if (!this.isSupported() || this.listening) return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    let finalText = "";

    recognition.onstart = () => {
      this.listening = true;
      this.onState?.({ listening: true, speaking: this.speaking, mode: "full_duplex_listening" });
    };

    recognition.onresult = (event) => {
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const part = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += part;
        else interim += part;
      }

      const heard = (finalText || interim).trim();

      if (this.speaking && /wait|stop|hold on|no|actually|pause/i.test(heard)) {
        this.interrupt("barge_in_detected");
        this.onInterrupt?.({ reason: "barge_in_detected", heard });
      }

      if (finalText.trim()) {
        const complete = finalText.trim();
        finalText = "";
        this.onUserText?.(complete);
      }
    };

    recognition.onerror = (event) => {
      this.listening = false;
      this.onError?.(event);
    };

    recognition.onend = () => {
      this.listening = false;
      this.onState?.({ listening: false, speaking: this.speaking, mode: "listening_ended" });
      if (this.continuous) {
        setTimeout(() => this.startListening(), 700);
      }
    };

    this.recognition = recognition;
    recognition.start();
    return true;
  }

  speak(text, voiceSettings = {}) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;

    this.speaking = true;
    this.onState?.({ listening: this.listening, speaking: true, mode: "assistant_speaking" });
    this.onAssistantText?.(text);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceSettings.lang || "en-US";
    utterance.rate = voiceSettings.rate || 0.82;
    utterance.pitch = voiceSettings.pitch || 1.08;
    utterance.volume = voiceSettings.volume || 0.94;

    const voices = window.speechSynthesis.getVoices?.() || [];
    const preferred =
      voices.find((voice) => /samantha|victoria|zira|jenny|aria|natural|female/i.test(voice.name)) ||
      voices.find((voice) => voice.lang?.startsWith("en")) ||
      voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      this.speaking = false;
      this.onState?.({ listening: this.listening, speaking: false, mode: "assistant_finished" });
    };

    utterance.onerror = () => {
      this.speaking = false;
      this.onState?.({ listening: this.listening, speaking: false, mode: "assistant_error" });
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  interrupt(reason = "manual_interrupt") {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.speaking = false;
    this.onState?.({ listening: this.listening, speaking: false, mode: "interrupted", reason });
    return { interrupted: true, reason };
  }

  stop() {
    this.continuous = false;
    try { this.recognition?.abort?.(); } catch {}
    try { window?.speechSynthesis?.cancel?.(); } catch {}
    this.listening = false;
    this.speaking = false;
  }
}
