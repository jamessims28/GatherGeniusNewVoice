
export async function runOperatingWorldSignalEngine({ text = "", location = "Virginia" } = {}) {
  const geo = await geocode(location);
  const weather = await getWeather(geo);
  const timing = inferTiming(text);
  const pricingSignal = inferPricingSignal(text);

  return {
    layer: "operating_world_signal_engine",
    location: geo,
    weather,
    timing,
    pricingSignal,
    riskLevel: computeWorldRisk({ weather, timing, pricingSignal }),
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

function inferTiming(text) {
  const t = String(text).toLowerCase();
  return {
    urgent: /now|asap|urgent|today|tomorrow|soon|quick|fast/.test(t),
    dateSpecific: /\d{1,2}\/\d{1,2}|january|february|march|april|may|june|july|august|september|october|november|december/.test(t)
  };
}

function inferPricingSignal(text) {
  const t = String(text).toLowerCase();
  return {
    requested: /price|cost|budget|estimate|how much|quote/.test(t),
    mode: /luxury|premium|elite/.test(t) ? "premium" : /budget|cheap|save/.test(t) ? "budget" : "balanced"
  };
}

function computeWorldRisk({ weather, timing, pricingSignal }) {
  let score = 0;
  if (weather?.riskLevel === "high") score += 3;
  if (weather?.riskLevel === "medium") score += 1;
  if (timing?.urgent) score += 1;
  if (pricingSignal?.requested && pricingSignal?.mode === "budget") score += 1;
  return score >= 3 ? "elevated" : score >= 1 ? "watch" : "stable";
}
