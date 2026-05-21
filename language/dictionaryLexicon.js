
export const coreDictionaryLexicon = {
  intentVerbs: [
    "build","create","plan","coordinate","organize","arrange","price","estimate","protect","secure",
    "explain","compare","recommend","find","schedule","book","confirm","cancel","adjust","optimize"
  ],
  emotionWords: {
    reassurance: ["overwhelmed","worried","stressed","confused","concerned","nervous","unsure"],
    excitement: ["excited","amazing","perfect","great","love","beautiful","excellent"],
    urgency: ["urgent","asap","now","soon","quick","fast","today","tomorrow"],
    trust: ["safe","secure","trusted","verified","proof","confirm","guarantee","reliable"]
  },
  toneWords: {
    formal: ["professional","formal","executive","business","institutional"],
    warm: ["family","private","friendly","gentle","kind","helpful"],
    premium: ["luxury","premium","elite","exclusive","high-end","beautiful"],
    concise: ["short","simple","direct","quick","brief"]
  },
  responsePrimitives: {
    acknowledge: [
      "I hear you.",
      "I understand.",
      "I got you.",
      "That makes sense.",
      "I’m with you."
    ],
    clarify: [
      "The one thing I need is",
      "To protect the outcome, I need to know",
      "Before I move forward, I need",
      "The safest next question is"
    ],
    protect: [
      "I’ll protect the outcome before moving forward.",
      "I’ll check the risk path first.",
      "I’ll keep this safe and simple.",
      "I’ll prepare a backup path."
    ],
    act: [
      "I can move to the next safe step.",
      "I’ll start with the safest path.",
      "I’ll guide this one step at a time.",
      "I’ll handle the next move carefully."
    ]
  }
};

export function normalizeLanguageInput(text = "") {
  return String(text || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function scoreLexicon(text = "") {
  const normalized = normalizeLanguageInput(text).toLowerCase();

  const scores = {
    intent: 0,
    reassurance: 0,
    excitement: 0,
    urgency: 0,
    trust: 0,
    formal: 0,
    warm: 0,
    premium: 0,
    concise: 0
  };

  for (const word of coreDictionaryLexicon.intentVerbs) {
    if (normalized.includes(word)) scores.intent += 1;
  }

  for (const [key, words] of Object.entries(coreDictionaryLexicon.emotionWords)) {
    for (const word of words) if (normalized.includes(word)) scores[key] += 1;
  }

  for (const [key, words] of Object.entries(coreDictionaryLexicon.toneWords)) {
    for (const word of words) if (normalized.includes(word)) scores[key] += 1;
  }

  return {
    layer: "dictionary_lexicon",
    normalized,
    scores,
    primaryTone:
      scores.formal ? "formal" :
      scores.premium ? "premium" :
      scores.warm ? "warm" :
      scores.concise ? "concise" :
      "natural",
    emotionalNeed:
      scores.reassurance ? "reassurance" :
      scores.excitement ? "excitement" :
      scores.trust ? "trust" :
      "neutral"
  };
}
