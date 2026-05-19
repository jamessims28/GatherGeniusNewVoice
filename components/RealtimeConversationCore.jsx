"use client";

import { useEffect, useRef, useState } from "react";
import { getInstantCommandResponse } from "../lib/voice/instantResponseEngine";
import { buildVoiceSettings } from "../lib/voice/languageRouter";
import { buildAcknowledgement, shouldRepeatResponse } from "../lib/voice/responseAssurance";
import { buildAmbientOperatingState } from "../lib/ambient/ambientOperatingLayer";
import VoiceInputDevicePanel from "./VoiceInputDevicePanel";

const STORAGE_KEY = "gathergenius-data-permissions";

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function getVoiceSupport() {
  if (typeof window === "undefined") {
    return { browser: false, recognition: false, synthesis: false, media: false };
  }

  return {
    browser: true,
    recognition: Boolean(getSpeechRecognition()),
    synthesis: Boolean("speechSynthesis" in window),
    media: Boolean(navigator.mediaDevices?.getUserMedia)
  };
}

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

    const voices = window.speechSynthesis.getVoices?.() || [];
    const preferred =
      voices.find((voice) => /female|samantha|victoria|zira|jenny|aria|natural/i.test(voice.name)) ||
      voices.find((voice) => voice.lang?.startsWith("en")) ||
      voices[0];

    if (preferred) message.voice = preferred;

    window.speechSynthesis.speak(message);
    return true;
  }

  setTimeout(onEnd, 600);
  return false;
}

