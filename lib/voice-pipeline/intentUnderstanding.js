
export function understandIntent(text = "") {
  const t = String(text).toLowerCase();

  const category =
    t.includes("wedding") ? "wedding" :
    t.includes("bbq") || t.includes("barbecue") ? "bbq" :
    t.includes("birthday") ? "birthday" :
    t.includes("corporate") ? "corporate" :
    t.includes("travel") ? "travel" :
    t.includes("meeting") ? "meeting" :
    "custom_experience";

  const guestMatch = t.match(/(\d{1,5})\s*(guest|guests|people|person|persons)/);
  const budgetMatch = t.match(/\$?\s?(\d{1,3}(?:,\d{3})+|\d{2,7})(k)?/);
  const locationMatch = t.match(/(?:in|near|around)\s+([a-zA-Z ,]+)$/);

  let budget = null;
  if (budgetMatch) {
    budget = Number(String(budgetMatch[1]).replace(/,/g, ""));
    if (budgetMatch[2] === "k") budget *= 1000;
  }

  return {
    stage: "intent_understanding",
    category,
    guests: guestMatch ? Number(guestMatch[1]) : null,
    budget,
    location: locationMatch?.[1]?.trim() || "Virginia",
    requestedOutcome: text,
    enoughToProceed: Boolean(text && text.length > 5),
    missing: [
      !guestMatch ? "guest count" : null,
      !budget ? "budget" : null
    ].filter(Boolean),
    message: "Intent understood."
  };
}
