"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { buildVoiceIntro, buildVoiceResponseForName } from "../lib/voice/voiceIdentity";

export default function SpeakingSpark({ compact = false }) {
  const [speaking, setSpeaking] = useState(false);
  const [wakeInput, setWakeInput] = useState("GG");
  const [lastResponse, setLastResponse] = useState(buildVoiceIntro());

  function speakPreview(customText) {
    const responseData = buildVoiceResponseForName(customText || wakeInput);
    const voiceText = responseData.response;
    setLastResponse(voiceText);
    setSpeaking(true);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const message = new SpeechSynthesisUtterance(voiceText);
      message.rate = 0.84;
      message.pitch = 1.08;
      message.volume = 1;
      message.onend = () => setSpeaking(false);
      message.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(message);
    } else {
      setTimeout(() => setSpeaking(false), 4200);
    }
  }

  function stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  return (
    <div className={compact ? "gg-speaking compact" : "gg-speaking"}>
      <motion.div
        className={`gg-speaking-spark ${speaking ? "active" : ""}`}
        animate={speaking ? {
          scale: [1, 1.08, 1],
          opacity: [0.92, 1, 0.92],
          boxShadow: [
            "0 0 34px rgba(255,255,255,.9), 0 0 80px rgba(184,155,98,.26)",
            "0 0 80px rgba(255,255,255,1), 0 0 180px rgba(184,155,98,.46)",
            "0 0 34px rgba(255,255,255,.9), 0 0 80px rgba(184,155,98,.26)"
          ]
        } : { scale: 1 }}
        transition={{ duration: 1.4, repeat: speaking ? Infinity : 0, ease: "easeInOut" }}
      >
        <span className="gg-spark-core" />
      </motion.div>

      <div className="gg-speaking-copy">
        <span className="gg-status good">{speaking ? "Speaking" : "Voice Spark"}</span>
        <h3>{speaking ? "GatherGenius is speaking." : "Preview a calm, pleasant, helpful voice that responds to its names."}</h3>
        <p className="gg-note">
          The spark responds to GatherGenius, G, GG, Genius, or Gather. It will also tell you its preferred name.
        </p>

        <div className={`gg-wave ${speaking ? "active" : ""}`} aria-hidden="true">
          {[0,1,2,3,4,5,6].map((bar) => <i key={bar} style={{ "--i": bar }} />)}
        </div>

        <div className="gg-wake-name-input">
          <label>Try a name</label>
          <input value={wakeInput} onChange={(event) => setWakeInput(event.target.value)} placeholder="GatherGenius, G, GG, Genius, or Gather" />
        </div>

        <p className="gg-note">{lastResponse}</p>

        <div className="gg-speaking-actions">
          <button type="button" className="gg-btn green" onClick={speakPreview}>SPEAK PREVIEW</button>
          <button type="button" className="gg-btn secondary" onClick={stopSpeaking}>STOP</button>
        </div>
      </div>
    </div>
  );
}
