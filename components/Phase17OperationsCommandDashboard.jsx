"use client";

import { useState } from "react";

export default function Phase17OperationsCommandDashboard() {
  const [request, setRequest] = useState("Genius, monitor production operations, incident response, reliability, rollout, escalation, and business operations.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase17() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase17/run", {
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
    <section className="gg-phase17">
      <div className="gg-phase17-orb"><span /></div>
      <div className="gg-phase17-card">
        <div className="gg-phase17-header">
          <strong>GatherGenius Autonomous Operations Command Core</strong>
          <small>Phase 17 Background Ops View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase17}>{loading ? "RUNNING OPS COMMAND..." : "RUN BACKGROUND OPS COMMAND"}</button>

        {result && (
          <div className="gg-phase17-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase17-grid">
              <div><b>Command Router</b><p>Primary: {result.command?.primaryCommand}</p>{result.command?.commands?.map((cmd) => <p key={cmd.id}><strong>{cmd.id}</strong>: {cmd.purpose}</p>)}</div>
              <div><b>Incident Response</b><p>Severity: {result.incident?.severity}</p><p>Status: {result.incident?.status}</p>{result.incident?.playbook?.map((item) => <p key={item}>• {item}</p>)}</div>
              <div><b>Escalation</b><p>Required: {result.escalation?.escalationRequired ? "yes" : "no"}</p><p>Status: {result.escalation?.status}</p></div>
              <div><b>Operational Ledger</b><p>{result.ledger?.summary}</p><p>Incidents: {result.ledger?.patterns?.incidentCount}</p><p>Escalations: {result.ledger?.patterns?.escalationCount}</p></div>
              <div className="wide"><b>Reliability Link</b><p>{result.reliabilityCore?.response}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
