export function getLivingSparkState({ presence = {}, trust = {}, confidence = 0 } = {}) {
  const state =
    trust.status === "warning" ? "warning" :
    confidence >= 90 ? "success" :
    presence.recommendedState === "warning" ? "warning" :
    presence.recommendedState === "listening" ? "listening" :
    "thinking";

  return {
    layer: "living_spark",
    state,
    visual:
      state === "success" ? "radiant expansion" :
      state === "warning" ? "warm amber pulse" :
      state === "listening" ? "soft white listening pulse" :
      "slow intelligent shimmer",
    message: `Spark state set to ${state}.`
  };
}
