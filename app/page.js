"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("Ambient AI OS quietly active");
  const [response, setResponse] = useState(
    "The Ambient AI Operating System is running entirely in the background while the orb continuously moves across the landing page. Ambient intelligence, orchestration, memory continuity, proactive coordination, realtime voice interaction, and persistent background awareness remain invisible to the user."
  );

  function activateAmbientOS() {
    setStatus("Activating ambient intelligence orchestration...");

    const answer =
      "I activated your Ambient AI Operating System in the background. Memory continuity, proactive coordination, realtime voice interaction, protection, and outcome orchestration are ready.";

    setResponse(answer);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const message = new SpeechSynthesisUtterance(answer);
      message.rate = 0.82;
      message.pitch = 1.08;
      message.volume = 0.94;
      window.speechSynthesis.speak(message);
    }

    window.setTimeout(() => {
      setStatus("Ambient AI OS quietly active");
    }, 3000);
  }

  return (
    <main className="gg-ambient-os-landing">
      <button
        className="gg-ambient-orb"
        type="button"
        onClick={activateAmbientOS}
        aria-label="Activate GatherGenius Ambient AI Operating System"
      >
        <span />
      </button>

      <section className="gg-ambient-stage">
        <div className="gg-ambient-badge">{status}</div>
        <h1>GatherGenius</h1>
        <div className="gg-ambient-sub">{response}</div>
        <div className="gg-ambient-note">Production V1 — Ambient AI Operating System</div>
      </section>
    </main>
  );
}
