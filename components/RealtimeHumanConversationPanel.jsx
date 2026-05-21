"use client";

import { useEffect, useRef, useState } from "react";
import { FullDuplexVoiceCore } from "../lib/human-conversation/fullDuplexVoiceCore";

export default function RealtimeHumanConversationPanel() {
  const [status, setStatus] = useState("Tap Enable Conversation Layer.");
  const [messages, setMessages] = useState([{ role: "Genius", text: "Realtime Human Conversation Layer is ready." }]);
  const [result, setResult] = useState(null);
  const [active, setActive] = useState(false);
  const [orbState, setOrbState] = useState("idle");
  const voiceRef = useRef(null);

  function addMessage(role, text) {
    setMessages((items) => [...items, { role, text, at: new Date().toISOString() }]);
  }

  async function runLayer(text) {
    addMessage("You", text);
    setStatus("Running human conversation layer...");

    try {
      const response = await fetch("/api/human-conversation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, history: messages, location: "Virginia" })
      });

      const data = await response.json();
      setResult(data);
      addMessage("Genius", data.response);
      voiceRef.current?.speak?.(data.response, data.voice);
      setStatus("Conversation layer active.");
    } catch {
      const fallback = "I had trouble reaching the conversation layer.";
      addMessage("Genius", fallback);
      voiceRef.current?.speak?.(fallback);
      setStatus("Issue.");
    }
  }

  async function enableLayer() {
    if (active) return;
    const voice = new FullDuplexVoiceCore({
      onUserText: runLayer,
      onAssistantText: (text) => setStatus(`Speaking: ${text.slice(0, 40)}...`),
      onState: (state) => {
        setOrbState(state.speaking ? "speaking" : state.listening ? "listening" : "idle");
        setStatus(state.mode || "active");
      },
      onInterrupt: () => addMessage("Genius", "I stopped and I’m listening."),
      onError: () => setStatus("Voice issue. Check browser microphone permission.")
    });

    voiceRef.current = voice;

    if (!voice.isSupported()) {
      addMessage("Genius", "This browser does not support full voice conversation. Use Chrome or Edge.");
      return;
    }

    try {
      await voice.requestMicrophone();
      setActive(true);
      addMessage("Genius", "Conversation layer enabled. You can speak naturally.");
      voice.speak("Conversation layer enabled. You can speak naturally.");
      setTimeout(() => voice.startListening(), 900);
    } catch {
      addMessage("Genius", "Please allow microphone permission to enable conversation.");
    }
  }

  function interrupt() {
    voiceRef.current?.interrupt?.("manual");
  }

  useEffect(() => {
    return () => voiceRef.current?.stop?.();
  }, []);

  return (
    <section className="gg-human-convo">
      <div className={`gg-human-orb ${orbState}`}><span /></div>

      <div className="gg-human-card">
        <div className="gg-human-header">
          <strong>Realtime Human Conversation Layer</strong>
          <small>{status}</small>
        </div>

        <div className="gg-human-actions">
          <button type="button" onClick={enableLayer}>Enable conversation layer</button>
          <button type="button" onClick={interrupt}>Interrupt</button>
          <button type="button" onClick={() => runLayer("Genius, help me coordinate this and keep it calm.")}>Demo request</button>
        </div>

        <div className="gg-human-grid">
          <div className="gg-human-box transcript">
            <b>Conversation</b>
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`}><strong>{message.role}:</strong> {message.text}</p>
            ))}
          </div>

          <div className="gg-human-box">
            <b>Emotional Voice</b>
            <p>{result?.emotion?.state || "Waiting."}</p>
            <p>{result?.voice?.tone || "No tone selected yet."}</p>
          </div>

          <div className="gg-human-box">
            <b>Memory Continuity</b>
            <p>{result?.sessionMemory?.summary || "No memory summary yet."}</p>
          </div>

          <div className="gg-human-box">
            <b>Relationship Memory</b>
            <p>{result?.relationship?.summary || "Learning relationship context."}</p>
          </div>

          <div className="gg-human-box">
            <b>Live Orchestration Agents</b>
            {result?.agents?.length ? result.agents.map((agent) => (
              <p key={agent.id}><strong>{agent.id}</strong>: {agent.status} — {agent.output}</p>
            )) : <p>No agent run yet.</p>}
          </div>

          <div className="gg-human-box">
            <b>World + Recommendation</b>
            <p>World risk: {result?.world?.riskLevel || "unknown"}</p>
            <p>{result?.recommendation?.recommendation || "No recommendation yet."}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
