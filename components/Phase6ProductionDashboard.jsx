"use client";

import { useEffect, useState } from "react";

export default function Phase6ProductionDashboard() {
  const [request, setRequest] = useState("Genius, coordinate a premium family gathering in Virginia with vendors, calendar, weather backup, and payment deposit.");
  const [result, setResult] = useState(null);
  const [integrations, setIntegrations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/phase6/integrations").then((r) => r.json()).then(setIntegrations).catch(() => null);
  }, []);

  async function runPhase6() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase6/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request,
          userKey: "anonymous_preview",
          displayName: "Preview User",
          location: "Virginia",
          permissions: { internal_preparation: true }
        })
      });

      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase6">
      <div className="gg-phase6-orb"><span /></div>

      <div className="gg-phase6-card">
        <div className="gg-phase6-header">
          <strong>GatherGenius Production Autonomy Core</strong>
          <small>Admin / Integration View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />

        <button type="button" onClick={runPhase6}>
          {loading ? "RUNNING PRODUCTION AUTONOMY..." : "RUN PRODUCTION AUTONOMY"}
        </button>

        {integrations && (
          <div className="gg-phase6-strip">
            <span>Ready: {integrations.summary?.ready?.join(", ") || "none"}</span>
            <span>Missing: {integrations.summary?.missing?.join(", ") || "none"}</span>
            <span>Placeholders: {integrations.summary?.placeholders?.join(", ") || "none"}</span>
          </div>
        )}

        {result && (
          <div className="gg-phase6-result">
            <p><b>Response:</b> {result.response}</p>
            <p><b>User:</b> {result.identity?.displayName}</p>
            <p><b>Latency:</b> {result.observability?.durationMs}ms — {result.observability?.grade}</p>
            <p><b>Prepared:</b> {result.execution?.prepared || 0} | <b>Needs Approval:</b> {result.execution?.needsApproval || 0}</p>

            <div className="gg-phase6-grid">
              <div>
                <b>Persistent Memory</b>
                <p>{result.memory?.lastRealityResponse || "Memory updated."}</p>
              </div>
              <div>
                <b>Integrations</b>
                <p>Ready: {result.integrationSummary?.ready?.join(", ") || "none"}</p>
                <p>Missing: {result.integrationSummary?.missing?.join(", ") || "none"}</p>
              </div>
              <div className="wide">
                <b>Approval / Execution Results</b>
                {result.execution?.results?.map((item) => (
                  <p key={item.id}>
                    <strong>{item.label}</strong> — {item.status}<br />
                    <span>{item.reason}</span>
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
