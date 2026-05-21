"use client";

import { useState } from "react";

export default function Phase12EcosystemDashboard() {
  const [request, setRequest] = useState("Genius, coordinate a premium vendor-supported family event and find the strongest revenue and ecosystem opportunity signals.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase12() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase12/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, userKey: "anonymous_preview", role: "admin", location: "Virginia" })
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase12">
      <div className="gg-phase12-orb"><span /></div>
      <div className="gg-phase12-card">
        <div className="gg-phase12-header">
          <strong>GatherGenius Ecosystem Intelligence Core</strong>
          <small>Phase 12 Background Market View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase12}>{loading ? "RUNNING ECOSYSTEM INTELLIGENCE..." : "RUN BACKGROUND ECOSYSTEM CORE"}</button>

        {result && (
          <div className="gg-phase12-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase12-grid">
              <div><b>Market Signals</b><p>Demand: {result.market?.signals?.demand}</p><p>Score: {result.market?.marketReadinessScore}</p><p>Premium: {result.market?.signals?.premiumPositioning ? "yes" : "no"}</p></div>
              <div><b>Ecosystem Routing</b>{result.routing?.routes?.map((item) => <p key={item.id}><strong>{item.id}</strong>: {item.purpose}</p>)}</div>
              <div><b>Opportunity Discovery</b><p>Score: {result.opportunity?.opportunityScore}</p>{result.opportunity?.opportunities?.map((item) => <p key={item.type}><strong>{item.type}</strong>: {item.recommendation}</p>)}</div>
              <div><b>Revenue Optimization</b><p>Revenue ready: {result.revenue?.revenueReadiness ? "yes" : "watch"}</p>{result.revenue?.recommendations?.map((item) => <p key={item.opportunityType}><strong>{item.plan}</strong>: {item.recommendation}</p>)}</div>
              <div className="wide"><b>Self-Improving Orchestration Link</b><p>Outcome score: {result.orchestration?.outcome?.outcomeScore}/100</p><p>{result.orchestration?.response}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
