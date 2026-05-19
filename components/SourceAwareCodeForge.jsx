"use client";

import { useState } from "react";

export default function SourceAwareCodeForge() {
  const [request, setRequest] = useState("Build a GeniusGather module that uses live pricing, provider confidence, and user permissions to suggest the next best action.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function generate() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/codeforge/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        ok: false,
        message: "Source-aware code generation failed. Check the API route and environment variables.",
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-codeforge">
      <span className="gg-status good">Source-aware Code Forge</span>
      <h2>GeniusGather writes code from gathered context.</h2>
      <p className="gg-note">
        It gathers multiple approved sources first, then generates app-specific code. Unsafe output is blocked and replaced with a safe fallback.
      </p>

      <div className="gg-codeforge-row">
        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button className="gg-btn green" type="button" onClick={generate} disabled={loading}>
          {loading ? "WRITING..." : "WRITE CODE"}
        </button>
      </div>

      {result && (
        <div className="gg-codeforge-result">
          <div className="gg-line"><span>Mode</span><strong>{result.generationMode || "unknown"}</strong></div>
          <div className="gg-line"><span>Safety</span><strong>{result.safety?.message || result.message}</strong></div>
          <div className="gg-line"><span>Sources</span><strong>{result.sourceBundle?.availableSources?.join(", ") || "none"}</strong></div>
          <pre>{result.code || result.error || result.message}</pre>
        </div>
      )}
    </section>
  );
}
