
export function prepareEventCalendar({ intent = {}, blueprint = {}, request = "" } = {}) {
  const date = extractDate(request);
  const eventType = intent.eventType || "event";
  const title = `GatherGenius ${eventType.replace("_", " ")} planning`;

  const calendarDraft = {
    title,
    date,
    durationHours: eventType === "barbecue" ? 6 : 4,
    reminders: ["30 days before", "14 days before", "7 days before", "1 day before"],
    checklistMilestones: [
      "confirm guest count",
      "approve vendor outreach",
      "review pricing",
      "approve bookings",
      "prepare setup/cleanup duties"
    ],
    status: date ? "calendar_draft_prepared" : "date_needed",
    approvalRequired: true
  };

  return {
    layer: "calendar_prep_engine",
    calendarDraft,
    connectorStatus: "ready_for_google_calendar_api",
    message: date ? "Calendar draft prepared for approval." : "Calendar draft prepared but date is needed."
  };
}

function extractDate(text) {
  const m = String(text).match(/(\d{1,2}\/\d{1,2}\/\d{2,4})|((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i);
  return m ? m[0] : null;
}
