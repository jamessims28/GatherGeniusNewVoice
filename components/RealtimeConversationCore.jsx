"use client";

import { useEffect, useRef, useState } from "react";
import { getInstantCommandResponse } from "../lib/voice/instantResponseEngine";
import { buildVoiceSettings } from "../lib/voice/languageRouter";
import { buildAcknowledgement, shouldRepeatResponse } from "../lib/voice/responseAssurance";
import { checkAmbientVoiceReadiness, buildPoliteReadinessGreeting } from "../lib/ambient/voiceReadinessGate";
import { buildAmbientOperatingState } from "../lib/ambient/ambientOperatingLayer";
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
    { role: "Genius", text: "Hello. I’m Genius. I’m checking that voice interaction is ready before we begin." }
  ]);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [ready, setReady] = useState(false);
  const [readiness, setReadiness] = useState(null);
  const [currentLock, setCurrentLock] = useState(null);
  const [approvedPermissions, setApprovedPermissions] = useState({});
  const [comfortSettings, setComfortSettings] = useState(null);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
  const [voiceInputMode, setVoiceInputMode] = useState("background");
  const [ambientState, setAmbientState] = useState(null);
  const [orbPosition, setOrbPosition] = useState({ x: 50, y: 13 });

  const transcriptRef = useRef(null);
  const recognitionRef = useRef(null);
  const userStartedRef = useRef(false);
  const listeningTimerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setApprovedPermissions(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    prepareAmbientVoice(false);
    return () => {
      if (listeningTimerRef.current) clearTimeout(listeningTimerRef.current);
      try { recognitionRef.current?.abort?.(); } catch {}
    };
  }, []);

  useEffect(() => {
    const path = [
      { x: 50, y: 13 },
      { x: 16, y: 20 },
      { x: 82, y: 18 },
      { x: 88, y: 52 },
      { x: 52, y: 88 },
      { x: 14, y: 82 },
      { x: 10, y: 46 },
      { x: 68, y: 70 },
      { x: 50, y: 13 }
    ];

    let index = 0;

    function moveOrbAcrossPage() {
      index = (index + 1) % path.length;
      setOrbPosition(path[index]);
    }

    const interval = setInterval(moveOrbAcrossPage, speaking ? 1150 : 1850);
    return () => clearInterval(interval);
  }, [speaking, listening]);

  function addMessage(role, text) {
    setMessages((items) => [...items, { role, text, at: new Date().toISOString() }]);
  }

  function say(text, comfort = comfortSettings, after) {
    setSpeaking(true);
    speakBrowser(text, () => {
      setSpeaking(false);
      if (typeof after === "function") after();
    }, comfort);
  }

  async function prepareAmbientVoice(userGesture = false) {
    const checks = await checkAmbientVoiceReadiness();
    setReadiness(checks);
    setReady(Boolean(checks.ready));

    const greeting = buildPoliteReadinessGreeting(checks);
    addMessage("Genius", greeting);

    const state = buildAmbientOperatingState({
      text: greeting,
      readiness: checks,
      conversation: messages
    });
    setAmbientState(state);

    if (checks.ready) {
      say(greeting, comfortSettings, () => startListeningLoop());
      return;
    }

    if (userGesture || checks.microphonePermission === "needed") {
      say(greeting);
    }
  }

  async function respondToVoice(text) {
    const clean = String(text || "").trim();
    if (!clean) return;

    const operating = buildAmbientOperatingState({
      text: clean,
      readiness: readiness || { ready },
      conversation: messages
    });
    setAmbientState(operating);

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
          location: "Virginia",
          ambientOperatingState: operating
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
        data.comfort || comfortSettings,
        () => startListeningLoop()
      );
    } catch {
      const issue = "I had trouble responding. I’ll keep listening once the connection is stable. Please check the API route or environment variables.";
      addMessage("Genius", issue);
      say(issue, comfortSettings, () => startListeningLoop());
    }
  }

  async function startListeningLoop() {
    if (!ready || speaking || listening) return;
    if (typeof window === "undefined") return;

    if (selectedAudioDeviceId && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: selectedAudioDeviceId } }
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        const msg = "I need access to the selected audio input before I can listen. Please allow microphone access.";
        addMessage("Genius", msg);
        say(msg);
        return;
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg = "Speech recognition is not available in this browser. Please use Chrome or Edge for seamless voice.";
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

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      setListening(false);
      respondToVoice(heard);
    };

    recognition.onerror = () => {
      setListening(false);
      const msg = "I could not hear clearly. I’ll try again, but I may need microphone permission.";
      addMessage("Genius", msg);
      say(msg, comfortSettings, () => scheduleListenRestart());
    };

    recognition.onend = () => {
      setListening(false);
      if (!speaking) scheduleListenRestart();
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      scheduleListenRestart();
    }
  }

  function scheduleListenRestart() {
    if (listeningTimerRef.current) clearTimeout(listeningTimerRef.current);
    listeningTimerRef.current = setTimeout(() => {
      if (ready && !speaking) startListeningLoop();
    }, 900);
  }

  function beginFromUserGesture() {
    if (userStartedRef.current) return;
    userStartedRef.current = true;
    prepareAmbientVoice(true);
  }

  return (
    <section className="gg-nextgen-ambient" onClick={beginFromUserGesture} onTouchStart={beginFromUserGesture}>
      <div
        className={`gg-roaming-orb ${speaking ? "speaking" : ""} ${listening ? "listening" : ""}`}
        style={{ left: `${orbPosition.x}%`, top: `${orbPosition.y}%` }}
      >
        <span />
      </div>

      <div className="gg-ambient-stage">
        <div className="gg-ambient-badge">
          <i />
          {ready ? (listening ? "Genius is listening" : speaking ? "Genius is speaking" : "Ambient voice ready") : "Voice readiness required"}
        </div>

        <h1 className="gg-ambient-title">
          Speak naturally.
          <span>Genius will guide you.</span>
        </h1>

        <p className="gg-ambient-sub">
          Genius checks what must be enabled first, greets politely, then listens and responds without buttons.
        </p>

        <div className="gg-ambient-conversation">
          <div className="gg-ambient-header">
            <strong>Genius</strong>
            <small>{ambientState?.mode || "ambient operating layer"}</small>
          </div>

          <div className="gg-ambient-transcript" ref={transcriptRef} aria-live="polite">
            {messages.map((item, index) => (
              <div className={`gg-ambient-line ${item.role === "You" ? "you" : "genius"}`} key={`${item.role}-${index}-${item.text}`}>
                <b>{item.role}</b>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="gg-ambient-status">
            <span>{ready ? "All required voice systems enabled" : readiness?.reason || "Checking voice readiness"}</span>
            <span>Mic / headset / intercom in background</span>
          </div>

          <VoiceInputDevicePanel
            background={true}
            onDeviceChange={setSelectedAudioDeviceId}
            onModeChange={setVoiceInputMode}
          />
        </div>
      </div>
    </section>
  );
}
