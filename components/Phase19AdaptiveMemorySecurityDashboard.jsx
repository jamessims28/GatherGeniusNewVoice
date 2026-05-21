"use client";

import { useState } from "react";

export default function Phase19AdaptiveMemorySecurityDashboard() {
  const [request, setRequest] = useState("Genius, keep memory, privacy, security, trust, and adaptive intelligence protected in the background.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase19() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase19/run", {
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
    <section className="gg-phase19">
      <div className="gg-phase19-orb"><span /></div>
      <div className="gg-phase19-card">
        <div className="gg-phase19-header">
          <strong>GatherGenius Adaptive Memory & Security Core</strong>
          <small>Phase 19 Background Governance View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase19}>{loading ? "RUNNING MEMORY SECURITY..." : "RUN BACKGROUND MEMORY SECURITY CORE"}</button>

        {result && (
          <div className="gg-phase19-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase19-grid">
              <div><b>Memory Review</b><p>{result.memoryReview?.message}</p><p>Review required: {result.memoryReview?.reviewRequired ? "yes" : "no"}</p></div>
              <div><b>Privacy Boundary</b><p>Decision: {result.privacy?.decision}</p><p>Consent required: {result.privacy?.requiresConsent ? "yes" : "no"}</p></div>
              <div><b>Security Risk</b><p>Risk level: {result.security?.riskLevel}</p><p>Score: {Math.round((result.security?.riskScore || 0) * 100)}%</p><p>Action: {result.security?.action}</p></div>
              <div><b>Governance Runtime</b><p>Status: {result.governance?.status}</p><p>Holds: {result.governance?.holds}</p></div>
              <div className="wide"><b>Operations Link</b><p>{result.operations?.response}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
