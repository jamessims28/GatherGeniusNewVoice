
export async function runWorldSignalEngine({ text = "", location = "Virginia" } = {}) {
  const geo = await geocode(location);
  const weather = await getWeather(geo);
  const pricingSignal = inferPricingSignal(text);

  return {
    layer: "world_signal_engine",
    location: geo,
    weather,
    pricingSignal,
    riskLevel: weather.riskLevel === "high" ? "elevated" : weather.riskLevel === "medium" ? "watch" : "stable",
    checkedAt: new Date().toISOString()
  };
}

async function geocode(location) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    const first = data?.results?.[0];
    if (!first) throw new Error("No geocode result");
    return {
      ok: true,
      source: "Open-Meteo Geocoding",
      name: first.name,
      region: first.admin1,
      country: first.country,
      latitude: first.latitude,
      longitude: first.longitude,
      timezone: first.timezone || "auto"
    };
  } catch {
    return { ok: false, source: "Open-Meteo Geocoding", name: location, timezone: "auto" };
  }
}

async function getWeather(geo) {
  if (!geo?.latitude || !geo?.longitude) {
    return { ok: false, source: "Open-Meteo Forecast", riskLevel: "unknown", risks: ["location_unavailable"] };
  }

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", geo.latitude);
    url.searchParams.set("longitude", geo.longitude);
    url.searchParams.set("daily", "precipitation_probability_max,wind_speed_10m_max,temperature_2m_max");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", geo.timezone || "auto");

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const data = await res.json();
    const precip = data?.daily?.precipitation_probability_max || [];
    const wind = data?.daily?.wind_speed_10m_max || [];
    const temp = data?.daily?.temperature_2m_max || [];

    const maxPrecip = Math.max(0, ...precip.map(Number));
    const maxWind = Math.max(0, ...wind.map(Number));
    const maxTemp = Math.max(0, ...temp.map(Number));

    const risks = [];
    if (maxPrecip >= 60) risks.push("rain_probability");
    if (maxWind >= 25) risks.push("high_wind");
    if (maxTemp >= 95) risks.push("heat_risk");

    return {
      ok: true,
      source: "Open-Meteo Forecast",
      riskLevel: risks.length >= 2 ? "high" : risks.length ? "medium" : "low",
      risks,
      maxPrecip,
      maxWind,
      maxTemp
    };
  } catch (error) {
    return { ok: false, source: "Open-Meteo Forecast", riskLevel: "unknown", risks: [error.message] };
  }
}

function inferPricingSignal(text) {
  const t = String(text).toLowerCase();
  return {
    requested: /price|cost|budget|estimate|how much/.test(t),
    mode: /luxury|premium|elite/.test(t) ? "premium" : /budget|cheap|save/.test(t) ? "budget" : "balanced"
  };
}
