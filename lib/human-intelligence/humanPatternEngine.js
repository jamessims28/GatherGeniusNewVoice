
export function analyzeSpendingPsychology({ text = "", prior = {} } = {}) {
  const t = String(text).toLowerCase();

  const valueFocused = /deal|save|cheaper|discount|best price|budget/.test(t);
  const premiumFocused = /luxury|premium|elite|best|high end|exclusive/.test(t);
  const certaintyFocused = /guarantee|safe|secure|protect|backup|reliable/.test(t);

  return {
    spendingPsychology:
      premiumFocused ? "premium-value" :
      valueFocused ? "budget-protective" :
      certaintyFocused ? "certainty-first" :
      prior.spendingPsychology || "balanced",
    recommendedPricingStyle:
      premiumFocused ? "show best option first with confidence" :
      valueFocused ? "show savings and safe estimate" :
      certaintyFocused ? "show risk protection and backup value" :
      "show clear mid-range path",
    message: "Spending psychology analyzed."
  };
}

export function analyzeTimingBehavior({ text = "", history = [] } = {}) {
  const t = String(text).toLowerCase();
  const urgent = /today|tomorrow|asap|urgent|now|quick|fast/.test(t);
  const flexible = /flexible|anytime|whenever|open/.test(t);
  const dateMentioned = /\b(january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2})\b/i.test(text);

  return {
    timingBehavior: urgent ? "urgent" : flexible ? "flexible" : dateMentioned ? "date-specific" : "guided",
    actionCadence: urgent ? "fast-track" : flexible ? "optimize-for-price" : "confirm-best-window",
    message: "Timing behavior analyzed."
  };
}

export function analyzeSocialPatterns({ text = "", prior = {} } = {}) {
  const t = String(text).toLowerCase();
  const family = /family|cousin|aunt|uncle|private|kids|grand/.test(t);
  const business = /business|corporate|client|team|investor|company/.test(t);
  const publicFacing = /public|community|ticket|audience|social|creator/.test(t);

  return {
    socialPattern: family ? "private-family" : business ? "professional" : publicFacing ? "public-facing" : prior.socialPattern || "personal",
    privacyLevel: family ? "high" : publicFacing ? "low" : "medium",
    communicationMode: business ? "formal-clear" : family ? "warm-private" : "friendly",
    message: "Social pattern analyzed."
  };
}

export function analyzeTrustPreference({ text = "", prior = {} } = {}) {
  const t = String(text).toLowerCase();
  const needsProof = /prove|proof|review|rating|verified|trusted|safe/.test(t);
  const wantsSpeed = /quick|fast|just do it|handle it/.test(t);
  const wantsControl = /show me|approve|before|confirm|ask me/.test(t);

  return {
    trustPreference: needsProof ? "proof-first" : wantsSpeed ? "delegate-first" : wantsControl ? "approval-first" : prior.trustPreference || "balanced-trust",
    nextTrustMove:
      needsProof ? "show ratings, backup coverage, and confidence" :
      wantsSpeed ? "act with short confirmation" :
      wantsControl ? "ask before committing" :
      "guide with one clear recommendation",
    message: "Trust preference analyzed."
  };
}

export function analyzeCommunicationStyle({ text = "", comfort = {} } = {}) {
  const t = String(text).toLowerCase();
  const direct = /short|quick|direct|straight|simple/.test(t);
  const detailed = /detail|explain|breakdown|why|how/.test(t);
  const emotional = /feel|worried|excited|overwhelmed|stressed/.test(t);

  return {
    communicationStyle:
      direct ? "brief-direct" :
      detailed ? "clear-detailed" :
      emotional ? "supportive-human" :
      comfort.state === "supportive" ? "gentle-reassuring" :
      "friendly-concise",
    responseLength: direct ? "short" : detailed ? "medium" : "concise",
    message: "Communication style analyzed."
  };
}

export function buildHumanUnderstandingProfile({ text = "", prior = {}, comfort = {} } = {}) {
  const spending = analyzeSpendingPsychology({ text, prior });
  const timing = analyzeTimingBehavior({ text });
  const social = analyzeSocialPatterns({ text, prior });
  const trust = analyzeTrustPreference({ text, prior });
  const communication = analyzeCommunicationStyle({ text, comfort });

  return {
    layer: "human_understanding",
    spending,
    timing,
    social,
    trust,
    communication,
    understandsHumans: true,
    summary: `User appears ${spending.spendingPsychology}, ${timing.timingBehavior}, ${social.socialPattern}, ${trust.trustPreference}, with ${communication.communicationStyle} communication.`
  };
}
