"use client";

import { useState } from "react";

export default function Phase21FinalReleaseDashboard() {
  const [request, setRequest] = useState("Genius, verify final production readiness, integrations, investor launch package, deployment wiring, and protected release.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runFinalRelease() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase21/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, tenantId: "lmh-enterprise", userKey: "anonymous_preview", role: "admin" })
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase21">
      <div className="gg-phase21-orb"><span /></div>
      <div className="gg-phase21-card">
        <div className="gg-phase21-header">
          <strong>GatherGenius Final Production Release Core</strong>
          <small>Phase 20 + 21 Background Release View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runFinalRelease}>{loading ? "RUNNING FINAL RELEASE..." : "RUN FINAL RELEASE CORE"}</button>

        {result && (
          <div className="gg-phase21-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase21-grid">
              <div><b>Integration Readiness</b><p>Score: {result.integration?.integrations?.readinessScore}%</p><p>Status: {result.integration?.integrations?.status}</p></div>
              <div><b>Deployment Wiring</b><p>Status: {result.integration?.deployment?.status}</p><p>Auto deploy: {result.integration?.deployment?.canAutoDeploy ? "yes" : "review only"}</p></div>
              <div><b>Connector Routing</b><p>{result.integration?.connectors?.message}</p></div>
              <div><b>Investor Metrics</b><p>Readiness: {result.investor?.investorReadinessScore}%</p><p>Signal: {result.investor?.signal}</p></div>
              <div className="wide"><b>Final Release Checklist</b>{result.release?.checklist?.map((item) => <p key={item.id}><strong>{item.id}</strong>: {item.status}</p>)}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
