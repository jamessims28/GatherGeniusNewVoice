"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("Genius is ready.");
  const [response, setResponse] = useState("Speak naturally. Genius will quietly coordinate the background intelligence.");
  const [active, setActive] = useState(false);

  async function runGenius() {
    setActive(true);
    setStatus("Genius is coordinating quietly...");

    try {
      const request = "Genius, help me coordinate the safest premium outcome and protect the path.";
      const result = await fetch("/api/reality-orchestration/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request,
          location: "Virginia",
          permissions: { internal_preparation: true }
        })
      }).then((r) => r.json());

      setResponse(result.response || "I’m protecting the outcome in the background.");
      setStatus("Background intelligence active.");

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const message = new SpeechSynthesisUtterance(result.response || "Background intelligence active.");
        message.rate = 0.82;
        message.pitch = 1.08;
        message.volume = 0.94;
        window.speechSynthesis.speak(message);
      }
    } catch {
      setResponse("I’m here. The background orchestration route needs to be checked.");
      setStatus("Connection issue.");
    } finally {
      setTimeout(() => setActive(false), 1600);
    }
  }

  return (
    <main className="gg-clean-landing">
      <section className="gg-clean-stage">
        <button className={`gg-clean-orb ${active ? "active" : ""}`} type="button" onClick={runGenius} aria-label="Activate Genius">
          <span />
        </button>

        <div className="gg-clean-badge">{status}</div>

        <h1>GatherGenius</h1>
        <p>{response}</p>
      </section>
    </main>
  );
}
