"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { buildVoiceResponseForName } from "../lib/voice/voiceIdentity";

const states = {
  idle: {
    label: "Ready",
    prompt: "What would you like to create?",
    message: "Say GatherGenius, G, GG, Genius, or Gather."
  },
  listening: {
    label: "Listening",
    prompt: "I’m listening.",
    message: "Tell me the outcome you want."
  },
  thinking: {
    label: "Thinking",
    prompt: "I’m understanding the request.",
    message: "I’m using background intelligence quietly."
  },
  building: {
    label: "Building",
    prompt: "I’m building the experience.",
    message: "Your result is forming now."
  },
  confident: {
    label: "Confidence",
    prompt: "I found a strong path.",
    message: "Execution confidence is high."
  },
  success: {
    label: "Ready",
    prompt: "Your experience is ready.",
    message: "You have one decision left: lock the experience."
  },
  issue: {
    label: "Issue",
    prompt: "Something needs attention.",
    message: "I’ll explain the issue and suggest the safest next step."
  }
};

const flow = ["listening", "thinking", "building", "confident", "success"];

function speak(text, onEnd) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.84;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
    window.speechSynthesis.speak(utterance);
    return;
  }
  setTimeout(onEnd, 1600);
}

export default function AmbientVoiceOS({ onBuild }) {
  const [voiceState, setVoiceState] = useState("idle");
  const [transcript, setTranscript] = useState("GG, build a luxury wedding for 120 guests under $20k in Virginia");
  const [conversation, setConversation] = useState([
    { role: "GatherGenius", text: "I’m here. Tell me what you want to create." }
  ]);
  const [confidence, setConfidence] = useState(0);

  const current = states[voiceState] || states.idle;

  const ringStyle = useMemo(() => {
    const deg = Math.max(0, Math.min(100, confidence)) * 3.6;
    return { background: `conic-gradient(rgba(79,123,87,.92) ${deg}deg, rgba(184,155,98,.16) ${deg}deg)` };
  }, [confidence]);

  async function runVoiceFlow() {
    const nameResponse = buildVoiceResponseForName(transcript);
    setConversation((items) => [...items, { role: "You", text: transcript }, { role: "GatherGenius", text: nameResponse.response }]);

    speak(nameResponse.response, () => null);

    setConfidence(0);
    for (let i = 0; i < flow.length; i++) {
      const next = flow[i];
      setVoiceState(next);
      setConfidence((i + 1) * 19);
      await new Promise((resolve) => setTimeout(resolve, 650));
    }
    setConfidence(94);
    setConversation((items) => [
      ...items,
      { role: "GatherGenius", text: "I produced the result. Background intelligence handled the details quietly." }
    ]);

    onBuild?.(transcript);
  }

  function askPermission() {
    setVoiceState("issue");
    const msg = "I can improve this if you allow background access to your approved preferences and provider history. You can say yes, or keep it private.";
    setConversation((items) => [...items, { role: "GatherGenius", text: msg }]);
    speak(msg, () => null);
  }

  function reset() {
    setVoiceState("idle");
    setConfidence(0);
    setConversation([{ role: "GatherGenius", text: "I’m here. Tell me what you want to create." }]);
  }

  return (
    <section className="gg-ambient-shell">
      <motion.div
        className={`gg-ambient-spark state-${voiceState}`}
        animate={{
          scale: voiceState === "idle" ? [1, 1.02, 1] : [1, 1.08, 1],
          opacity: [0.92, 1, 0.92]
        }}
        transition={{ duration: voiceState === "idle" ? 3.6 : 1.25, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="gg-confidence-ring" style={ringStyle}>
          <div className="gg-spark-inner">
            <span />
          </div>
        </div>
      </motion.div>

      <div className="gg-ambient-copy">
        <span className="gg-status good">{current.label}</span>
        <h2>{current.prompt}</h2>
        <p className="gg-note">{current.message}</p>

        <div className="gg-ambient-transcript">
          <input
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Say or type what you want..."
          />
          <button className="gg-btn green" type="button" onClick={runVoiceFlow}>
            SPEAK
          </button>
        </div>

        <div className={`gg-wave active state-${voiceState}`} aria-hidden="true">
          {[0,1,2,3,4,5,6,7,8].map((bar) => <i key={bar} style={{ "--i": bar }} />)}
        </div>

        <div className="gg-ambient-actions">
          <button className="gg-btn secondary" type="button" onClick={askPermission}>
            ASK PERMISSION
          </button>
          <button className="gg-btn secondary" type="button" onClick={reset}>
            RESET
          </button>
        </div>

        <AnimatePresence>
          {confidence > 0 && (
            <motion.div
              className="gg-floating-intel"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8 }}
            >
              <strong>{confidence}%</strong>
              <span>Execution confidence building quietly</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="gg-conversation-strip">
        {conversation.slice(-4).map((item, index) => (
          <motion.div
            key={`${item.role}-${index}-${item.text}`}
            className={`gg-bubble ${item.role === "You" ? "you" : "ai"}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <b>{item.role}</b>
            <span>{item.text}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
