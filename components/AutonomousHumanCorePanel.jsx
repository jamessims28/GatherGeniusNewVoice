"use client";

import { useState } from "react";

export default function AutonomousHumanCorePanel() {
  const [text, setText] = useState("Genius, I’m overwhelmed and need a private luxury family experience under $20k soon.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runCore() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/human-core/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, message: "Human intelligence core could not run.", error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-human-core">
      <span className="gg-status good">Background Human Intelligence</span>
      <h2>Genius understands the person, then acts.</h2>
      <p className="gg-note">
        Spending psychology, timing behavior, social patterns, trust preference, communication style, prediction, orchestration, and protection now run as code.
      </p>

      <div className="gg-human-core-row">
        <textarea value={text} onChange={(event) => setText(event.target.value)} />
        <button className="gg-btn green" type="button" onClick={runCore} disabled={loading}>
          {loading ? "RUNNING..." : "RUN CORE"}
        </button>
      </div>

      {result && (
        <div className="gg-human-core-result">
          <div className="gg-line"><span>Communication</span><strong>{result.humanProfile?.communication?.communicationStyle || "unknown"}</strong></div>
          <div className="gg-line"><span>Spending</span><strong>{result.humanProfile?.spending?.spendingPsychology || "unknown"}</strong></div>
          <div className="gg-line"><span>Timing</span><strong>{result.humanProfile?.timing?.timingBehavior || "unknown"}</strong></div>
          <div className="gg-line"><span>Trust</span><strong>{result.humanProfile?.trust?.trustPreference || "unknown"}</strong></div>
          <div className="gg-line"><span>Predicted Risk</span><strong>{result.problemPrediction?.severity || "unknown"}</strong></div>
          <div className="gg-line"><span>Next Action</span><strong>{result.orchestration?.nextBestAction || "unknown"}</strong></div>
          <p className="gg-note">{result.responseGuidance?.instruction || result.message}</p>
        </div>
      )}
    </section>
  );
}
