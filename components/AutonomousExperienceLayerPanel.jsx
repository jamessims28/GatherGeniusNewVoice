"use client";

import { useState } from "react";

export default function AutonomousExperienceLayerPanel() {
  const [text, setText] = useState("Genius, help me coordinate a private outdoor luxury family experience soon in Virginia under $20k.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function runLayer() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/autonomy/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, location: "Virginia" })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, message: "Autonomous layer failed.", error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-autonomy-layer">
      <span className="gg-status good">99% Autonomous Experience Layer</span>
      <h2>Genius assists before being asked.</h2>
      <p className="gg-note">
        Ambient intelligence, reality mapping, human twin modeling, autonomous assistance, agents, comfort voice, outcome ownership, permission boundaries, unified operating layer, and life coordination.
      </p>

      <div className="gg-autonomy-row">
        <textarea value={text} onChange={(event) => setText(event.target.value)} />
        <button type="button" className="gg-btn green" onClick={runLayer} disabled={loading}>
          {loading ? "RUNNING..." : "RUN 1–10"}
        </button>
      </div>

      {result && (
        <div className="gg-autonomy-result">
          <div className="gg-line"><span>Can Proceed</span><strong>{String(result.layers?.operatingLayer?.canProceed)}</strong></div>
          <div className="gg-line"><span>Confidence</span><strong>{Math.round((result.layers?.operatingLayer?.confidence || 0) * 100)}%</strong></div>
          <div className="gg-line"><span>Next Action</span><strong>{result.finalResponse?.action}</strong></div>
          <div className="gg-line"><span>Support Mode</span><strong>{result.layers?.lifeCoordination?.supportMode}</strong></div>
          <p className="gg-note">{result.finalResponse?.message}</p>

          <div className="gg-provider-list">
            {Object.entries(result.layers || {}).map(([key, value]) => (
              <div className="gg-metric" key={key}>
                <span>{key}</span>
                <strong>{value?.layer || value?.stack || "active"}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
