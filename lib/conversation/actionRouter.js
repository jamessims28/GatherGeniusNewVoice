
import { buildExperienceLockFromPrompt } from "../engine/eventBuilder";

export function detectActionFromText(text = "") {
  const t = String(text).toLowerCase();

  if (t.includes("lock") && (t.includes("experience") || t.includes("it"))) return "lock_experience";
  if (t.includes("build") || t.includes("create") || t.includes("plan") || t.includes("help me")) return "build_experience";
  if (t.includes("permission") || t.includes("access")) return "request_permission";
  if (t.includes("price") || t.includes("cost") || t.includes("budget") || t.includes("how much")) return "estimate_price";
  if (t.includes("problem") || t.includes("issue") || t.includes("error")) return "explain_issue";

  return "conversation";
}

export function runLocalConversationAction({ text = "", currentLock = null } = {}) {
  const action = detectActionFromText(text);

  if (action === "build_experience") {
    const eventLock = buildExperienceLockFromPrompt(text);
    return {
      action,
      ok: true,
      eventLock,
      message: `I built the first version. Confidence is ${eventLock.confidenceScore}%. The activation deposit is $${eventLock.deposit.toLocaleString()}.`
    };
  }

  if (action === "lock_experience") {
    if (!currentLock) {
      return { action, ok: false, message: "I can lock it after we build the experience first." };
    }
    return { action, ok: true, message: "I’m ready to lock the experience and open secure checkout." };
  }

  if (action === "request_permission") {
    return { action, ok: true, message: "I can ask for only the data I need and keep the rest private." };
  }

  if (action === "estimate_price") {
    return { action, ok: true, message: "I’ll price that using live pricing connectors when available, then fall back to a safe estimate if live data is not connected." };
  }

  if (action === "explain_issue") {
    return { action, ok: true, message: "I’ll explain what happened, why it matters, and the safest next step." };
  }

  return { action, ok: true, message: "I understand. I’ll keep this simple and guide you to the next best step." };
}
