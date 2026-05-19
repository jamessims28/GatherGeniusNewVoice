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
    message.volume = comfort?.voiceVolume || settings.volume || 0.95;
    message.onend = onEnd;
    message.onerror = onEnd;
    window.speechSynthesis.speak(message);
    return true;
  }
  setTimeout(onEnd, 600);
  return false;
}

export default function RealtimeConversationCore() {
  const [input, setInput] = useState("Genius, help me create what I need.");
  const [messages, setMessages] = useState([
    { role: "Genius", text: "I’m ready. Speak or type naturally. I’ll keep everything in this one box." }
  ]);
  const [speaking, setSpeaking] = useState(false);
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

  async function askForMicOrType() {
    const msg = "I need microphone permission to hear your voice. You can allow the microphone, or type in this same box.";
    addMessage("Genius", msg);
    setSpeaking(true);
    speakBrowser(msg, () => setSpeaking(false), comfortSettings);
  }

  async function respond(textOverride) {
    const text = (textOverride || input).trim();
    if (!text) return;

    const instant = getInstantCommandResponse(text);
    addMessage("You", text);
    addMessage("Genius", instant.response);

    setSpeaking(true);
    speakBrowser(instant.response, () => setSpeaking(false), comfortSettings);

    try {
      const response = await fetch("/api/conversation/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
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

      setSpeaking(true);
      speakBrowser(
        shouldRepeatResponse(answer)
          ? `${finalAnswer} I’ll repeat the important part. ${answer}`
          : finalAnswer,
        () => setSpeaking(false),
        data.comfort || comfortSettings
      );
    } catch {
      const issue = "I had trouble responding. Please check the API route or environment variables. You can still type here.";
      addMessage("Genius", issue);
      setSpeaking(true);
      speakBrowser(issue, () => setSpeaking(false), comfortSettings);
    }
  }

  async function startListening() {
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
      const msg = "This browser does not support speech recognition. Please type in this same box.";
      addMessage("Genius", msg);
      setSpeaking(true);
      speakBrowser(msg, () => setSpeaking(false), comfortSettings);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const part = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += part;
        else interim += part;
      }

      const heard = (finalTranscript || interim).trim();
      if (heard) setInput(heard);
    };

    recognition.onend = () => {
      const heard = finalTranscript.trim();
      if (heard) respond(heard);
    };

    recognition.onerror = () => {
      askForMicOrType();
    };

    recognition.start();
  }

  return (
    <section className="gg-one-box-core">
      <div className={`gg-one-box ${speaking ? "speaking" : ""}`}>
        <div className="gg-one-box-header">
          <span>Genius</span>
          <small>one conversation box</small>
        </div>

        <div className="gg-one-box-transcript" ref={transcriptRef} aria-live="polite">
          {messages.map((item, index) => (
            <div className={`gg-one-line ${item.role === "You" ? "you" : "genius"}`} key={`${item.role}-${index}-${item.text}`}>
              <b>{item.role}</b>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="gg-one-box-input">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Speak or type here..."
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") respond();
            }}
          />
          <div className="gg-one-box-actions">
            <button type="button" onClick={startListening}>Speak</button>
            <button type="button" onClick={() => respond()}>Send</button>
          </div>
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
