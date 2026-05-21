"use client";

import { useState } from "react";

export default function Phase15EnterpriseDashboard() {
  const [request, setRequest] = useState("Genius, prepare enterprise controls for a premium vendor marketplace with operators, finance, investors, approvals, audit trails, and tenant isolation.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase15() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/phase15/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, tenantId: "lmh-enterprise", userKey: "anonymous_preview", role: "admin", seats: 8, location: "Virginia" })
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase15">
      <div className="gg-phase15-orb"><span /></div>
      <div className="gg-phase15-card">
        <div className="gg-phase15-header">
          <strong>GatherGenius Enterprise Multi-Tenant Core</strong>
          <small>Phase 15 Background Enterprise View</small>
        </div>
        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase15}>{loading ? "RUNNING ENTERPRISE CORE..." : "RUN BACKGROUND ENTERPRISE CORE"}</button>

        {result && (
          <div className="gg-phase15-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase15-grid">
              <div><b>Tenant Isolation</b><p>Tenant: {result.tenant?.tenantId}</p><p>Mode: {result.tenant?.isolationMode}</p><p>Cross tenant: {result.tenant?.canCrossTenant ? "yes" : "no"}</p></div>
              <div><b>Organization Control</b><p>Seats: {result.organization?.seats}</p><p>Departments: {result.organization?.departments?.join(", ")}</p></div>
              <div><b>Enterprise Policy</b><p>Allowed: {result.policy?.allowed ? "yes" : "no"}</p><p>Reason: {result.policy?.policyReason}</p></div>
              <div><b>Enterprise Metrics</b><p>Monthly value: ${result.metrics?.estimatedMonthlyValue}</p><p>Signal: {result.metrics?.investorSignal}</p></div>
              <div className="wide"><b>Growth Link</b><p>{result.growth?.response}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
