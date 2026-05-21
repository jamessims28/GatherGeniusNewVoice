"use client";

import { useState } from "react";

export default function EventOSDashboard() {
  const [request, setRequest] = useState("Plan a premium private family barbecue for 150 guests in Virginia with steak, chicken breast, burgers, hot dogs, salmon, sides, cupcakes, water, soda, tents, chairs, tables, DJ, porta potties, setup, cleanup, pricing, calendar, and approvals.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runEventOS() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/event-os/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, userKey: "anonymous_preview", location: "Virginia" })
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-eventos">
      <div className="gg-eventos-orb"><span /></div>
      <div className="gg-eventos-card">
        <div className="gg-eventos-header">
          <strong>GatherGenius AI Event Operating System</strong>
          <small>Production V1 Event Workflow</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />
        <button type="button" onClick={runEventOS}>{loading ? "BUILDING EVENT PLAN..." : "RUN EVENT OPERATING SYSTEM"}</button>

        {result && (
          <div className="gg-eventos-result">
            <p><b>Response:</b> {result.response}</p>
            <div className="gg-eventos-grid">
              <div><b>Intent</b><p>Type: {result.intent?.eventType}</p><p>Guests: {result.intent?.guestCount || "not set"}</p><p>Budget: {result.intent?.budget ? `$${result.intent.budget}` : "not set"}</p></div>
              <div><b>Blueprint</b><p>{result.blueprint?.summary}</p>{result.blueprint?.blueprint?.sections?.map((section) => <p key={section.id}><strong>{section.id}</strong>: {section.items.join(", ")}</p>)}</div>
              <div><b>Vendors</b><p>Candidates: {result.vendors?.totalCandidates}</p>{result.vendors?.vendors?.slice(0, 8).map((vendor) => <p key={vendor.id}>{vendor.category} — {vendor.outreachStatus}</p>)}</div>
              <div><b>Pricing</b><p>Subtotal: ${result.pricing?.subtotal}</p><p>Contingency: ${result.pricing?.contingency}</p><p>Total: ${result.pricing?.total}</p><p>Status: {result.pricing?.budgetStatus}</p></div>
              <div><b>Calendar</b><p>Status: {result.calendar?.calendarDraft?.status}</p><p>Duration: {result.calendar?.calendarDraft?.durationHours} hours</p></div>
              <div><b>Approvals</b><p>Ready: {result.approvals?.readyCount}</p>{result.approvals?.approvals?.map((item) => <p key={item.id}><strong>{item.type}</strong>: {item.status}</p>)}</div>
              <div className="wide"><b>Event Memory</b><p>{result.eventMemory?.summary}</p></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
