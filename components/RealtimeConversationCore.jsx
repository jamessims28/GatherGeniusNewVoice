"use client";

import { useEffect, useRef, useState } from "react";
import { runOperatingReadinessGate, buildReadinessPrompt } from "../lib/operating-core/readinessGate";
import { getInstantCommandResponse } from "../lib/voice/instantResponseEngine";
import { buildVoiceSettings } from "../lib/voice/languageRouter";
import VoiceInputDevicePanel from "./VoiceInputDevicePanel";

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
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
      voices.find((voice) => /samantha|victoria|zira|jenny|aria|natural|female/i.test(voice.name)) ||
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
    { role: "Genius", text: "Hello, I’m Genius. Tap once so I can check readiness before we begin." }
  ]);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [ready, setReady] = useState(false);
  const [readiness, setReadiness] = useState(null);
  const [readinessText, setReadinessText] = useState("Tap once to check readiness.");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState("");
  const [voiceInputMode, setVoiceInputMode] = useState("background");
  const [orbPosition, setOrbPosition] = useState({ x: 50, y: 13 });
  const [coreMode, setCoreMode] = useState("gathergenius operating core");

  const transcriptRef = useRef(null);
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);
  const listeningRef = useRef(false);
  const readyRef = useRef(false);
  const unlockedRef = useRef(false);
  const listenTimerRef = useRef(null);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  useEffect(() => {
    listeningRef.current = listening;
  }, [listening]);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

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
    const interval = setInterval(() => {
      index = (index + 1) % path.length;
      setOrbPosition(path[index]);
    }, speaking ? 1050 : 1750);

    return () => clearInterval(interval);
  }, [speaking, listening]);

  useEffect(() => {
    return () => {
      if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
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

  function say(text, after) {
    setSpeaking(true);
    const didSpeak = speakBrowser(text, () => {
      setSpeaking(false);
      if (typeof after === "function") after();
    });

    if (!didSpeak && typeof after === "function") after();
  }

  async function unlockAndCheckReadiness() {
    if (unlockedRef.current) return;
    unlockedRef.current = true;

    try {
      const warmup = new SpeechSynthesisUtterance(" ");
      warmup.volume = 0;
      window.speechSynthesis?.speak?.(warmup);
      window.speechSynthesis?.cancel?.();
    } catch {}

    const gate = await runOperatingReadinessGate({ selectedAudioDeviceId });
    setReadiness(gate);
    setReady(Boolean(gate.ready));

    const message = buildReadinessPrompt(gate);
    setReadinessText(message);
    addMessage("Genius", `Hello, I’m Genius. ${message}`);

    if (gate.ready) {
      say(`Hello, I’m Genius. ${message}`, () => scheduleListening(500));
    } else {
      say(`Hello, I’m Genius. ${message}`);
      unlockedRef.current = false;
    }
  }

  async function runCoreForVoice(text) {
    const clean = String(text || "").trim();
    if (!clean) return;

    addMessage("You", clean);

    const instant = getInstantCommandResponse(clean);
    addMessage("Genius", instant.response);
    say(instant.response);

    try {
      const response = await fetch("/api/operating-core/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: clean,
          readiness,
          location: "Virginia"
        })
      });

      const core = await response.json();
      setCoreMode(core?.layer || "gathergenius operating core");

      const final = core?.response || "I understand. I can guide the next safe step.";
      addMessage("Genius", final);
      say(final, () => scheduleListening(800));
    } catch {
      const fallback = "I had trouble reaching the GatherGenius Operating Core. I can still listen once the connection is stable.";
      addMessage("Genius", fallback);
      say(fallback, () => scheduleListening(1000));
    }
  }

  function scheduleListening(delay = 900) {
    if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    listenTimerRef.current = setTimeout(() => {
      if (readyRef.current && !speakingRef.current && !listeningRef.current) {
        startListening();
      }
    }, delay);
  }

  function startListening() {
    if (!readyRef.current || speakingRef.current || listeningRef.current) return;

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      const msg = "Voice recognition is not available in this browser. Please use Chrome or Edge.";
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
      setReadinessText("Listening now.");
    };

    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript || "";
      setListening(false);
      setReadinessText("Processing through GatherGenius Operating Core.");
      runCoreForVoice(heard);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
        const msg = "I need microphone permission before I can continue.";
        setReadinessText(msg);
        addMessage("Genius", msg);
        say(msg);
        unlockedRef.current = false;
        setReady(false);
        return;
      }
      scheduleListening(1200);
    };

    recognition.onend = () => {
      setListening(false);
      if (!speakingRef.current) scheduleListening(900);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      scheduleListening(1200);
    }
  }

  return (
    <section className="gg-ambient-core-v1" onClick={unlockAndCheckReadiness} onTouchStart={unlockAndCheckReadiness}>
      <div
        className={`gg-core-orb ${speaking ? "speaking" : ""} ${listening ? "listening" : ""}`}
        style={{ left: `${orbPosition.x}%`, top: `${orbPosition.y}%` }}
      >
        <span />
      </div>

      <div className="gg-core-stage">
        <div className="gg-core-badge">
          <i />
          {ready ? (listening ? "Listening" : speaking ? "Speaking" : "Ambient Core Ready") : "Tap to Enable"}
        </div>

        <h1 className="gg-core-title">
          GatherGenius Operating Core
          <span>Core</span>
        </h1>

        <p className="gg-core-sub">
          Readiness, human intent, world signals, proactive decisions, outcome protection, and one premium ambient voice interface.
        </p>

        <div className="gg-core-panel">
          <div className="gg-core-header">
            <strong>Genius</strong>
            <small>{coreMode}</small>
          </div>

          <div className="gg-core-transcript" ref={transcriptRef} aria-live="polite">
            {messages.map((item, index) => (
              <div className={`gg-core-line ${item.role === "You" ? "you" : "genius"}`} key={`${item.role}-${index}-${item.text}`}>
                <b>{item.role}</b>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="gg-core-status">
            <span>{readinessText}</span>
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
