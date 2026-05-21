"use client";

import { useState } from "react";

export default function Phase123Panel() {
  const [text, setText] = useState("Genius, help me coordinate a premium family experience in Virginia soon under $20k.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function runUpgrade() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase123/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          readiness: { ready: true, enabled: ["voice", "streaming", "memory"] },
          location: "Virginia",
          history: []
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase123">
      <div className="gg-phase123-orb"><span /></div>

      <div className="gg-phase123-card">
        <div className="gg-phase123-header">
          <strong>GatherGenius Phase 1–3 Upgrade</strong>
          <small>Realtime + Human Intelligence + World Operating Layer</small>
        </div>

        <textarea value={text} onChange={(event) => setText(event.target.value)} />

        <button type="button" onClick={runUpgrade} disabled={loading}>
          {loading ? "RUNNING..." : "RUN PHASE 1–3"}
        </button>

        {result && (
          <div className="gg-phase123-result">
            <p><b>Response:</b> {result.response}</p>
            <p><b>Next Action:</b> {result.decision?.nextAction}</p>
            <p><b>Confidence:</b> {Math.round((result.decision?.confidence || 0) * 100)}%</p>

            <div className="gg-phase123-grid">
              <div><b>Phase 1</b><span>{result.phases?.phase1RealtimeStability?.fallbackMode ? "fallback" : "realtime ready"}</span></div>
              <div><b>Phase 2</b><span>{result.phases?.phase2HumanIntelligence?.communication}</span></div>
              <div><b>Phase 3</b><span>{result.phases?.phase3WorldOperatingLayer?.riskLevel}</span></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
