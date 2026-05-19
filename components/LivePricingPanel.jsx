"use client";

import { useState } from "react";

export default function LivePricingPanel() {
  const [query, setQuery] = useState("Price catering for 120 guests in Virginia");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function priceIt() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/pricing/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        ok: false,
        message: "Pricing failed. Check API route or pricing provider keys.",
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-live-pricing">
      <div>
        <span className="gg-status good">Live Pricing Engine</span>
        <h2>Ask for any specific price.</h2>
        <p className="gg-note">
          GeniusGather searches live pricing when API keys are configured and falls back to planning estimates when they are not.
        </p>
      </div>

      <div className="gg-live-pricing-row">
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
        <button className="gg-btn green" type="button" onClick={priceIt} disabled={loading}>
          {loading ? "PRICING..." : "PRICE IT"}
        </button>
      </div>

      {result && (
        <div className="gg-live-pricing-result">
          {result.ok ? (
            <>
              <div className="gg-line"><span>Mode</span><strong>{result.pricing.mode}</strong></div>
              <div className="gg-line"><span>Category</span><strong>{result.intent.category}</strong></div>
              <div className="gg-line"><span>Location</span><strong>{result.intent.location}</strong></div>
              <div className="gg-line"><span>Low</span><strong>${Number(result.pricing.low || 0).toLocaleString()}</strong></div>
              <div className="gg-line"><span>Mid</span><strong>${Number(result.pricing.mid || 0).toLocaleString()}</strong></div>
              <div className="gg-line"><span>High</span><strong>${Number(result.pricing.high || 0).toLocaleString()}</strong></div>
              <div className="gg-line"><span>Confidence</span><strong>{result.pricing.confidence}</strong></div>
              <p className="gg-note">{result.pricing.note}</p>
              {!!result.providers?.length && (
                <div className="gg-provider-list">
                  {result.providers.slice(0, 4).map((provider, index) => (
                    <div className="gg-metric" key={`${provider.name}-${index}`}>
                      <span>{provider.rating ? `${provider.rating}★` : "Provider"}</span>
                      <strong>{provider.name}</strong>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="gg-note">{result.message || result.error}</p>
          )}
        </div>
      )}
    </section>
  );
}
