
export function analyzeComfortState(text = "", history = []) {
  const t = String(text || "").toLowerCase();

  const stressWords = ["stressed", "worried", "confused", "overwhelmed", "mad", "upset", "help", "don't know", "scared"];
  const excitementWords = ["excited", "love", "amazing", "perfect", "great", "good", "yes"];
  const directWords = ["quick", "fast", "just", "simple", "straight", "answer"];
  const sadWords = ["sad", "tired", "drained", "rough", "bad day"];

  const stressed = stressWords.some((word) => t.includes(word));
  const excited = excitementWords.some((word) => t.includes(word));
  const wantsDirect = directWords.some((word) => t.includes(word));
  const needsCare = sadWords.some((word) => t.includes(word));

  if (stressed || needsCare) {
    return {
      state: "supportive",
      voiceRate: 0.72,
      voicePitch: 1.04,
      voiceVolume: 0.88,
      style: "warm, gentle, reassuring, friend-like",
      opener: "I got you.",
      guidance: "slow down, reduce choices, ask one simple question"
    };
  }

  if (wantsDirect) {
    return {
      state: "direct",
      voiceRate: 0.88,
      voicePitch: 1.02,
      voiceVolume: 0.94,
      style: "clear, confident, brief, friendly",
      opener: "Absolutely.",
      guidance: "answer directly and move to action"
    };
  }

  if (excited) {
    return {
      state: "encouraging",
      voiceRate: 0.86,
      voicePitch: 1.12,
      voiceVolume: 0.96,
      style: "positive, upbeat, helpful, still calm",
      opener: "That sounds great.",
      guidance: "match energy while staying focused"
    };
  }

  return {
    state: "natural",
    voiceRate: 0.80,
    voicePitch: 1.08,
    voiceVolume: 0.92,
    style: "natural, friendly, calm, helpful",
    opener: "I’m with you.",
    guidance: "converse like a trusted friend and guide"
  };
}

export function buildFriendResponseInstruction(comfort) {
  return `
Conversation style:
- Talk like a trusted, intelligent friend.
- Do not sound robotic.
- Do not over-explain.
- Use warm natural phrasing.
- Ask one helpful question at a time.
- If the user sounds stressed, reassure first.
- If the user wants speed, be direct.
- If the user is excited, match the energy gently.
- Current comfort state: ${comfort.state}
- Voice style: ${comfort.style}
- Guidance: ${comfort.guidance}
- Natural opener: ${comfort.opener}
`;
}
