
export const protectedActionTypes = [
  "payment",
  "booking",
  "external_message",
  "contract",
  "calendar_invite",
  "database_write_sensitive",
  "personal_data_access"
];

export function evaluatePermission({ action = {}, userPermissions = {} } = {}) {
  const type = action.type || "internal_preparation";
  const requiresPermission =
    protectedActionTypes.includes(type) ||
    Boolean(action.external) ||
    Boolean(action.requiresConfirmation);

  const granted =
    !requiresPermission ||
    Boolean(userPermissions[type]) ||
    Boolean(action.permissionGranted);

  return {
    layer: "phase4_permission_engine",
    actionType: type,
    requiresPermission,
    granted,
    status: granted ? "allowed" : "needs_confirmation",
    message: granted
      ? "Action is allowed."
      : `Permission required before ${type.replaceAll("_", " ")}.`
  };
}

export function requireConfirmationMessage(action = {}) {
  const label = action.label || action.type || "this action";
  return `I prepared ${label}, but I need your confirmation before I execute it.`;
}
