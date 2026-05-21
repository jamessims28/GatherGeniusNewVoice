
"use client";

import { useState } from "react";

export default function Phase18GovernanceDashboard() {
  const [request, setRequest] = useState("Genius, govern privacy, compliance, vendor outreach, data sharing, payments, contracts, and safe autonomous execution.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase18() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase18/run", {
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
    <section className="gg-phase18">
      <div className="gg-phase18-orb"><span /></div>
      <div className="gg-phase18-card">
        <div className="gg-phase18-header">
          <strong>GatherGenius Governance & Compliance Core</strong>
          <small>Phase 18 Background Governance View</small>
        </div>
        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase18}>{loading ? "RUNNING GOVERNANCE CORE..." : "RUN BACKGROUND GOVERNANCE CORE"}</button>
        {result && (
          <div className="gg-phase18-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase18-grid">
              <div><b>Policy Governance</b><p>Status: {result.governance?.governanceStatus}</p><p>Triggered: {result.governance?.triggered?.join(", ") || "none"}</p></div>
              <div><b>Privacy Compliance</b><p>Status: {result.privacy?.privacyStatus}</p><p>Flags: {result.privacy?.privacyFlags?.join(", ") || "none"}</p></div>
              <div><b>Compliance Audit</b><p>Status: {result.audit?.auditStatus}</p><p>Findings: {result.audit?.findings?.length || 0}</p></div>
              <div><b>Autonomous Boundary</b><p>Decision: {result.boundary?.boundaryDecision}</p><p>Can execute: {result.boundary?.canExecute ? "yes" : "no"}</p></div>
              <div className="wide"><b>Operations Link</b><p>{result.operations?.response}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
