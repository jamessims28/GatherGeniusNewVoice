"use client";

import { useState } from "react";

export default function Phase4ExecutionDashboard() {
  const [request, setRequest] = useState("Genius, coordinate a premium family gathering in Virginia with vendors, weather backup, pricing, calendar hold, and payment deposit.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase4() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase4/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request,
          location: "Virginia",
          permissions: {
            internal_preparation: true
          },
          memory: {
            summary: "prefers premium, private, protected experiences"
          }
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase4">
      <div className="gg-phase4-orb"><span /></div>

      <div className="gg-phase4-card">
        <div className="gg-phase4-header">
          <strong>GatherGenius Agent Mesh + Execution Core</strong>
          <small>Background admin view</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />

        <button type="button" onClick={runPhase4}>
          {loading ? "RUNNING AGENT MESH..." : "RUN AGENT MESH"}
        </button>

        {result && (
          <div className="gg-phase4-result">
            <p><b>Operating Response:</b> {result.response}</p>
            <p><b>Prepared:</b> {result.preparedCount || 0} | <b>Needs Confirmation:</b> {result.blockedCount || 0}</p>

            <div className="gg-phase4-grid">
              <div className="gg-phase4-box">
                <b>Agent Mesh</b>
                {result.agents?.map((agent) => (
                  <p key={agent.id}><strong>{agent.name}</strong>: {agent.status} — {agent.recommendation}</p>
                ))}
              </div>

              <div className="gg-phase4-box">
                <b>Tool Connectors</b>
                <p>Weather: {result.connectors?.weather?.risk || result.connectors?.weather?.status || "checked"}</p>
                <p>Pricing: {result.connectors?.pricing?.valueMode || "balanced"}</p>
                <p>Vendors: {result.connectors?.vendors?.needed ? "needed" : "not requested"}</p>
                <p>Calendar: {result.connectors?.calendar?.requested ? "requested" : "not requested"}</p>
                <p>Payments: {result.connectors?.payments?.requested ? "requested" : "not requested"}</p>
              </div>

              <div className="gg-phase4-box wide">
                <b>Execution Queue</b>
                {result.executionQueue?.map((item) => (
                  <p key={item.id}>
                    <strong>{item.label}</strong> — {item.status}
                    <br />
                    <span>{item.message}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
