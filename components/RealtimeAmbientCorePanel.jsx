"use client";

import { useEffect, useRef, useState } from "react";
import { RealtimeAudioPipeline } from "../lib/realtime/realtimeAudioPipeline";
import { createInterruptController } from "../lib/realtime/interruptibleSpeech";
import { streamOperatingCoreTokens } from "../lib/realtime/lowLatencyTokenStream";
import { buildBackgroundContextSnapshot } from "../lib/realtime/backgroundContextAwareness";
import { updateMemoryGraph } from "../lib/memory/longTermMemoryGraph";
import { runOrchestrationAgents } from "../lib/agents/orchestrationAgents";
import { createWorldSyncLoop } from "../lib/world/liveWorldStateSync";
import { createAutonomousSafeExecutionLoop } from "../lib/execution/autonomousSafeExecutionLoop";

export default function RealtimeAmbientCorePanel() {
  const [status, setStatus] = useState("Ready to initialize realtime ambient core.");
  const [messages, setMessages] = useState([{ role: "Genius", text: "Realtime Ambient Core is ready." }]);
  const [streamingText, setStreamingText] = useState("");
  const [worldState, setWorldState] = useState(null);
  const [memoryGraph, setMemoryGraph] = useState({ nodes: [], edges: [] });
  const [agents, setAgents] = useState([]);
  const [safeLoopEvents, setSafeLoopEvents] = useState([]);
  const [connected, setConnected] = useState(false);

  const pipelineRef = useRef(null);
  const interruptRef = useRef(createInterruptController());
  const executionLoopRef = useRef(null);
  const worldLoopRef = useRef(null);

  useEffect(() => {
    executionLoopRef.current = createAutonomousSafeExecutionLoop({
      onDecision: (action) => setSafeLoopEvents((items) => [...items, { type: "executed", action }]),
      onBlocked: (action) => setSafeLoopEvents((items) => [...items, { type: "blocked", action }])
    });

    worldLoopRef.current = createWorldSyncLoop({
      location: "Virginia",
      intervalMs: 60000,
      onSync: (state) => setWorldState(state)
    });

    return () => {
      pipelineRef.current?.close?.();
      executionLoopRef.current?.stop?.();
      worldLoopRef.current?.stop?.();
    };
  }, []);

  function addMessage(role, text) {
    setMessages((items) => [...items, { role, text, at: new Date().toISOString() }]);
  }

  async function connectRealtime() {
    setStatus("Connecting realtime audio pipeline...");

    const pipeline = new RealtimeAudioPipeline({
      onEvent: (event) => {
        if (event.type) setStatus(`Realtime event: ${event.type}`);
      },
      onTranscript: (event) => {
        const delta = event.delta || event.transcript || event.text || "";
        if (delta) setStreamingText((text) => text + delta);
      },
      onAudioState: (state) => setStatus(`Audio: ${state}`),
      onError: (error) => {
        setStatus(`Realtime issue: ${error.message}`);
        addMessage("Genius", "Realtime voice could not connect. Browser Voice Mode remains available.");
      }
    });

    pipelineRef.current = pipeline;
    const result = await pipeline.connect();

    if (result.ok) {
      setConnected(true);
      setStatus("Realtime audio connected.");
      addMessage("Genius", "Realtime audio pipeline is connected.");
    } else {
      setConnected(false);
      setStatus(result.message || "Realtime audio unavailable.");
    }
  }

  function interruptSpeech() {
    const result = interruptRef.current.interrupt({ pipeline: pipelineRef.current });
    setStatus(result.action);
    addMessage("Genius", "I stopped speaking and I’m listening.");
  }

  function testTokenStream() {
    setStreamingText("");
    setStatus("Streaming low-latency tokens...");

    streamOperatingCoreTokens({
      text: "Genius, coordinate a premium family experience and protect the outcome.",
      readiness: { ready: true },
      onToken: (token) => setStreamingText((value) => value + token),
      onDone: () => {
        setStatus("Token stream complete.");
        addMessage("Genius", "Token stream complete.");
      },
      onError: (error) => setStatus(error.message)
    });
  }

  function refreshContextAndAgents() {
    const context = buildBackgroundContextSnapshot({
      conversation: messages,
      readiness: { ready: connected },
      world: worldState?.world || {},
      permissions: { voice: connected }
    });

    const nextMemory = updateMemoryGraph({
      graph: memoryGraph,
      observation: {
        intent: {
          spending: "premium_value",
          emotion: "calm",
          location: "Virginia",
          intent: "coordinate_outcome"
        }
      }
    });

    const nextAgents = runOrchestrationAgents({
      readiness: { ready: connected },
      intent: { missing: [], intent: "coordinate_outcome" },
      world: worldState?.world || {},
      memory: nextMemory,
      protection: { risks: [], canProceed: true, userMessage: "Safe to continue." }
    });

    setMemoryGraph(nextMemory);
    setAgents(nextAgents);
    addMessage("Genius", `Context refreshed: ${context.inferredState.reason}.`);
  }

  function enqueueSafeAction() {
    const action = {
      id: `safe_action_${Date.now()}`,
      type: "internal_preparation",
      label: "Prepare next safe recommendation",
      riskLevel: "low",
      requiresPermission: false,
      permissionGranted: true
    };

    executionLoopRef.current?.enqueue(action);
    addMessage("Genius", "Safe execution action queued.");
  }

  return (
    <section className="gg-realtime-ambient-core">
      <div className="gg-rac-orb"><span /></div>

      <div className="gg-rac-card">
        <div className="gg-rac-header">
          <strong>GatherGenius Realtime Ambient Core</strong>
          <small>{status}</small>
        </div>

        <div className="gg-rac-actions">
          <button type="button" onClick={connectRealtime}>Connect realtime voice</button>
          <button type="button" onClick={interruptSpeech}>Interrupt</button>
          <button type="button" onClick={testTokenStream}>Stream tokens</button>
          <button type="button" onClick={refreshContextAndAgents}>Refresh context</button>
          <button type="button" onClick={enqueueSafeAction}>Queue safe action</button>
        </div>

        <div className="gg-rac-grid">
          <div className="gg-rac-box">
            <b>Conversation</b>
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`}><strong>{message.role}:</strong> {message.text}</p>
            ))}
          </div>

          <div className="gg-rac-box">
            <b>Token Stream</b>
            <p>{streamingText || "No active stream."}</p>
          </div>

          <div className="gg-rac-box">
            <b>Memory Graph</b>
            <p>{memoryGraph.summary || "No stable memory yet."}</p>
          </div>

          <div className="gg-rac-box">
            <b>Agents</b>
            {agents.length ? agents.map((agent) => (
              <p key={agent.id}><strong>{agent.id}</strong>: {agent.status} — {agent.recommendation}</p>
            )) : <p>No agent run yet.</p>}
          </div>

          <div className="gg-rac-box">
            <b>World Sync</b>
            <p>{worldState?.ok ? `Synced ${worldState.location}` : "Waiting for world sync."}</p>
          </div>

          <div className="gg-rac-box">
            <b>Safe Loop</b>
            {safeLoopEvents.length ? safeLoopEvents.map((event, index) => (
              <p key={index}>{event.type}: {event.action.label}</p>
            )) : <p>No safe loop actions yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
