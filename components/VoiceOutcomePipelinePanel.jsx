"use client";

import { useState } from "react";

export default function VoiceOutcomePipelinePanel() {
  const [text, setText] = useState("Genius, coordinate a private luxury family experience for 120 people under $20k in Virginia");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPipeline() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/voice-pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, message: "Voice outcome pipeline failed.", error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-operating-layer">
      <span className="gg-status good">Voice Outcome Pipeline</span>
      <h2>Voice → Outcome Delivery</h2>
      <p className="gg-note">
        Intent Understanding → Human Understanding → Prediction → Coordination → Execution → Protection → Outcome Delivery.
      </p>

      <div className="gg-operating-row">
        <textarea value={text} onChange={(event) => setText(event.target.value)} />
        <button type="button" className="gg-btn green" onClick={runPipeline} disabled={loading}>
          {loading ? "RUNNING..." : "RUN PIPELINE"}
        </button>
      </div>

      {result && (
        <div className="gg-operating-result">
          <div className="gg-line"><span>Confidence</span><strong>{result.confidence}%</strong></div>
          <div className="gg-line"><span>Next Action</span><strong>{result.nextAction}</strong></div>
          <p className="gg-note">{result.voiceResponse}</p>
          <div className="gg-provider-list">
            {Object.entries(result.stages || {}).map(([key, value]) => (
              <div className="gg-metric" key={key}>
                <span>{key}</span>
                <strong>{value?.stage || value?.layer || "complete"}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
