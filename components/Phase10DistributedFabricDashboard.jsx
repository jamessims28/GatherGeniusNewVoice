"use client";

import { useState } from "react";

export default function Phase10DistributedFabricDashboard() {
  const [request, setRequest] = useState("Genius, coordinate the next safest premium outcome across devices, vendors, schedule, memory, approvals, and background agents.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runFabric() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/phase10/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, userKey: "anonymous_preview", role: "admin" })
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase10">
      <div className="gg-phase10-orb"><span /></div>
      <div className="gg-phase10-card">
        <div className="gg-phase10-header">
          <strong>GatherGenius Distributed Ambient Intelligence Fabric</strong>
          <small>Phase 10 Operating View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runFabric}>{loading ? "RUNNING DISTRIBUTED FABRIC..." : "RUN DISTRIBUTED FABRIC"}</button>

        {result && (
          <div className="gg-phase10-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase10-grid">
              <div><b>Runtime</b><p>Mode: {result.runtime?.runtimeMode}</p><p>Events: {result.runtime?.events?.length || 0}</p></div>
              <div><b>Memory Fabric</b><p>{result.memoryFabric?.summary}</p></div>
              <div><b>Agent Mesh</b><p>Active agents: {result.mesh?.activeAgents}</p><p>Mode: {result.mesh?.meshMode}</p></div>
              <div><b>Device Sync</b><p>Active: {result.deviceSync?.handoff?.activeDevice}</p><p>Next: {result.deviceSync?.handoff?.nextBestDevice}</p></div>
              <div><b>Optimization</b>{result.optimization?.optimizations?.map((item) => <p key={item.type}><strong>{item.type}</strong>: {item.recommendation}</p>)}</div>
              <div><b>Execution Fabric</b><p>Ready: {result.execution?.readyCount}</p><p>Protected: {result.execution?.protectedCount}</p></div>
              <div className="wide"><b>Trust Verification</b><p>Allowed: {result.trust?.allowed}</p><p>Held for confirmation: {result.trust?.holds}</p><p>{result.trust?.principle}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
