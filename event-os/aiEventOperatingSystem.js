
import { runEventIntentEngine } from "./eventIntentEngine";
import { buildEventBlueprint } from "./eventBlueprintEngine";
import { matchEventVendors } from "./vendorMatcher";
import { priceEventPlan } from "./eventPricingEngine";
import { prepareEventCalendar } from "./calendarPrepEngine";
import { buildEventApprovalQueue } from "./eventApprovalQueue";
import { updateEventMemory } from "./eventMemoryEngine";

export async function runAIEventOperatingSystem({
  request = "",
  userKey = "anonymous_preview",
  memory = {},
  location = process.env.EVENT_OS_DEFAULT_LOCATION || "Virginia",
  permissions = {}
} = {}) {
  const intent = runEventIntentEngine({ request, userMemory: memory.eventPreferences || {} });
  const blueprint = buildEventBlueprint({ intent, request, location });
  const vendors = matchEventVendors({ intent, blueprint, location });
  const pricing = priceEventPlan({ intent, vendors, blueprint });
  const calendar = prepareEventCalendar({ intent, blueprint, request });
  const approvals = buildEventApprovalQueue({ vendors, pricing, calendar, intent });
  const eventMemory = updateEventMemory({ memory, intent, blueprint, pricing, approvals });

  return {
    ok: true,
    layer: "ai_event_operating_system",
    name: "GatherGenius AI Event Operating System V1",
    backgroundOnly: true,
    userKey,
    intent,
    blueprint,
    vendors,
    pricing,
    calendar,
    approvals,
    eventMemory,
    response: buildResponse({ intent, blueprint, pricing, approvals }),
    createdAt: new Date().toISOString()
  };
}

function buildResponse({ intent, blueprint, pricing, approvals }) {
  const eventName = String(intent.eventType || "event").replace("_", " ");
  return `I prepared a ${eventName} operating plan in the background. Estimated total: $${pricing.total}. ${approvals.readyCount} approval item(s) are ready for review.`;
}
