"use client";

import { motion } from "framer-motion";
import VoiceInputDevicePanel from "./VoiceInputDevicePanel";
import { buildAcknowledgement, shouldRepeatResponse } from "../lib/voice/responseAssurance";
import { buildVoiceSettings } from "../lib/voice/languageRouter";
import { shouldSpeakProactively } from "../lib/voice/proactiveVoiceEngine";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "gathergenius-data-permissions";

function speakBrowser(text, onEnd, comfort) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(text);
    const settings = buildVoiceSettings(text);
    message.lang = settings.language;
    message.rate = comfort?.voiceRate || settings.rate;
    message.pitch = comfort?.voicePitch || settings.pitch;
    message.volume = comfort?.voiceVolume || settings.volume;
    message.onend = onEnd;
    message.onerror = onEnd;
    window.speechSynthesis.speak(message);
    return;
  }
  setTimeout(onEnd, 2000);
}

export default function RealtimeConversationCore() {
  const [status, setStatus] = useState("Ready");
  const [input, setInput] = useState("Genius, talk with me like a friend and help me build what I need");
  const [messages, setMessages] = useState([
    { role: "GeniusGather", text: "I’m here with you. Talk to me naturally, like a friend, and I’ll help you get the result." }
  ]);
  const [speaking, setSpeaking] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("Not connected");
  const [currentLock, setCurrentLock] = useState(null);
  const [comfortSettings, setComfortSettings] = useState(null);
  const [approvedPermissions, setApprovedPermissions] = useState({});
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
  const [voiceInputMode, setVoiceInputMode] = useState("computer");
  const [proactiveVoice, setProactiveVoice] = useState(true);
  const [lastProactiveAt, setLastProactiveAt] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setApprovedPermissions(JSON.parse(saved));
    } catch {}
  }, []);

  async function createRealtimeSession() {
    setSessionStatus("Creating realtime session...");
    try {
      const response = await fetch("/api/voice/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedContext: JSON.stringify(approvedPermissions), currentState: status })
      });
      const data = await response.json();

      if (!data.ok) {
        setSessionStatus(data.message || "Realtime session not available. Using browser voice fallback.");
        return;
      }

      setSessionStatus("Realtime session ready");
    } catch (error) {
      setSessionStatus("Realtime session failed. Browser voice fallback is active.");
    }
  }

  async function respond() {
    const text = input.trim();
    if (!text) return;

    setStatus("Thinking");
    setMessages((items) => [...items, { role: "You", text }]);

    try {
      const response = await fetch("/api/conversation/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          permissions: approvedPermissions,
          currentLock,
          assistantSpeaking: speaking,
          history: messages
        })
      });

      const data = await response.json();
      if (data.interruption?.shouldInterrupt && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      const answer = data.response || "I understand. I’ll keep this simple.";
      const assurance = buildAcknowledgement(answer);
      const enhancedAnswer = `${assurance.heard} ${assurance.processing} ${assurance.confirmation} ${assurance.followup}`;
      if (data.comfort) setComfortSettings(data.comfort);

      if (data.localAction?.eventLock) setCurrentLock(data.localAction.eventLock);

      setMessages((items) => [...items, { role: "GeniusGather", text: answer }]);
      setStatus(data.action === "build_experience" ? "Result produced" : "Ready");
      if (data.action === "estimate_price") setTimeout(() => speakProactively("pricing_available"), 600);
      if (data.action === "request_permission") setTimeout(() => speakProactively("permission_needed"), 600);

      setSpeaking(true);
      speakBrowser(
        shouldRepeatResponse(answer)
          ? `${enhancedAnswer} I will repeat the important details again. ${answer}`
          : enhancedAnswer,
        () => setSpeaking(false),
        data.comfort || comfortSettings
      );
    } catch (error) {
      const issue = "I had trouble responding. The safest next step is to check the API route or environment variables.";
      setMessages((items) => [...items, { role: "GeniusGather", text: issue }]);
      setStatus("Issue");
      setSpeaking(true);
      speakBrowser(issue, () => setSpeaking(false), comfortSettings);
    }
  }

  async function startBrowserDictation() {
    if (selectedAudioDeviceId && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: selectedAudioDeviceId } }
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setMessages((items) => [...items, { role: "Genius", text: "I could not access that audio input. Please choose another microphone or allow permission." }]);
        return;
      }
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg = "Browser speech recognition is not available here. You can still type or connect the OpenAI Realtime session.";
      setMessages((items) => [...items, { role: "GeniusGather", text: msg }]);
      speakBrowser(msg, () => null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setStatus("Listening");
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInput(transcript);
      setStatus("Heard you");
    };

    recognition.onerror = () => {
      setStatus("Issue");
      const msg = "I could not hear clearly. Please try again or type it once.";
      setMessages((items) => [...items, { role: "GeniusGather", text: msg }]);
      speakBrowser(msg, () => null);
    };
  }


  function speakProactively(trigger = "idle_checkin") {
    const check = shouldSpeakProactively({
      enabled: proactiveVoice,
      lastSpokenAt: lastProactiveAt,
      trigger
    });

    if (!check.allowed) return;

    const text = check.moment.message;
    setMessages((items) => [...items, { role: "Genius", text }]);
    setLastProactiveAt(Date.now());
    setSpeaking(true);
    speakBrowser(text, () => setSpeaking(false), comfortSettings);
  }

  return (
    <section className="gg-realtime-core">
      <motion.div
        className={`gg-realtime-spark ${speaking ? "speaking" : ""}`}
        animate={speaking ? { scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] } : { scale: [1, 1.02, 1] }}
        transition={{ duration: speaking ? 1.2 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span />
      </motion.div>

      <div className="gg-realtime-main">
        
        <h2>How can I help you today?</h2>
        <p className="gg-note">
          Talk naturally. Genius listens, reflects your thought, responds, and hands the conversation back to you.
        </p>

        <VoiceInputDevicePanel
          background={true}
          onDeviceChange={setSelectedAudioDeviceId}
          onModeChange={setVoiceInputMode}
        />

        <div className="gg-realtime-input">
          <input value={input} onChange={(event) => setInput(event.target.value)} />
          <button className="gg-btn green" type="button" onClick={respond}>ANSWER</button>
        </div>

        <div className="gg-proactive-controls">
          <button className="gg-btn secondary" type="button" onClick={() => setProactiveVoice(!proactiveVoice)}>
            PROACTIVE VOICE: {proactiveVoice ? "ON" : "OFF"}
          </button>
          <button className="gg-btn secondary" type="button" onClick={() => speakProactively("idle_checkin")}>
            LET GENIUS SPEAK FIRST
          </button>
        </div>

        <div className="gg-realtime-actions">
          <button className="gg-btn secondary" type="button" onClick={startBrowserDictation}>TALK</button>
          <button className="gg-btn secondary" type="button" onClick={createRealtimeSession}>ENABLE LIVE VOICE</button>
          <span>{sessionStatus}</span>
        </div>

        <div className="gg-realtime-thread">
          {messages.slice(-6).map((item, index) => (
            <div className={`gg-bubble ${item.role === "You" ? "you" : "ai"}`} key={`${item.role}-${index}`}>
              <b>{item.role}</b>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {currentLock && (
          <div className="gg-realtime-result">
            <div className="gg-line"><span>Result</span><strong>{currentLock.name}</strong></div>
            <div className="gg-line"><span>Confidence</span><strong>{currentLock.confidenceScore}%</strong></div>
            <div className="gg-line"><span>Deposit</span><strong>${Number(currentLock.deposit || 0).toLocaleString()}</strong></div>
          </div>
        )}

        <audio ref={audioRef} hidden />
      </div>
    </section>
  );
}
