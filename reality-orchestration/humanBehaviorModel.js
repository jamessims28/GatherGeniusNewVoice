
export function runHumanBehaviorModel({ request = "", history = [], memory = {} } = {}) {
  const text = [request, ...history.map(item => item.text || "")].join(" ").toLowerCase();

  return {
    layer: "human_behavioral_modeling_layer",
    stress: /stress|worried|overwhelmed|confused|anxious|frustrated/.test(text) ? 0.84 : 0.2,
    trustMode: /proof|verify|safe|secure|trusted/.test(text) ? "proof_first" : /handle it|do it|go ahead/.test(text) ? "delegation" : "balanced",
    pacing: /quick|fast|asap|urgent|now/.test(text) ? "fast" : "calm",
    spendingPsychology: /premium|luxury|elite|exclusive/.test(text) ? "premium_value" : /budget|cheap|save/.test(text) ? "budget_protective" : "balanced",
    communicationStyle: /detail|explain|breakdown/.test(text) ? "detailed" : /short|brief|simple/.test(text) ? "concise" : "warm_direct",
    memoryInfluence: memory.summary || "no stable memory yet"
  };
}
