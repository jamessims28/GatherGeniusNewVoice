export function selectAmbientSurface({ device = "web", voice = true } = {}) {
  const surface =
    device.includes("car") ? "vehicle" :
    device.includes("watch") ? "wearable" :
    device.includes("mobile") ? "mobile" :
    voice ? "voice-web" :
    "web";

  return {
    layer: "spatial_ambient",
    surface,
    sparkMode: surface === "voice-web" ? "large ambient spark" : "compact spark",
    message: "Ambient surface selected. GatherGenius can adapt beyond a standard screen."
  };
}
