export function parseEventIntent(input = "") {
  const text = String(input || "").toLowerCase();

  const eventType =
    text.includes("wedding") ? "Wedding" :
    text.includes("birthday") ? "Birthday" :
    text.includes("corporate") ? "Corporate Experience" :
    text.includes("graduation") ? "Graduation" :
    text.includes("bbq") || text.includes("barbecue") ? "Backyard BBQ" :
    text.includes("music") || text.includes("concert") ? "Live Experience" :
    "General Experience";

  const guestsMatch = text.match(/(\d{1,5})\s*(guest|guests|people|person|persons)/);
  const guests = guestsMatch ? Number(guestsMatch[1]) : 100;

  const budgetMatch =
    text.match(/\$\s?(\d{1,3}(?:,\d{3})+|\d{4,7})/) ||
    text.match(/under\s+\$?\s?(\d{4,7})/) ||
    text.match(/budget\s+(?:of\s+)?\$?\s?(\d{4,7})/);

  const budget = budgetMatch ? Number(String(budgetMatch[1]).replace(/,/g, "")) : 15000;

  const location =
    text.includes("virginia") ? "Virginia" :
    text.includes("stafford") ? "Stafford, VA" :
    text.includes("fredericksburg") ? "Fredericksburg, VA" :
    text.includes("richmond") ? "Richmond, VA" :
    text.includes("dc") || text.includes("washington") ? "Washington, DC" :
    "Local Market";

  return { rawInput: input, eventType, guests, budget, location, priority: "zero-thinking" };
}
