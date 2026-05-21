"use client";

import { useState } from "react";

export default function Phase8AutonomousRealityDashboard() {
  const [request, setRequest] = useState("Genius, coordinate a premium family gathering with vendors, schedule, weather backup, payment path, and relationship protection.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runPhase8() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/phase8/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request,
          userKey: "anonymous_preview",
          location: "Virginia",
          permissions: { microphone: true }
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
    <section className="gg-phase8">
      <div className="gg-phase8-orb"><span /></div>

      <div className="gg-phase8-card">
        <div className="gg-phase8-header">
          <strong>GatherGenius Autonomous Reality Network</strong>
          <small>Phase 8 Operating View</small>
        </div>

        <textarea value={request} onChange={(event) => setRequest(event.target.value)} />

        <button type="button" onClick={runPhase8}>
          {loading ? "RUNNING AUTONOMOUS REALITY NETWORK..." : "RUN AUTONOMOUS REALITY NETWORK"}
        </button>

        {result && (
          <div className="gg-phase8-result">
            <p><b>Response:</b> {result.response}</p>

            <div className="gg-phase8-grid">
              <div>
                <b>Realtime Voice OS</b>
                <p>Full duplex: {result.voice?.fullDuplex ? "yes" : "no"}</p>
                <p>Interruption: {result.voice?.interruptionHandling ? "enabled" : "off"}</p>
                <p>Ambient listening: {result.voice?.ambientListening ? "enabled" : "permission gated"}</p>
              </div>

              <div>
                <b>Agent Swarm</b>
                {result.swarm?.map((agent) => (
                  <p key={agent.id}><strong>{agent.id}</strong>: {agent.status} — {agent.output}</p>
                ))}
              </div>

              <div>
                <b>Live World-State</b>
                <p>Weather: {result.world?.weather?.risk || "unknown"}</p>
                <p>Risk: {result.world?.riskLevel}</p>
                <p>Pricing: {result.world?.pricing?.mode}</p>
              </div>

              <div>
                <b>Execution Graph</b>
                {result.executionGraph?.nodes?.map((node) => (
                  <p key={node.id}><strong>{node.label}</strong>: {node.status}</p>
                ))}
              </div>

              <div>
                <b>Relationship Graph</b>
                <p>{result.relationship?.relationshipSummary}</p>
                <p>Trust score: {Math.round((result.relationship?.trustScore || 0) * 100)}%</p>
              </div>

              <div>
                <b>Reality Prediction</b>
                <p>Failure risk: {result.predictions?.failureRisk}</p>
                <p>Next protection: {result.predictions?.nextProtection}</p>
              </div>

              <div>
                <b>Ambient Presence</b>
                <p>{result.ambient?.message}</p>
                <p>Softly proactive: {result.ambient?.softlyProactive ? "yes" : "no"}</p>
              </div>

              <div>
                <b>Investor Intelligence</b>
                <p>Execution potential: {result.investor?.executionSuccessPotential}%</p>
                <p>{result.investor?.automationSavingsSignal}</p>
              </div>

              <div>
                <b>Multi-Device Sync</b>
                <p>Enabled: {result.devices?.enabled ? "yes" : "no"}</p>
                <p>Mode: {result.devices?.handoffMode}</p>
              </div>

              <div>
                <b>Reality APIs</b>
                <p>Status: {result.api?.status}</p>
                <p>Orchestration: {result.api?.apis?.orchestration}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
