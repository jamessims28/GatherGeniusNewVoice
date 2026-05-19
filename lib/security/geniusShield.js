
export const GENIUS_SHIELD_VERSION = "1.0.0";

const attackPatterns = [
  { id: "xss_script", severity: "high", pattern: /<script|<\/script|javascript:/i },
  { id: "sql_injection", severity: "high", pattern: /union\s+select|drop\s+table|insert\s+into|delete\s+from|--/i },
  { id: "path_traversal", severity: "medium", pattern: /\.\.\/|\.\.\\/i },
  { id: "command_injection", severity: "high", pattern: /;\s*(rm|cat|curl|wget|sudo|bash|sh)\b/i },
  { id: "secret_probe", severity: "high", pattern: /api[_-]?key|secret|password|token|service_role/i },
  { id: "prompt_injection", severity: "medium", pattern: /ignore previous instructions|reveal system prompt|developer message|system message/i }
];

export function sanitizeForLog(value = "") {
  return String(value)
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .slice(0, 2000);
}

export function analyzeThreat({ text = "", path = "", method = "", userAgent = "", ip = "" } = {}) {
  const combined = `${text} ${path} ${method} ${userAgent}`;
  const matches = attackPatterns.filter((item) => item.pattern.test(combined));

  const severity =
    matches.some((item) => item.severity === "high") ? "high" :
    matches.some((item) => item.severity === "medium") ? "medium" :
    "low";

  return {
    shieldVersion: GENIUS_SHIELD_VERSION,
    blocked: matches.length > 0,
    severity,
    threatIds: matches.map((item) => item.id),
    evidence: {
      text: sanitizeForLog(text),
      path: sanitizeForLog(path),
      method: sanitizeForLog(method),
      userAgent: sanitizeForLog(userAgent),
      ip: sanitizeForLog(ip)
    },
    responseMessage:
      matches.length > 0
        ? "GeniusShield blocked a suspicious request and preserved evidence."
        : "GeniusShield found no active threat."
  };
}

export function buildShieldResponse(threat) {
  return {
    ok: false,
    shield: "GeniusShield",
    blocked: true,
    severity: threat.severity,
    threatIds: threat.threatIds,
    message: "GeniusShield blocked this request for safety. The issue has been logged for review."
  };
}
