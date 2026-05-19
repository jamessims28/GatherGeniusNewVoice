"use client";

import { useState } from "react";

export default function ExperienceOperatingLayerPanel() {
  const [request, setRequest] = useState("Genius, coordinate a private outdoor luxury family experience for 120 people under $20k in Virginia");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function runLayer() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/operating-layer/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, message: "Operating layer failed to run.", error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-operating-layer">
      <span className="gg-status good">AI Experience Operating Layer</span>
      <h2>Genius reads the world before acting.</h2>
      <p className="gg-note">
        Human intent, weather, location, pricing, risk, timing, and outcome protection are analyzed before Genius recommends the next real-world step.
      </p>

      <div className="gg-operating-row">
        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" className="gg-btn green" onClick={runLayer} disabled={loading}>
          {loading ? "RUNNING..." : "RUN LAYER"}
        </button>
      </div>

      {result && (
        <div className="gg-operating-result">
          {result.ok ? (
            <>
              <div className="gg-line"><span>Recommendation</span><strong>{result.finalDecision.recommendation}</strong></div>
              <div className="gg-line"><span>Next Action</span><strong>{result.finalDecision.nextAction}</strong></div>
              <div className="gg-line"><span>Confidence</span><strong>{result.finalDecision.confidence}%</strong></div>
              <div className="gg-line"><span>Weather Risk</span><strong>{result.realWorld.signals.weather.riskLevel}</strong></div>
              <div className="gg-line"><span>Pricing Mode</span><strong>{result.realWorld.signals.pricing?.pricing?.mode}</strong></div>
              <p className="gg-note">{result.finalDecision.userMessage}</p>

              <div className="gg-provider-list">
                {result.operations.actions.map((action) => (
                  <div className="gg-metric" key={action.id}>
                    <span>{action.status}</span>
                    <strong>{action.label}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="gg-note">{result.message || result.error}</p>
          )}
        </div>
      )}
    </section>
  );
}
