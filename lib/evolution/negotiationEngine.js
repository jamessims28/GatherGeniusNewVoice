export function simulateNegotiation({ total = 12800, demand = "normal", flexibility = "medium" } = {}) {
  const discountRate = demand === "low" ? 0.14 : flexibility === "high" ? 0.09 : 0.05;
  const savings = Math.round(Number(total || 0) * discountRate);

  return {
    layer: "negotiation",
    mode: "simulated",
    savings,
    newEstimatedTotal: Math.max(0, Math.round(Number(total || 0) - savings)),
    recommendation: `Request ${Math.round(discountRate * 100)}% provider flexibility based on availability and package bundling.`,
    message: `I found a possible negotiation path that could save about $${savings.toLocaleString()}.`
  };
}
