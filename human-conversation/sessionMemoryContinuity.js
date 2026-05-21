
const MEMORY_KEY = "gathergenius_conversation_memory";

export function loadSessionMemory() {
  if (typeof window === "undefined") return { turns: [], summary: "", preferences: {} };
  try {
    return JSON.parse(localStorage.getItem(MEMORY_KEY) || '{"turns":[],"summary":"","preferences":{}}');
  } catch {
    return { turns: [], summary: "", preferences: {} };
  }
}

export function saveSessionMemory(memory) {
  if (typeof window === "undefined") return false;
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  return true;
}

export function updateSessionMemory({ memory = loadSessionMemory(), turn = {} } = {}) {
  const turns = [...(memory.turns || []), { ...turn, at: new Date().toISOString() }].slice(-80);
  const text = turns.map((item) => item.text || "").join(" ").toLowerCase();

  const preferences = {
    ...memory.preferences,
    premium: /premium|luxury|elite|exclusive/.test(text) || memory.preferences?.premium,
    concise: /short|simple|quick|brief/.test(text) || memory.preferences?.concise,
    reassurance: /worried|overwhelmed|stress|confused/.test(text) || memory.preferences?.reassurance,
    proofFirst: /proof|verify|trusted|safe|secure/.test(text) || memory.preferences?.proofFirst
  };

  const summary = [
    preferences.premium ? "prefers premium value" : "",
    preferences.concise ? "prefers concise guidance" : "",
    preferences.reassurance ? "may need reassurance" : "",
    preferences.proofFirst ? "prefers proof and safety" : ""
  ].filter(Boolean).join(", ") || "learning user preferences";

  const next = { turns, preferences, summary, updatedAt: new Date().toISOString() };
  saveSessionMemory(next);
  return next;
}
