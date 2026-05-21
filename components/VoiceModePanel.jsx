"use client";

import { useRef, useState } from "react";
import { createVoiceRecognition, requestVoiceModePermission, speakVoiceMode } from "../lib/voice/voiceModeEngine";

export default function VoiceModePanel() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("Tap Enable Voice Mode to begin.");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    { role: "Genius", text: "Voice Mode is ready to be enabled." }
  ]);

  const recognitionRef = useRef(null);

  function addMessage(role, text) {
    setMessages((items) => [...items, { role, text }]);
  }

  async function enableVoiceMode() {
    const result = await requestVoiceModePermission();
    setStatus(result.message);

    if (!result.enabled) {
      addMessage("Genius", result.message);
      speakVoiceMode(result.message);
      return;
    }

    setEnabled(true);
    addMessage("Genius", "Voice Mode is enabled. Speak naturally.");
    speakVoiceMode("Voice Mode is enabled. Speak naturally.");
  }

  async function handleVoiceText(text) {
    const clean = String(text || "").trim();
    if (!clean) return;

    addMessage("You", clean);
    setStatus("Processing voice request...");

    try {
      const response = await fetch("/api/operating-core/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: clean,
          readiness: { ready: true, enabled: ["voice_mode"] },
          location: "Virginia"
        })
      });

      const data = await response.json();
      const answer = data.response || "I understand. I can guide the next safe step.";

      addMessage("Genius", answer);
      setStatus("Voice Mode ready.");
      speakVoiceMode(answer);
    } catch {
      const fallback = "I had trouble reaching the operating core. Please check the API route and try again.";
      addMessage("Genius", fallback);
      setStatus("Voice Mode issue.");
      speakVoiceMode(fallback);
    }
  }

  function startListening() {
    if (!enabled) {
      enableVoiceMode();
      return;
    }

    const recognition = createVoiceRecognition({
      onStart: () => {
        setListening(true);
        setStatus("Listening...");
      },
      onEnd: () => {
        setListening(false);
        setStatus("Voice Mode ready.");
      },
      onError: () => {
        setListening(false);
        const msg = "I could not hear clearly. Please try again.";
        setStatus(msg);
        addMessage("Genius", msg);
        speakVoiceMode(msg);
      },
      onText: handleVoiceText
    });

    recognitionRef.current = recognition;

    if (!recognition) {
      const msg = "This browser does not support voice recognition. Please use Chrome or Edge.";
      setStatus(msg);
      addMessage("Genius", msg);
      speakVoiceMode(msg);
      return;
    }

    recognition.start();
  }

  return (
    <section className="gg-voice-mode-panel">
      <div className={`gg-voice-mode-orb ${listening ? "listening" : ""}`}><span /></div>

      <div className="gg-voice-mode-card">
        <div className="gg-voice-mode-header">
          <strong>GatherGenius Voice Mode</strong>
          <small>{status}</small>
        </div>

        <div className="gg-voice-mode-transcript">
          {messages.map((message, index) => (
            <div className={`gg-voice-mode-line ${message.role === "You" ? "you" : "genius"}`} key={`${message.role}-${index}`}>
              <b>{message.role}</b>
              <span>{message.text}</span>
            </div>
          ))}
        </div>

        <button className="gg-voice-mode-button" type="button" onClick={startListening}>
          {enabled ? (listening ? "LISTENING..." : "TALK") : "ENABLE VOICE MODE"}
        </button>
      </div>
    </section>
  );
}
