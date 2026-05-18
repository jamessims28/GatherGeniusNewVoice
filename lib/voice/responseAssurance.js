
export function buildAcknowledgement(response = "") {
  return {
    heard: "I heard you.",
    processing: "I’m processing your request now.",
    confirmation: response || "Your request is complete.",
    followup: "Would you like me to continue or adjust anything?"
  };
}

export function shouldRepeatResponse(text = "") {
  const t = String(text).toLowerCase();
  return t.includes("important") || t.includes("confirm") || t.includes("repeat");
}
