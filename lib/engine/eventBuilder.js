
export function buildExperienceLockFromPrompt(prompt = "") {
  const text = String(prompt || "").toLowerCase();

  const eventType =
    text.includes("wedding") ? "Wedding" :
    text.includes("birthday") ? "Birthday" :
    text.includes("graduation") ? "Graduation" :
    text.includes("corporate") ? "Corporate Experience" :
    text.includes("bbq") || text.includes("barbecue") ? "Backyard BBQ" :
    text.includes("meeting") ? "Meeting Experience" :
    "Custom Experience";

  const guestMatch = text.match(/(\d{1,5})\s*(guest|guests|people|persons|person)/);
  const guests = guestMatch ? Number(guestMatch[1]) : 100;

  const budgetMatch =
    text.match(/\$\s?(\d{1,3}(?:,\d{3})+|\d{1,7})(k)?/) ||
    text.match(/under\s+\$?\s?(\d{1,7})(k)?/);

  let budget = 15000;
  if (budgetMatch) {
    budget = Number(String(budgetMatch[1]).replace(/,/g, ""));
    if (budgetMatch[2] === "k") budget *= 1000;
  }

  const location =
    text.includes("virginia") ? "Virginia" :
    text.includes("stafford") ? "Stafford, VA" :
    text.includes("richmond") ? "Richmond, VA" :
    text.includes("fredericksburg") ? "Fredericksburg, VA" :
    "Local Market";

  const primaryVendors = [
    { role: "Venue", name: "Preferred Venue Partner", price: 3500 },
    { role: "Catering", name: "Preferred Catering Partner", price: Math.round(guests * 42) },
    { role: "Music", name: "Preferred Sound Partner", price: 900 },
    { role: "Rentals", name: "Preferred Rental Partner", price: 1800 },
    { role: "Lighting", name: "Preferred Lighting Partner", price: 1100 }
  ];

  const backupVendors = primaryVendors.map((vendor) => ({
    role: vendor.role,
    name: `Backup ${vendor.role} Partner`
  }));

  const subtotal = primaryVendors.reduce((sum, vendor) => sum + Number(vendor.price || 0), 0);
  const platformFee = Math.round(subtotal * 0.08);
  const total = subtotal + platformFee;
  const deposit = Math.round(total * 0.15);

  return {
    lockCode: `GG-${Date.now()}`,
    status: "ready_to_lock",
    name: `${eventType} — Guided Experience Result`,
    intent: { rawInput: prompt, eventType, guests, budget, location },
    primaryVendors,
    backupVendors,
    subtotal,
    platformFee,
    total,
    deposit,
    confidenceScore: 94,
    backupCoverage: `${backupVendors.length}/${primaryVendors.length} roles covered`,
    replacementWindow: "2 hours",
    guaranteeStatus: "guided",
    createdAt: new Date().toISOString()
  };
}
