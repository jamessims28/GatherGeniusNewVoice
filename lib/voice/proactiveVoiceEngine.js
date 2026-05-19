export const proactiveVoiceMoments = [
  {
    id: "welcome_guidance",
    level: "soft",
    trigger: "first_visit",
    message: "I’m here when you’re ready. I can ask the next question and keep this simple."
  },
  {
    id: "permission_needed",
    level: "permission",
    trigger: "needs_data_permission",
    message: "I can improve this if you allow background context. Would you like me to use it?"
  },
  {
    id: "pricing_found",
    level: "helpful",
    trigger: "pricing_available",
    message: "I found pricing information that may help. Want me to use it for the result?"
  },
  {
    id: "risk_detected",
    level: "important",
    trigger: "risk_detected",
    message: "I noticed something that may affect the result. I’ll explain it clearly and suggest the safest next step."
  },
  {
    id: "quiet_checkin",
    level: "soft",
    trigger: "idle_checkin",
    message: "I can keep guiding this whenever you’re ready."
  }
];

export function shouldSpeakProactively({ enabled = true, lastSpokenAt = 0, trigger = "idle_checkin", cooldownMs = 45000 } = {}) {
  if (!enabled) return { allowed: false, reason: "Proactive voice is off." };
  const elapsed = Date.now() - Number(lastSpokenAt || 0);
  if (elapsed < cooldownMs) return { allowed: false, reason: "Cooldown active." };
  const moment = proactiveVoiceMoments.find((item) => item.trigger === trigger) || proactiveVoiceMoments.find((item) => item.trigger === "idle_checkin");
  return { allowed: true, moment };
}

export function getProactiveMessage(trigger = "idle_checkin") {
  return proactiveVoiceMoments.find((item) => item.trigger === trigger)?.message || proactiveVoiceMoments[0].message;
}