export default function RealtimeConversationCore() {
  const [messages, setMessages] = useState([
    { role: "Genius", text: "Hello, I’m Genius. Tap anywhere once so I can enable voice safely." }
  ]);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceUnlocked, setVoiceUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [readinessMessage, setReadinessMessage] = useState("Tap anywhere once to enable voice.");
  const [currentLock, setCurrentLock] = useState(null);
  const [approvedPermissions, setApprovedPermissions] = useState({});
  const [comfortSettings, setComfortSettings] = useState(null);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
  const [voiceInputMode, setVoiceInputMode] = useState("background");
  const [ambientState, setAmbientState] = useState(null);
  const [orbPosition, setOrbPosition] = useState({ x: 50, y: 13 });

  const transcriptRef = useRef(null);
  const recognitionRef = useRef(null);
  const listeningTimerRef = useRef(null);
  const unlockedRef = useRef(false);
  const speakingRef = useRef(false);
  const listeningRef = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setApprovedPermissions(JSON.parse(saved));
    } catch {}

    const support = getVoiceSupport();
    if (!support.recognition) {
      setReadinessMessage("Speech recognition needs Chrome or Edge.");
      addMessage("Genius", "This browser may not support speech recognition. Chrome or Edge works best.");
    } else if (!support.synthesis) {
      setReadinessMessage("Speech output is not available.");
      addMessage("Genius", "Speech output is not available in this browser.");
    }
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  useEffect(() => {
    return () => {
      if (listeningTimerRef.current) clearTimeout(listeningTimerRef.current);
      try { recognitionRef.current?.abort?.(); } catch {}
      try { window?.speechSynthesis?.cancel?.(); } catch {}
    };
  }, []);

  function addMessage(role, text) {
    setMessages((items) => {
      const last = items[items.length - 1];
      if (last?.role === role && last?.text === text) return items;
      return [...items, { role, text, at: new Date().toISOString() }];
    });
  }

  function say(text, comfort = comfortSettings, after) {
    setSpeaking(true);
    const didSpeak = speakBrowser(text, () => {
      setSpeaking(false);
      if (typeof after === "function") after();
    }, comfort);

    if (!didSpeak && typeof after === "function") after();
  }

  async function unlockVoice() {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    setVoiceUnlocked(true);

    const support = getVoiceSupport();

    if (!support.recognition) {
      const msg = "Hello, I’m Genius. This browser does not support voice recognition. Please use Chrome or Edge so I can listen.";
      setReadinessMessage("Speech recognition unavailable.");
      addMessage("Genius", msg);
      say(msg);
      return;
    }

    if (!support.synthesis) {
      const msg = "Hello, I’m Genius. Speech output is not available in this browser.";
      setReadinessMessage("Speech output unavailable.");
      addMessage("Genius", msg);
      return;
    }

    if (!support.media) {
      const msg = "Hello, I’m Genius. Microphone access is not available in this browser.";
      setReadinessMessage("Microphone access unavailable.");
      addMessage("Genius", msg);
      say(msg);
      return;
    }

    // Unlock speech synthesis after the user gesture.
    try {
      const warmup = new SpeechSynthesisUtterance(" ");
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
      window.speechSynthesis.cancel();
      window.speechSynthesis.getVoices?.();
    } catch {}

    try {
      const constraints = selectedAudioDeviceId
        ? { audio: { deviceId: { exact: selectedAudioDeviceId } } }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      stream.getTracks().forEach((track) => track.stop());

      setReady(true);
      setReadinessMessage("Voice enabled. Listening now.");

      const greeting = "Hello, I’m Genius. Thank you. Voice is enabled now. You can speak naturally.";
      addMessage("Genius", greeting);
      say(greeting, comfortSettings, () => scheduleListenRestart(350));
    } catch {
      const msg = "Hello, I’m Genius. I need microphone permission before I can hear you. Please allow microphone access, then tap the page again.";
      setReady(false);
      setReadinessMessage("Microphone permission needed.");
      addMessage("Genius", msg);
      say(msg);
      unlockedRef.current = false;
      setVoiceUnlocked(false);
    }
  }

  async function respondToVoice(text) {
    const clean = String(text || "").trim();
    if (!clean) return;

    const operating = buildAmbientOperatingState({
      text: clean,
      readiness: { ready },
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
          assistantSpeaking: speakingRef.current,
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
        () => scheduleListenRestart(700)
      );
    } catch {
      const issue = "I had trouble reaching the response service. I can still hear you once the connection is stable. Please check the API route or environment variables.";
      addMessage("Genius", issue);
      say(issue, comfortSettings, () => scheduleListenRestart(900));
    }
  }

  function scheduleListenRestart(delay = 900) {
    if (listeningTimerRef.current) clearTimeout(listeningTimerRef.current);
    listeningTimerRef.current = setTimeout(() => {
      if (ready && voiceUnlocked && !speakingRef.current && !listeningRef.current) {
        startListeningLoop();
      }
    }, delay);
  }

  function startListeningLoop() {
    if (!ready || !voiceUnlocked || speakingRef.current || listeningRef.current) return;

    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      const msg = "Speech recognition is not available. Please use Chrome or Edge.";
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

    recognition.onstart = () => {
      setListening(true);
      setReadinessMessage("Listening now.");
    };

    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      setListening(false);
      setReadinessMessage("Processing voice.");
      respondToVoice(heard);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        const msg = "I need microphone permission to listen. Please allow microphone access in your browser.";
        setReadinessMessage("Microphone permission needed.");
        addMessage("Genius", msg);
        say(msg);
        return;
      }

      setReadinessMessage("Listening paused. I’ll try again.");
      scheduleListenRestart(1200);
    };

    recognition.onend = () => {
      setListening(false);
      if (!speakingRef.current) scheduleListenRestart(850);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      scheduleListenRestart(1000);
    }
  }

  return (
    <section className="gg-nextgen-ambient" onClick={unlockVoice} onTouchStart={unlockVoice}>
      <div
        className={`gg-roaming-orb ${speaking ? "speaking" : ""} ${listening ? "listening" : ""}`}
        style={{ left: `${orbPosition.x}%`, top: `${orbPosition.y}%` }}
      >
        <span />
      </div>

      <div className="gg-ambient-stage">
        <div className="gg-ambient-badge">
          <i />
          {ready ? (listening ? "Genius is listening" : speaking ? "Genius is speaking" : "Ambient voice ready") : "Tap to enable voice"}
        </div>

        <h1 className="gg-ambient-title">
          Speak naturally.
          <span>Genius will guide you.</span>
        </h1>

        <p className="gg-ambient-sub">
          Tap once to enable voice. Genius will ask politely if anything needs permission.
        </p>

        <div className="gg-ambient-conversation">
          <div className="gg-ambient-header">
            <strong>Genius</strong>
            <small>{ambientState?.mode || "voice unlock layer"}</small>
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
            <span>{readinessMessage}</span>
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
