"use client";

import { useEffect, useRef, useState } from "react";
import { getInstantCommandResponse } from "../lib/voice/instantResponseEngine";
import { buildVoiceSettings } from "../lib/voice/languageRouter";
import { buildAcknowledgement, shouldRepeatResponse } from "../lib/voice/responseAssurance";
import VoiceInputDevicePanel from "./VoiceInputDevicePanel";

const STORAGE_KEY = "gathergenius-data-permissions";

function speakBrowser(text, onEnd, comfort) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(text);
    const settings = buildVoiceSettings(text);
    message.lang = settings.language || "en-US";
    message.rate = comfort?.voiceRate || settings.rate || 0.82;
    message.pitch = comfort?.voicePitch || settings.pitch || 1.08;
    message.volume = comfort?.voiceVolume || settings.volume || 0.94;
    message.onend = onEnd;
    message.onerror = onEnd;
    window.speechSynthesis.speak(message);
    return true;
  }
  setTimeout(onEnd, 600);
  return false;
}

export default function RealtimeConversationCore() {
  const [messages, setMessages] = useState([
    { role: "Genius", text: "I’m ready. Press Speak and talk naturally. I’ll listen, respond verbally, and type the conversation here." }
  ]);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [currentLock, setCurrentLock] = useState(null);
  const [approvedPermissions, setApprovedPermissions] = useState({});
  const [comfortSettings, setComfortSettings] = useState(null);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
  const [voiceInputMode, setVoiceInputMode] = useState("background");

  const transcriptRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setApprovedPermissions(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function addMessage(role, text) {
    setMessages((items) => [...items, { role, text, at: new Date().toISOString() }]);
  }

  function say(text, comfort = comfortSettings) {
    setSpeaking(true);
    speakBrowser(text, () => setSpeaking(false), comfort);
  }

  async function askForMicOrType() {
    const msg = "I need microphone permission to hear your voice. Please allow microphone access, then press Speak again.";
    addMessage("Genius", msg);
    say(msg);
  }

  async function respondToVoice(text) {
    const clean = String(text || "").trim();
    if (!clean) return;

    const instant = getInstantCommandResponse(clean);
    addMessage("You", clean);
    addMessage("Genius", instant.response);
    say(instant.response);

    try {
      const response = await fetch("/api/conversation/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: clean,
          permissions: approvedPermissions,
          currentLock,
          assistantSpeaking: speaking,
          history: messages,
          location: "Virginia"
        })
      });

      const data = await response.json();
      const answer = data.response || "I understand. I’ll keep this simple.";
      if (data.comfort) setComfortSettings(data.comfort);
      if (data.localAction?.eventLock) setCurrentLock(data.localAction.eventLock);

      const assurance = buildAcknowledgement(answer);
      const finalAnswer = `${assurance.confirmation} ${assurance.followup}`;
      addMessage("Genius", finalAnswer);

      say(
        shouldRepeatResponse(answer)
          ? `${finalAnswer} I’ll repeat the important part. ${answer}`
          : finalAnswer,
        data.comfort || comfortSettings
      );
    } catch {
      const issue = "I had trouble responding. Please check the API route or environment variables, then try speaking again.";
      addMessage("Genius", issue);
      say(issue);
    }
  }

  async function startVoice() {
    if (typeof window === "undefined") return;

    if (selectedAudioDeviceId && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: selectedAudioDeviceId } }
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        await askForMicOrType();
        return;
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg = "This browser does not support speech recognition. Please use Chrome, Edge, or a browser that supports voice input.";
      addMessage("Genius", msg);
      say(msg);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    setListening(true);

    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      respondToVoice(heard);
    };

    recognition.onerror = () => {
      const msg = "I could not hear clearly. Please allow microphone access and try again.";
      addMessage("Genius", msg);
      say(msg);
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      await askForMicOrType();
    }
  }

  return (
    <section className="gg-voice-only-core">
      <div className={`gg-voice-orb ${speaking || listening ? "active" : ""}`}>
        <span />
      </div>

      <div className="gg-voice-badge">
        <i />
        {listening ? "Genius is listening" : speaking ? "Genius is speaking" : "Genius is ready"}
      </div>

      <h1 className="gg-voice-title">
        Speak naturally.
        <span>Genius will guide you.</span>
      </h1>

      <p className="gg-voice-sub">
        Voice only. No typing box. Everything spoken and answered appears in one elegant conversation area.
      </p>

      <div className="gg-voice-conversation">
        <div className="gg-voice-header">
          <strong>Genius</strong>
          <small>voice-only conversation</small>
        </div>

        <div className="gg-voice-transcript" ref={transcriptRef} aria-live="polite">
          {messages.map((item, index) => (
            <div className={`gg-voice-line ${item.role === "You" ? "you" : "genius"}`} key={`${item.role}-${index}-${item.text}`}>
              <b>{item.role}</b>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="gg-voice-action">
          <button className={listening ? "listening" : ""} type="button" onClick={startVoice}>
            {listening ? "LISTENING..." : "SPEAK"}
          </button>
        </div>

        <div className="gg-voice-footer-note">
          Microphone, headset, intercom, proactive voice, and live voice stay in the background. If permission is needed, Genius will ask here.
        </div>

        <VoiceInputDevicePanel
          background={true}
          onDeviceChange={setSelectedAudioDeviceId}
          onModeChange={setVoiceInputMode}
        />
      </div>
    </section>
  );
}
