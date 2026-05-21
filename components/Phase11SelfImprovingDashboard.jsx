"use client";

import { useState } from "react";

export default function Phase11SelfImprovingDashboard() {
  const [request, setRequest] = useState("Genius, coordinate a premium protected outcome and learn how to improve the orchestration after completion.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase11() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase11/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, userKey: "anonymous_preview", role: "admin", userFeedback: { rating: 5 } })
      });

      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase11">
      <div className="gg-phase11-orb"><span /></div>
      <div className="gg-phase11-card">
        <div className="gg-phase11-header">
          <strong>GatherGenius Self-Improving Orchestration Core</strong>
          <small>Phase 11 Background Learning View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase11}>{loading ? "RUNNING SELF-IMPROVEMENT..." : "RUN BACKGROUND LEARNING CORE"}</button>

        {result && (
          <div className="gg-phase11-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase11-grid">
              <div><b>Outcome Score</b><p>{result.outcome?.outcomeScore}/100</p><p>Grade: {result.outcome?.grade}</p></div>
              <div><b>Outcome Factors</b><p>Latency: {Math.round((result.outcome?.scores?.latencyScore || 0) * 100)}%</p><p>Protection: {Math.round((result.outcome?.scores?.protectionScore || 0) * 100)}%</p><p>Execution: {Math.round((result.outcome?.scores?.executionScore || 0) * 100)}%</p></div>
              <div><b>Learning Loop</b>{result.learning?.improvements?.map((item) => <p key={item.type}><strong>{item.type}</strong>: {item.recommendation}</p>)}</div>
              <div><b>Agent Tuning</b><p>{result.tuning?.summary}</p><p>Mode: {result.tuning?.tuningMode}</p></div>
              <div className="wide"><b>Optimization Memory</b><p>{result.optimizationMemory?.summary}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
