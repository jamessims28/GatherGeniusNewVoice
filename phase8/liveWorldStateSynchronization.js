
export async function runLiveWorldStateSynchronization({ location = "Virginia", request = "" } = {}) {
  const weather = await openMeteo(location);
  return {
    layer: "live_world_state_synchronization",
    location,
    weather,
    traffic: { provider: "maps_placeholder", status: "connector_ready" },
    pricing: inferPricing(request),
    events: { provider: "events_placeholder", status: "connector_ready" },
    venues: { provider: "venues_placeholder", status: "connector_ready" },
    calendars: { provider: "calendar_placeholder", status: "connector_ready" },
    emergencies: { provider: "emergency_alerts_placeholder", status: "connector_ready" },
    socialActivity: { provider: "consent_based_social_placeholder", status: "connector_ready" },
    localConditions: { provider: "local_conditions_placeholder", status: "connector_ready" },
    riskLevel: weather.risk === "watch" ? "elevated" : "stable",
    syncedAt: new Date().toISOString()
  };
}

async function openMeteo(location) {
  try {
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`, { next: { revalidate: 3600 } }).then(r => r.json());
    const first = geo?.results?.[0];
    if (!first) throw new Error("location unavailable");
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", first.latitude);
    url.searchParams.set("longitude", first.longitude);
    url.searchParams.set("daily", "precipitation_probability_max,wind_speed_10m_max,temperature_2m_max");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", first.timezone || "auto");
    const data = await fetch(url.toString(), { next: { revalidate: 3600 } }).then(r => r.json());
    const maxPrecip = Math.max(0, ...(data?.daily?.precipitation_probability_max || []).map(Number));
    const maxWind = Math.max(0, ...(data?.daily?.wind_speed_10m_max || []).map(Number));
    return { ok: true, provider: "Open-Meteo", place: first.name, maxPrecip, maxWind, risk: maxPrecip >= 60 || maxWind >= 25 ? "watch" : "stable" };
  } catch (error) {
    return { ok: false, provider: "Open-Meteo", risk: "unknown", error: error.message };
  }
}

function inferPricing(request) {
  const t = String(request).toLowerCase();
  return { requested: /price|cost|budget|quote|estimate|payment/.test(t), mode: /premium|luxury|elite/.test(t) ? "premium" : /budget|save|cheap/.test(t) ? "budget" : "balanced" };
}
