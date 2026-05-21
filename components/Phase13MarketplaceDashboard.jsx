"use client";

import { useState } from "react";

export default function Phase13MarketplaceDashboard() {
  const [request, setRequest] = useState("Genius, coordinate a premium vendor-supported family event with catering, DJ, tents, tables, chairs, calendar, and payment path.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase13() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/phase13/run", {
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
    <section className="gg-phase13">
      <div className="gg-phase13-orb"><span /></div>
      <div className="gg-phase13-card">
        <div className="gg-phase13-header">
          <strong>GatherGenius Marketplace & Monetization Core</strong>
          <small>Phase 13 Background Revenue View</small>
        </div>
        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase13}>{loading ? "RUNNING MARKETPLACE CORE..." : "RUN BACKGROUND MARKETPLACE CORE"}</button>

        {result && (
          <div className="gg-phase13-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase13-grid">
              <div><b>Vendor Marketplace</b><p>Categories: {result.marketplace?.categories?.join(", ") || "none"}</p><p>Leads: {result.marketplace?.leads?.length || 0}</p><p>Take rate: {result.marketplace?.takeRatePercent}%</p></div>
              <div><b>Subscriptions</b><p>Recommended plan: {result.subscription?.recommendedPlan}</p><p>Upgrade signal: {result.subscription?.upgradeSignal ? "yes" : "no"}</p></div>
              <div><b>Revenue Forecast</b><p>Monthly potential: ${result.forecast?.monthlyPotential}</p><p>Annualized: ${result.forecast?.annualizedPotential}</p><p>Confidence: {Math.round((result.forecast?.confidence || 0) * 100)}%</p></div>
              <div><b>Trust Guard</b><p>{result.trust?.trustMessage}</p><p>Can auto execute: {result.trust?.canAutoExecute ? "yes" : "no"}</p></div>
              <div className="wide"><b>Ecosystem Link</b><p>{result.ecosystem?.response}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
