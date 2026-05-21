
export function measureLatency({ startedAt = performance.now(), endedAt = performance.now() } = {}) {
  const ms = Math.max(0, Math.round(endedAt - startedAt));
  return {
    ms,
    grade: ms < 250 ? "excellent" : ms < 700 ? "good" : ms < 1500 ? "acceptable" : "slow"
  };
}

export function createRealtimeSessionState() {
  return {
    connected: false,
    speaking: false,
    listening: false,
    interrupted: false,
    lastLatency: null,
    reconnectAttempts: 0,
    fallbackMode: false,
    events: []
  };
}

export function reduceRealtimeEvent(state, event = {}) {
  const next = { ...state, events: [...(state.events || []), { ...event, at: new Date().toISOString() }].slice(-40) };

  if (event.type === "connected") next.connected = true;
  if (event.type === "disconnected") next.connected = false;
  if (event.type === "speaking_started") next.speaking = true;
  if (event.type === "speaking_finished") next.speaking = false;
  if (event.type === "listening_started") next.listening = true;
  if (event.type === "listening_finished") next.listening = false;
  if (event.type === "interrupted") {
    next.interrupted = true;
    next.speaking = false;
    next.listening = true;
  }
  if (event.type === "latency") next.lastLatency = event.latency;
  if (event.type === "fallback") next.fallbackMode = true;
  if (event.type === "reconnect") next.reconnectAttempts += 1;

  return next;
}

export function shouldReconnect(state) {
  return !state.connected && state.reconnectAttempts < 3 && !state.fallbackMode;
}

export function buildRealtimeSystemPrompt({ human = {}, world = {}, memory = {} } = {}) {
  return [
    "You are Genius, GatherGenius Operating Core.",
    "Speak naturally, warmly, and briefly.",
    "Allow interruption. If interrupted, stop and listen.",
    "Use human state, world state, and memory to protect outcomes.",
    `Human state: ${JSON.stringify(human).slice(0, 1000)}`,
    `World state: ${JSON.stringify(world).slice(0, 1000)}`,
    `Memory summary: ${memory.summary || "none"}`
  ].join("\\n");
}
