
export function classifyConversationType(text = "") {
  const t = String(text).toLowerCase();

  if (/feel|worried|stressed|overwhelmed|sad|excited|happy|angry/.test(t)) return "feelings";
  if (/idea|think|what if|imagine|create|brainstorm|vision/.test(t)) return "ideas";
  if (/why|how|explain|understand|meaning/.test(t)) return "thoughts";
  if (/do|build|plan|coordinate|execute|price|find/.test(t)) return "action";
  return "open_exchange";
}

export function detectTurnState({ text = "", elapsedMs = 0, lastSpeaker = "user" } = {}) {
  const trimmed = String(text).trim();
  const lower = trimmed.toLowerCase();

  const isIncomplete =
    /,\s*$/.test(trimmed) ||
    /\b(and|but|because|so|then|also|or)\s*$/i.test(trimmed) ||
    lower.includes("hold on") ||
    lower.includes("wait");

  const asksQuestion = /\?$/.test(trimmed) || /^(what|why|how|when|where|can|could|should|would|do|does|is|are)\b/i.test(trimmed);
  const emotionalDisclosure = /i feel|i'm|i am|worried|stressed|excited|confused|overwhelmed/i.test(trimmed);

  return {
    stage: "turn_taking",
    userMayContinue: isIncomplete,
    shouldRespondNow: !isIncomplete && trimmed.length > 0,
    shouldHoldSpace: isIncomplete || elapsedMs < 900,
    asksQuestion,
    emotionalDisclosure,
    nextCue:
      isIncomplete ? "I’m listening." :
      asksQuestion ? "Answer directly, then invite the next thought." :
      emotionalDisclosure ? "Reflect feeling first, then ask one gentle question." :
      "Reflect, respond, and hand the turn back."
  };
}

export function buildActiveListeningResponse({ text = "", conversationType = "open_exchange", humanProfile = null } = {}) {
  const t = String(text).toLowerCase();

  let reflection = "I hear you.";
  if (/overwhelmed|stressed|worried|confused/.test(t)) reflection = "I hear that this feels like a lot.";
  else if (/excited|love|amazing|great/.test(t)) reflection = "I hear the excitement in that.";
  else if (/idea|what if|imagine/.test(t)) reflection = "That’s an interesting direction.";
  else if (/price|cost|budget/.test(t)) reflection = "You’re thinking about the money side clearly.";
  else if (/safe|protect|trust/.test(t)) reflection = "You want this to feel safe and reliable.";

  const validation =
    conversationType === "feelings" ? "That makes sense." :
    conversationType === "ideas" ? "Let’s shape it together." :
    conversationType === "thoughts" ? "Let’s reason through it." :
    conversationType === "action" ? "I can help move that forward." :
    "I’m with you.";

  return {
    stage: "active_listening",
    reflection,
    validation,
    combined: `${reflection} ${validation}`
  };
}

export function chooseFollowUpQuestion({ text = "", conversationType = "open_exchange", turnState = {} } = {}) {
  if (turnState.asksQuestion) {
    return "Does that match what you were thinking?";
  }

  if (conversationType === "feelings") {
    return "What would make this feel easier right now?";
  }

  if (conversationType === "ideas") {
    return "Do you want to explore the bold version or the simple version first?";
  }

  if (conversationType === "thoughts") {
    return "Do you want me to explain the reasoning or give you the direct answer?";
  }

  if (conversationType === "action") {
    return "Do you want me to move forward with the safest next step?";
  }

  return "What part should we focus on next?";
}

export function buildConversationExchange({ text = "", history = [], humanProfile = null } = {}) {
  const conversationType = classifyConversationType(text);
  const turnState = detectTurnState({ text, elapsedMs: 1200, lastSpeaker: "user" });
  const listening = buildActiveListeningResponse({ text, conversationType, humanProfile });
  const followUp = chooseFollowUpQuestion({ text, conversationType, turnState });

  const memory = buildSharedThoughtMemory({ text, conversationType, history });

  return {
    ok: true,
    layer: "interactive_exchange",
    conversationType,
    turnState,
    listening,
    followUp,
    memory,
    responseFrame: {
      acknowledge: listening.combined,
      answerStyle:
        conversationType === "feelings" ? "gentle and supportive" :
        conversationType === "ideas" ? "creative and collaborative" :
        conversationType === "thoughts" ? "clear reasoning" :
        conversationType === "action" ? "decisive and protective" :
        "natural back-and-forth",
      handBack: followUp
    },
    suggestedResponse: `${listening.combined} ${followUp}`
  };
}

export function buildSharedThoughtMemory({ text = "", conversationType, history = [] } = {}) {
  const memoryItem = {
    type: conversationType,
    userThought: String(text).slice(0, 500),
    capturedAt: new Date().toISOString()
  };

  return {
    stage: "shared_thought_memory",
    shouldRemember: ["feelings", "ideas", "thoughts"].includes(conversationType),
    memoryItem,
    recentExchangeCount: Array.isArray(history) ? history.length : 0
  };
}

export function shouldInterruptAssistant({ incomingSpeech = "", assistantSpeaking = false } = {}) {
  const t = String(incomingSpeech).toLowerCase();
  const interrupt = assistantSpeaking && (
    t.includes("wait") ||
    t.includes("hold on") ||
    t.includes("stop") ||
    t.includes("no") ||
    t.includes("actually")
  );

  return {
    stage: "interruption_handling",
    shouldInterrupt: interrupt,
    action: interrupt ? "cancel_current_speech_and_listen" : "continue",
    message: interrupt ? "I’ll stop and listen." : "No interruption needed."
  };
}
