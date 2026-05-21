
export function runEventIntentEngine({ request = "", userMemory = {} } = {}) {
  const text = String(request).toLowerCase();

  const eventType =
    /bbq|barbecue|cookout/.test(text) ? "barbecue" :
    /wedding/.test(text) ? "wedding" :
    /graduation/.test(text) ? "graduation" :
    /birthday/.test(text) ? "birthday" :
    /corporate|business|conference/.test(text) ? "corporate" :
    "general_event";

  const guestMatch = text.match(/(\d{2,5})\s*(guests|people|attendees|family|members)/);
  const budgetMatch = text.match(/\$?\s?(\d{1,3}(?:,\d{3})+|\d{3,7})(k)?/i);

  let budget = null;
  if (budgetMatch) {
    budget = Number(String(budgetMatch[1]).replace(/,/g, ""));
    if (budgetMatch[2]) budget *= 1000;
  }

  const needs = {
    vendors: /vendor|dj|catering|food|tent|chairs|tables|venue|hotel|porta|restroom/.test(text),
    pricing: /price|pricing|cost|budget|quote|estimate/.test(text),
    calendar: /date|schedule|calendar|time|invite|reminder/.test(text),
    payments: /payment|pay|deposit|stripe|invoice|venmo/.test(text),
    menu: /menu|food|steak|salmon|burger|hot dog|soda|water|cupcake/.test(text),
    logistics: /parking|traffic|route|setup|cleanup|delivery|pickup/.test(text)
  };

  return {
    layer: "event_intent_engine",
    eventType,
    guestCount: guestMatch ? Number(guestMatch[1]) : userMemory.defaultGuestCount || null,
    budget,
    needs,
    urgency: /today|tomorrow|asap|urgent|now/.test(text) ? "urgent" : "normal",
    confidence: 0.82,
    createdAt: new Date().toISOString()
  };
}
