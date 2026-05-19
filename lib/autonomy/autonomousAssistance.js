
export function planAutonomousAssistance({ ambient, worldState, humanTwin, permissions = {} } = {}) {
  const actions = [];

  if (worldState?.weather?.riskLevel === "high") {
    actions.push({
      id: "weather_backup_hold",
      type: "prepare",
      requiresPermission: false,
      label: "Prepare indoor/weather backup path",
      reason: "Weather risk is elevated."
    });
  }

  if (humanTwin?.model?.timingBehavior === "urgent") {
    actions.push({
      id: "fast_track_execution",
      type: "prepare",
      requiresPermission: false,
      label: "Fast-track provider and pricing checks",
      reason: "User timing behavior appears urgent."
    });
  }

  if (humanTwin?.model?.trustPreference === "proof-first") {
    actions.push({
      id: "proof_pack",
      type: "prepare",
      requiresPermission: false,
      label: "Prepare confidence proof pack",
      reason: "User appears to prefer proof before trusting recommendations."
    });
  }

  if (permissions?.calendar) {
    actions.push({
      id: "calendar_precheck",
      type: "execute",
      requiresPermission: true,
      label: "Pre-check availability windows",
      reason: "Calendar permission is approved."
    });
  }

  return {
    layer: "autonomous_assistance",
    actions,
    proactiveAllowed: true,
    canActWithoutAsking: actions.every((action) => !action.requiresPermission || permissions[action.id]),
    message: actions.length
      ? "Genius prepared helpful actions before being asked."
      : "No autonomous intervention needed right now."
  };
}
