
export function parsePricingRequest(input = "") {
  const text = String(input || "").toLowerCase();

  const categories = [
    { id: "venue", terms: ["venue", "hall", "space", "banquet"] },
    { id: "catering", terms: ["catering", "food", "bbq", "barbecue", "chef"] },
    { id: "dj", terms: ["dj", "music", "sound"] },
    { id: "rentals", terms: ["chair", "chairs", "table", "tables", "tent", "rental", "rentals"] },
    { id: "photography", terms: ["photographer", "photography", "photo", "video", "videographer"] },
    { id: "hotel", terms: ["hotel", "rooms", "lodging"] },
    { id: "transportation", terms: ["transportation", "bus", "limo", "shuttle"] },
    { id: "decor", terms: ["decor", "flowers", "florist", "lighting"] }
  ];

  const matched = categories.find((category) => category.terms.some((term) => text.includes(term)));

  const locationMatch =
    text.match(/near\s+([a-zA-Z ,]+)$/) ||
    text.match(/in\s+([a-zA-Z ,]+)$/) ||
    text.match(/around\s+([a-zA-Z ,]+)$/);

  const quantityMatch = text.match(/(\d{1,5})\s*(guest|guests|people|chairs|tables|rooms|tents|plates|meals)/);

  return {
    raw: input,
    category: matched?.id || "general",
    query: input,
    location: locationMatch?.[1]?.trim() || process.env.PRICING_REGION_DEFAULT || "Virginia",
    quantity: quantityMatch ? Number(quantityMatch[1]) : null,
    quantityUnit: quantityMatch?.[2] || null
  };
}
