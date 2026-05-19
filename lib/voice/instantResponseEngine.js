
export function getInstantCommandResponse(text = "") {
  const t = String(text).toLowerCase().trim();

  if (!t) {
    return {
      matched: false,
      response: "I’m listening.",
      intent: "idle"
    };
  }

  const rules = [
    {
      intent: "build",
      test: /build|create|plan|coordinate|help me/,
      response: "I got you. I’m building the safest path now."
    },
    {
      intent: "price",
      test: /price|cost|budget|estimate|how much/,
      response: "I heard the pricing request. I’m checking the fastest estimate first."
    },
    {
      intent: "protect",
      test: /protect|safe|security|risk|backup/,
      response: "I’m protecting the outcome and checking the risk path."
    },
    {
      intent: "permission",
      test: /permission|access|allow/,
      response: "I’ll only use approved access. I’m checking what is allowed."
    },
    {
      intent: "repeat",
      test: /repeat|say that again|confirm/,
      response: "Absolutely. I’ll confirm the important part again."
    },
    {
      intent: "stop",
      test: /stop|wait|hold on|pause/,
      response: "I’ll pause and listen."
    },
    {
      intent: "friend",
      test: /talk|feel|think|idea|overwhelmed|worried|excited/,
      response: "I hear you. I’m with you."
    }
  ];

  const found = rules.find((rule) => rule.test.test(t));

  if (found) {
    return {
      matched: true,
      intent: found.intent,
      response: found.response,
      latencyMode: "instant-local"
    };
  }

  return {
    matched: true,
    intent: "general",
    response: "I heard you. I’m working on it now.",
    latencyMode: "instant-local"
  };
}

export function buildFastAccurateResponse({ instant, backend }) {
  const backendText = backend?.response || backend?.voiceResponse || backend?.finalResponse?.message || "";
  if (!backendText) return instant.response;
  return `${instant.response} ${backendText}`;
}
