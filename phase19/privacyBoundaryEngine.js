
export function runPrivacyBoundaryEngine({ request = "", action = {}, tenant = {} } = {}) {
  const text = String(request).toLowerCase();

  const sensitiveSignals = [
    /payment|bank|card|ssn|social security|ein|tax/.test(text) ? "financial_or_identity_data" : null,
    /health|medical|diagnosis|drug|marijuana|thc/.test(text) ? "health_sensitive_data" : null,
    /address|location|gps|home/.test(text) ? "location_sensitive_data" : null,
    /family|children|kids/.test(text) ? "family_context" : null
  ].filter(Boolean);

  const externalAction = Boolean(action.external) || /send|email|contact|book|pay|share/.test(text);
  const requiresConsent = sensitiveSignals.length > 0 || externalAction;

  return {
    layer: "privacy_boundary_engine",
    tenantId: tenant.tenantId || "default",
    sensitiveSignals,
    externalAction,
    requiresConsent,
    decision: requiresConsent ? "hold_for_consent" : "background_prepare_allowed",
    message: requiresConsent
      ? "Privacy boundary requires consent before storing, sharing, or executing."
      : "Safe to prepare in the background."
  };
}
