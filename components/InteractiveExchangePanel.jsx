"use client";

import { useState } from "react";

export default function InteractiveExchangePanel() {
  const [text, setText] = useState("I feel overwhelmed, but I have an idea for a private luxury family experience.");
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runExchange() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/conversation/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, assistantSpeaking })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ ok: false, message: "Conversation exchange failed.", error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="gg-exchange-layer">
      <span className="gg-status good">Interactive Thought Exchange</span>
      <h2>Genius listens like a person.</h2>
      <p className="gg-note">
        Turn-taking, active listening, feeling reflection, thought memory, follow-up questions, and interruption handling now run in the background.
      </p>

      <div className="gg-exchange-row">
        <textarea value={text} onChange={(event) => setText(event.target.value)} />
        <button type="button" className="gg-btn green" onClick={runExchange} disabled={loading}>
          {loading ? "LISTENING..." : "RUN EXCHANGE"}
        </button>
      </div>

      <label className="gg-exchange-toggle">
        <input type="checkbox" checked={assistantSpeaking} onChange={(event) => setAssistantSpeaking(event.target.checked)} />
        Assistant is currently speaking
      </label>

      {result && (
        <div className="gg-exchange-result">
          <div className="gg-line"><span>Conversation Type</span><strong>{result.exchange?.conversationType}</strong></div>
          <div className="gg-line"><span>Turn Cue</span><strong>{result.exchange?.turnState?.nextCue}</strong></div>
          <div className="gg-line"><span>Interrupt</span><strong>{String(result.interruption?.shouldInterrupt)}</strong></div>
          <p className="gg-note">{result.response}</p>
        </div>
      )}
    </section>
  );
}
