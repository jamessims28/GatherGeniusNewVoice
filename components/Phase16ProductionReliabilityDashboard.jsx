"use client";

import { useState } from "react";

export default function Phase16ProductionReliabilityDashboard() {
  const [request, setRequest] = useState("Genius, prepare production launch reliability, staged rollout, rollback, uptime, health checks, and enterprise readiness.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase16() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase16/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, tenantId: "lmh-enterprise", userKey: "anonymous_preview", role: "admin", seats: 8 })
      });

      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase16">
      <div className="gg-phase16-orb"><span /></div>
      <div className="gg-phase16-card">
        <div className="gg-phase16-header">
          <strong>GatherGenius Production Launch & Reliability Core</strong>
          <small>Phase 16 Background Reliability View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase16}>{loading ? "RUNNING RELIABILITY CORE..." : "RUN BACKGROUND RELIABILITY CORE"}</button>

        {result && (
          <div className="gg-phase16-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase16-grid">
              <div><b>Launch Readiness</b><p>Score: {result.readiness?.readinessScore}%</p><p>Status: {result.readiness?.status}</p><p>Stage: {result.readiness?.stage}</p></div>
              <div><b>Reliability Monitor</b><p>Uptime: {result.reliability?.uptime}%</p><p>Latency: {result.reliability?.latencyMs}ms</p><p>Status: {result.reliability?.reliabilityStatus}</p></div>
              <div><b>Rollback Recovery</b><p>Status: {result.rollback?.status}</p><p>Auto rollback: {result.rollback?.canAutoRollback ? "yes" : "review only"}</p><p>{result.rollback?.reason}</p></div>
              <div><b>Progressive Rollout</b><p>Current gate: {result.rollout?.currentGate}</p><p>Public launch: {result.rollout?.publicLaunchAllowed ? "review ready" : "blocked"}</p></div>
              <div className="wide"><b>Rollout Gates</b>{result.rollout?.gates?.map((gate) => <p key={gate.id}><strong>{gate.id}</strong>: {gate.status} — {gate.trafficPercent}%</p>)}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
