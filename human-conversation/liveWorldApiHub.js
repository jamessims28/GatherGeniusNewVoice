
export async function runLiveWorldApiHub({ location = "Virginia", request = "" } = {}) {
  const weather = await getWeather(location);

  return {
    layer: "live_world_api_hub",
    location,
    weather,
    maps: { status: "connector_ready", provider: "future_maps_api" },
    vendors: { status: "connector_ready", provider: "future_vendor_marketplace" },
    calendar: { status: "connector_ready", provider: "future_calendar_api" },
    pricing: inferPricing(request),
    riskLevel: weather.riskLevel === "high" ? "elevated" : "stable"
  };
}

async function getWeather(location) {
  try {
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`, { next: { revalidate: 3600 } }).then((r) => r.json());
    const first = geo?.results?.[0];
    if (!first) throw new Error("location unavailable");

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", first.latitude);
    url.searchParams.set("longitude", first.longitude);
    url.searchParams.set("daily", "precipitation_probability_max,wind_speed_10m_max,temperature_2m_max");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", first.timezone || "auto");

    const data = await fetch(url.toString(), { next: { revalidate: 3600 } }).then((r) => r.json());
    const maxPrecip = Math.max(0, ...(data?.daily?.precipitation_probability_max || []).map(Number));
    const maxWind = Math.max(0, ...(data?.daily?.wind_speed_10m_max || []).map(Number));

    return {
      ok: true,
      provider: "Open-Meteo",
      place: first.name,
      maxPrecip,
      maxWind,
      riskLevel: maxPrecip >= 60 || maxWind >= 25 ? "high" : "low"
    };
  } catch (error) {
    return { ok: false, provider: "Open-Meteo", riskLevel: "unknown", error: error.message };
  }
}

function inferPricing(request) {
  const t = String(request).toLowerCase();
  return {
    requested: /price|cost|budget|quote|estimate/.test(t),
    mode: /premium|luxury|elite/.test(t) ? "premium" : /cheap|budget|save/.test(t) ? "budget" : "balanced"
  };
}
