
const protectedTypes = ["vendor_outreach", "booking", "payment", "calendar_invite", "external_message"];

export function buildEventApprovalQueue({ vendors = {}, pricing = {}, calendar = {}, intent = {} } = {}) {
  const approvals = [];

  if ((vendors.vendors || []).length) {
    approvals.push(item("vendor_outreach", `Approve outreach to ${vendors.vendors.length} vendor category/candidate(s).`, { vendors: vendors.vendors }));
  }

  if (pricing.total > 0) {
    approvals.push(item("pricing_review", `Review estimated event total of $${pricing.total}.`, { pricing }));
  }

  if (calendar.calendarDraft?.status === "calendar_draft_prepared") {
    approvals.push(item("calendar_invite", "Approve calendar draft and reminders.", { calendar: calendar.calendarDraft }));
  }

  if (intent.needs?.payments) {
    approvals.push(item("payment", "Approve payment/deposit workflow before any charge.", {}));
  }

  return {
    layer: "event_approval_queue",
    approvals,
    protectedTypes,
    readyCount: approvals.length,
    status: approvals.length ? "approval_queue_prepared" : "no_external_approval_needed"
  };
}

function item(type, label, data) {
  return {
    id: `approval_${type}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    label,
    data,
    status: protectedTypes.includes(type) || type === "pricing_review" ? "needs_approval" : "prepared",
    createdAt: new Date().toISOString()
  };
}
