
export function updateEventMemory({ memory = {}, intent = {}, blueprint = {}, pricing = {}, approvals = {} } = {}) {
  const events = [
    ...(memory.eventHistory || []),
    {
      eventType: intent.eventType,
      guestCount: intent.guestCount || blueprint.blueprint?.guestCount,
      budget: intent.budget || null,
      estimatedTotal: pricing.total || null,
      approvalCount: approvals.approvals?.length || 0,
      createdAt: new Date().toISOString()
    }
  ].slice(-100);

  const preferences = {
    ...(memory.eventPreferences || {}),
    preferredEventType: intent.eventType || memory.eventPreferences?.preferredEventType,
    latestGuestCount: intent.guestCount || memory.eventPreferences?.latestGuestCount,
    budgetSensitivity: pricing.budgetStatus === "over_budget" ? "protect_budget" : memory.eventPreferences?.budgetSensitivity || "balanced"
  };

  return {
    layer: "event_memory_engine",
    eventHistory: events,
    eventPreferences: preferences,
    summary: `Event memory updated with ${events.length} event planning run(s).`
  };
}
