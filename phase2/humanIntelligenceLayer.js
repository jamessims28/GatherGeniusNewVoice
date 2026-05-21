
export function analyzeHumanState({ text = "", voice = {}, history = [] } = {}) {
  const t = String(text || "").toLowerCase();

  const stress =
    /overwhelmed|stressed|worried|anxious|confused|tired|frustrated/.test(t) ? 0.85 :
    /help|not sure|don't know|cant|can't/.test(t) ? 0.55 :
    0.2;

  const confidence =
    /yes|confirmed|correct|do it|go ahead/.test(t) ? 0.85 :
    /maybe|not sure|confused|wait/.test(t) ? 0.35 :
    0.65;

  const trust =
    /proof|show me|verify|trusted|safe|secure/.test(t) ? "proof_first" :
    /do it|handle it|you decide/.test(t) ? "delegate_first" :
    "balanced";

  const communication =
    /short|quick|simple|brief/.test(t) ? "brief_direct" :
    /detail|explain|breakdown/.test(t) ? "clear_detailed" :
    stress > 0.6 ? "calm_supportive" :
    "warm_concise";

  const decisionFatigue = history.length > 8 || stress > 0.7;

  return {
    layer: "human_intelligence_layer",
    stress,
    confidence,
    trust,
    communication,
    decisionFatigue,
    emotionalTone:
      stress > 0.7 ? "reassuring" :
      confidence > 0.8 ? "decisive" :
      "friendly",
    suggestedPacing:
      stress > 0.7 ? "slow_one_step" :
      decisionFatigue ? "reduce_choices" :
      "normal",
    responseRule:
      stress > 0.7 ? "acknowledge, reassure, ask one question" :
      trust === "proof_first" ? "show reason, confidence, next step" :
      "answer briefly and guide next step"
  };
}

export function adaptResponseToHuman({ response = "", human = {} } = {}) {
  if (human.suggestedPacing === "slow_one_step") {
    return `I hear you. I’ll keep this simple. ${response}`;
  }

  if (human.suggestedPacing === "reduce_choices") {
    return `${response} I’ll give you one best next step instead of too many options.`;
  }

  if (human.trust === "proof_first") {
    return `${response} I’ll also show why this is the safest recommendation.`;
  }

  return response;
}
