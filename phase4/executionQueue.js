
import { evaluatePermission, requireConfirmationMessage } from "./permissionEngine";

export function createExecutionQueue({ userPermissions = {} } = {}) {
  const queue = [];

  function add(action) {
    const permission = evaluatePermission({ action, userPermissions });
    const item = {
      id: action.id || `action_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      ...action,
      permission,
      status: permission.granted ? "prepared" : "blocked",
      message: permission.granted ? "Prepared for execution." : requireConfirmationMessage(action),
      createdAt: new Date().toISOString()
    };

    queue.push(item);
    return item;
  }

  function approve(id) {
    const item = queue.find((entry) => entry.id === id);
    if (!item) return null;
    item.permission = { ...item.permission, granted: true, status: "allowed" };
    item.status = "approved";
    item.approvedAt = new Date().toISOString();
    return item;
  }

  function execute(id) {
    const item = queue.find((entry) => entry.id === id);
    if (!item) return null;

    if (!item.permission?.granted) {
      item.status = "blocked";
      item.message = requireConfirmationMessage(item);
      return item;
    }

    item.status = "executed";
    item.executedAt = new Date().toISOString();
    item.message = "Executed safely.";
    return item;
  }

  function list() {
    return [...queue];
  }

  return { add, approve, execute, list };
}

export function buildRecommendedExecutionQueue({ request = "", agents = [], connectors = {}, userPermissions = {} } = {}) {
  const queue = createExecutionQueue({ userPermissions });

  queue.add({
    type: "internal_preparation",
    label: "Create protected outcome plan",
    riskLevel: "low",
    source: "planning_agent",
    data: { request }
  });

  if (connectors.pricing?.requested) {
    queue.add({
      type: "internal_preparation",
      label: "Prepare pricing estimate",
      riskLevel: "low",
      source: "pricing_agent",
      data: connectors.pricing
    });
  }

  if (connectors.vendors?.needed) {
    queue.add({
      type: "external_message",
      label: "Contact vendors",
      riskLevel: "medium",
      source: "vendor_agent",
      external: true,
      data: connectors.vendors
    });
  }

  if (connectors.calendar?.requested) {
    queue.add({
      type: "calendar_invite",
      label: "Prepare calendar hold",
      riskLevel: "medium",
      source: "calendar_agent",
      external: true,
      data: connectors.calendar
    });
  }

  if (connectors.payments?.requested) {
    queue.add({
      type: "payment",
      label: "Prepare payment or deposit",
      riskLevel: "high",
      source: "execution_agent",
      external: true,
      data: connectors.payments
    });
  }

  return queue.list();
}
