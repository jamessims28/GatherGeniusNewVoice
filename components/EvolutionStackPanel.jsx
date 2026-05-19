"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { evolutionLayers } from "../lib/evolution/evolutionLayers";

export default function EvolutionStackPanel() {
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  async function runStack() {
    setRunning(true);
    try {
      const response = await fetch("/api/evolution/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: "GG, build and protect my luxury wedding under $20k in Virginia",
          confidence: 94,
          total: 12800,
          timelineHours: 72,
          providerResponses: [{ responseHours: 2 }, { responseHours: 4 }],
          weatherRisk: "low",
          providerRisk: 2,
          paymentStatus: "ready",
          flexibility: "medium",
          demand: "normal",
          intent: { eventType: "Luxury Wedding", location: "Virginia", budget: 20000 }
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        ok: false,
        userMessage: "Evolution stack could not run. Check the API route.",
        error: error.message
      });
    } finally {
      setRunning(false);
    }
  }

  const layerValues = result?.layers ? Object.values(result.layers) : [];

  return (
    <section className="gg-evolution-panel">
      <div className="gg-evolution-head">
        <div>
          <span className="gg-status good">Implemented AI Evolution Stack</span>
          <h2>10 future layers running under one spark.</h2>
          <p className="gg-note">
            Presence, prediction, emotional mapping, agents, behavior, ambient surface, negotiation, trust, living spark, and outcome consciousness now run as code.
          </p>
        </div>
        <button type="button" className="gg-btn green" onClick={runStack} disabled={running}>
          {running ? "RUNNING..." : "RUN 1–10 STACK"}
        </button>
      </div>

      <div className="gg-evolution-grid">
        {evolutionLayers.map((layer) => (
          <motion.div
            key={layer.id}
            className="gg-evolution-layer"
            whileHover={{ y: -3 }}
          >
            <span>{layer.number}</span>
            <strong>{layer.name}</strong>
            <small>{layer.state}</small>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="gg-evolution-result"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="gg-line"><span>Visible Spark State</span><strong>{result.visibleState || "unknown"}</strong></div>
            <div className="gg-line"><span>Next Best Action</span><strong>{result.nextBestAction || "review"}</strong></div>
            <div className="gg-line"><span>Message</span><strong>{result.userMessage || result.error}</strong></div>

            <div className="gg-evolution-output-grid">
              {layerValues.map((layer) => (
                <div className="gg-metric" key={layer.layer}>
                  <span>{layer.layer}</span>
                  <strong>{layer.status || layer.state || layer.riskLevel || layer.emotionalState || layer.score || "active"}</strong>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
