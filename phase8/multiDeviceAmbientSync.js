
export function runMultiDeviceAmbientSync({ userKey = "anonymous_preview", devices = [] } = {}) {
  const defaultDevices = ["desktop", "phone", "tablet", "earbuds", "car", "smart_display"];
  const active = devices.length ? devices : defaultDevices.map(name => ({ name, status: name === "desktop" ? "active" : "ready" }));

  return {
    layer: "multi_device_ambient_sync",
    userKey,
    enabled: process.env.MULTI_DEVICE_SYNC_ENABLED !== "false",
    devices: active,
    handoffMode: "continue_context_across_devices",
    privacy: "device sync requires user authorization"
  };
}
