"use client";

import { useState } from "react";

export default function Phase7ControlDashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runControl() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase7/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userKey: "anonymous_preview",
          role: "admin",
          request: "Open trust production control center"
        })
      });

      setResult(await response.json());
    } catch (error) {
      setResult({ ok: false, response: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-phase7">
      <div className="gg-phase7-orb"><span /></div>

      <div className="gg-phase7-card">
        <div className="gg-phase7-header">
          <strong>GatherGenius Trust & Production Control Core</strong>
          <small>Phase 7 Admin Control</small>
        </div>

        <button type="button" onClick={runControl}>
          {loading ? "RUNNING TRUST CONTROLS..." : "RUN TRUST CONTROL CENTER"}
        </button>

        {result && (
          <div className="gg-phase7-result">
            <p><b>Status:</b> {result.response}</p>
            <p><b>Role:</b> {result.role}</p>

            <div className="gg-phase7-grid">
              <div>
                <b>Access Control</b>
                <p>{result.access?.message || "Access checked."}</p>
                <p>API protection: {result.protection?.allowed ? "allowed" : "blocked"}</p>
              </div>

              <div>
                <b>Integrations</b>
                <p>Ready: {result.integrationSummary?.ready?.join(", ") || "none"}</p>
                <p>Missing: {result.integrationSummary?.missing?.join(", ") || "none"}</p>
                <p>Placeholders: {result.integrationSummary?.placeholders?.join(", ") || "none"}</p>
              </div>

              <div>
                <b>Stripe Readiness</b>
                <p>Configured: {result.stripe?.configured ? "yes" : "no"}</p>
                <p>Webhook: {result.stripe?.webhookConfigured ? "yes" : "no"}</p>
                <p>Missing: {result.stripe?.missing?.join(", ") || "none"}</p>
              </div>

              <div>
                <b>Investor Metrics</b>
                <p>Pending approvals: {result.metrics?.approvalsPending || 0}</p>
                <p>Prepared actions: {result.metrics?.actionsPrepared || 0}</p>
                <p>Approved actions: {result.metrics?.actionsApproved || 0}</p>
                <p>Audit events: {result.metrics?.auditEvents || 0}</p>
              </div>

              <div className="wide">
                <b>Approval Queue</b>
                {result.approvalQueue?.length ? result.approvalQueue.map((item) => (
                  <p key={item.id}>
                    <strong>{item.label}</strong> — {item.status}<br />
                    <span>{item.reason}</span>
                  </p>
                )) : <p>No approvals pending.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
