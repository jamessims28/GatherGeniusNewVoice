export const permissionCatalog = [
  { id: "profile_memory", title: "Profile + Preferences", shortTitle: "Profile", description: "Use saved preferences like style, budget range, region, accessibility needs, and past selections.", dataExamples: ["preferred vibe", "budget comfort zone", "favorite location", "accessibility mode"], riskLevel: "Low", defaultEnabled: true },
  { id: "experience_history", title: "Experience History", shortTitle: "History", description: "Use previous GatherGenius builds, locks, deposits, and execution outcomes to make better suggestions.", dataExamples: ["past experiences", "successful provider stacks", "deposits", "ratings"], riskLevel: "Medium", defaultEnabled: true },
  { id: "calendar", title: "Calendar Availability", shortTitle: "Calendar", description: "Use calendar availability to suggest dates, avoid conflicts, and coordinate timing.", dataExamples: ["available dates", "busy times", "event windows"], riskLevel: "Medium", defaultEnabled: false },
  { id: "email", title: "Email Context", shortTitle: "Email", description: "Use email context only when approved to identify provider quotes, confirmations, and planning details.", dataExamples: ["vendor quotes", "confirmations", "invoices", "provider replies"], riskLevel: "High", defaultEnabled: false },
  { id: "photos_inspiration", title: "Photos + Inspiration", shortTitle: "Photos", description: "Use uploaded images or inspiration photos to detect vibe, layout, decor, and style.", dataExamples: ["vision photos", "venue inspiration", "layout images"], riskLevel: "Medium", defaultEnabled: false },
  { id: "location", title: "Location + Region", shortTitle: "Location", description: "Use approximate location or selected region to recommend nearby providers and realistic pricing.", dataExamples: ["city", "region", "nearby provider area"], riskLevel: "Medium", defaultEnabled: false },
  { id: "payments", title: "Payment Preferences", shortTitle: "Payments", description: "Use payment preferences to recommend deposit structures, subscriptions, and saved checkout options.", dataExamples: ["deposit preference", "subscription tier", "payment status"], riskLevel: "High", defaultEnabled: false },
  { id: "provider_network", title: "Provider Network Data", shortTitle: "Providers", description: "Use provider performance, response speed, cancellation risk, pricing, and reliability scores.", dataExamples: ["provider acceptance", "SLA speed", "cancellation risk", "pricing history"], riskLevel: "Medium", defaultEnabled: true },
  { id: "voice_personalization", title: "Voice Personalization", shortTitle: "Voice", description: "Let GatherGenius voice personalize responses using approved data points.", dataExamples: ["preferred tone", "spoken summaries", "hands-free command style"], riskLevel: "Medium", defaultEnabled: false }
];

export function buildPermissionDefaults() {
  return permissionCatalog.reduce((acc, item) => {
    acc[item.id] = Boolean(item.defaultEnabled);
    return acc;
  }, {});
}

export function getApprovedContextSummary(permissions = {}) {
  const approved = permissionCatalog.filter((item) => permissions[item.id]);
  if (!approved.length) return "No personal data sources approved yet.";
  return approved.map((item) => item.shortTitle).join(", ");
}
