
const memoryStore = new Map();

export function validateInput(payload = {}) {
  const errors = [];
  const text = payload.request || payload.text || payload.query || "";

  if (!text || typeof text !== "string") errors.push("request_required");
  if (String(text).length > 8000) errors.push("request_too_long");

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      ...payload,
      request: String(text).slice(0, 8000).replace(/<script/gi, "&lt;script")
    }
  };
}

export function rateLimit({ key = "anonymous", max = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 60), windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000) } = {}) {
  const now = Date.now();
  const bucket = memoryStore.get(key) || [];
  const recent = bucket.filter((time) => now - time < windowMs);
  recent.push(now);
  memoryStore.set(key, recent);

  return {
    allowed: recent.length <= max,
    remaining: Math.max(0, max - recent.length),
    resetInMs: windowMs
  };
}

export function protectApiRequest({ payload = {}, userKey = "anonymous" } = {}) {
  const validation = validateInput(payload);
  if (!validation.valid) {
    return { allowed: false, reason: "validation_failed", validation };
  }

  const limit = rateLimit({ key: userKey });
  if (!limit.allowed) {
    return { allowed: false, reason: "rate_limited", limit };
  }

  return { allowed: true, validation, limit };
}
