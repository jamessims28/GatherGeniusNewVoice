
export function buildEventBlueprint({ intent = {}, request = "", location = "Virginia" } = {}) {
  const guestCount = intent.guestCount || 100;
  const eventType = intent.eventType || "general_event";

  const blueprint = {
    eventType,
    location,
    guestCount,
    budget: intent.budget,
    sections: [
      section("planning", ["event date", "guest count", "budget", "privacy level"]),
      section("vendors", vendorNeeds(intent)),
      section("food_and_beverage", foodNeeds(eventType, guestCount)),
      section("logistics", ["setup schedule", "cleanup crew", "parking/arrival flow", "weather backup"]),
      section("approvals", ["vendor outreach", "booking", "payment/deposit", "calendar invites"])
    ],
    approvalRequired: true,
    createdAt: new Date().toISOString()
  };

  return {
    layer: "event_blueprint_engine",
    blueprint,
    summary: `${eventType} blueprint prepared for ${guestCount} guests in ${location}.`
  };
}

function section(id, items) {
  return { id, items, status: "prepared" };
}

function vendorNeeds(intent) {
  const base = ["venue/location", "tables/chairs", "food/catering", "weather backup"];
  if (intent.eventType === "barbecue") base.push("grills", "porta potties", "trash/cleanup supplies");
  if (intent.needs?.payments) base.push("payment/invoice provider");
  if (intent.needs?.calendar) base.push("calendar/invite workflow");
  return base;
}

function foodNeeds(eventType, guestCount) {
  if (eventType === "barbecue") {
    return ["steak", "chicken breast", "burgers", "hot dogs", "salmon", "potato salad", "pasta salad", "baked beans", "water", "soda", "cupcakes"];
  }
  return ["main course", "sides", "dessert", "water", "soda", "dietary options"];
}
