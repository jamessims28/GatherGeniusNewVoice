
export function evaluatePermissionSafeAutonomy({ proposedActions = [], permissions = {} } = {}) {
  return proposedActions.map((action) => {
    const allowed =
      !action.requiresPermission ||
      permissions[action.id] ||
      permissions[action.permissionKey] ||
      false;

    return {
      ...action,
      allowed,
      decision: allowed ? "can_prepare_or_execute" : "ask_permission_first",
      safeMessage: allowed
        ? `${action.label} is allowed within current permissions.`
        : `I need permission before I ${action.label.toLowerCase()}.`
    };
  });
}

export function summarizePermissionBoundary(decisions = []) {
  const blocked = decisions.filter((item) => !item.allowed);
  return {
    layer: "permission_based_invisible_assistance",
    allSafe: blocked.length === 0,
    blocked,
    message: blocked.length
      ? "Some helpful actions need permission before Genius can continue."
      : "All proposed autonomous actions are within approved boundaries."
  };
}
