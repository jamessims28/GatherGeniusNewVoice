"use client";

import { useState } from "react";

export default function Phase14GrowthScaleDashboard() {
  const [request, setRequest] = useState("Genius, grow GatherGenius with premium users, vendor marketplace revenue, referrals, investor traction, and retention loops.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase14() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase14/run", {
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
    <section className="gg-phase14">
      <div className="gg-phase14-orb"><span /></div>
      <div className="gg-phase14-card">
        <div className="gg-phase14-header">
          <strong>GatherGenius Growth & Scale Intelligence Core</strong>
          <small>Phase 14 Background Scale View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runPhase14}>{loading ? "RUNNING GROWTH INTELLIGENCE..." : "RUN BACKGROUND GROWTH CORE"}</button>

        {result && (
          <div className="gg-phase14-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-phase14-grid">
              <div><b>Growth Signals</b><p>Growth score: {result.growth?.growthScore}</p><p>Category: {result.growth?.category}</p><p>Investor intent: {result.growth?.signals?.investorIntent ? "yes" : "no"}</p></div>
              <div><b>Acquisition Strategy</b>{result.acquisition?.strategies?.map((item) => <p key={item.id}><strong>{item.id}</strong>: {item.recommendation}</p>)}</div>
              <div><b>Retention Loops</b><p>Retention score: {result.retention?.retentionScore}</p>{result.retention?.loops?.map((item) => <p key={item.id}><strong>{item.id}</strong>: {item.recommendation}</p>)}</div>
              <div><b>Scale Readiness</b><p>Scale score: {result.scale?.scaleScore}</p><p>Stage: {result.scale?.stage}</p><p>Next: {result.scale?.nextScaleAction}</p></div>
              <div className="wide"><b>Marketplace Link</b><p>{result.marketplace?.response}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
