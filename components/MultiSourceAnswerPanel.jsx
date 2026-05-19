"use client";

import { useState } from "react";

export default function MultiSourceAnswerPanel() {
  const [query, setQuery] = useState("What is the best price for catering 120 guests in Virginia?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function ask() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/intelligence/multisource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, answer: "Multi-source intelligence failed. Check API route and environment variables.", error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-multisource">
      <span className="gg-status good">Multi-source Intelligence</span>
      <h2>GeniusGather checks multiple sources before answering.</h2>
      <p className="gg-note">
        Uses approved memory, experience history, live pricing, provider data, and optional external search connectors.
      </p>

      <div className="gg-multisource-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
        <button type="button" className="gg-btn green" onClick={ask} disabled={loading}>
          {loading ? "CHECKING..." : "ASK"}
        </button>
      </div>

      {result && (
        <div className="gg-multisource-result">
          <p className="gg-note">{result.answer}</p>
          {result.sourceBundle && (
            <div className="gg-provider-list">
              {result.sourceBundle.sources.map((source) => (
                <div className="gg-metric" key={source.id}>
                  <span>{source.available ? "Available" : "Unavailable"}</span>
                  <strong>{source.name}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
