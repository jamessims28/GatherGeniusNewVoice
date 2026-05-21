
export async function runWorldOperatingLayer({ text = "", location = "Virginia" } = {}) {
  const [weather, localSignals, pricing, logistics] = await Promise.all([
    getWeatherSignal(location),
    getLocalSignal(location),
    inferPricingSignal(text),
    inferLogisticsSignal(text)
  ]);

  const risks = [];
  if (weather.riskLevel === "high") risks.push("weather");
  if (logistics.timelineRisk === "high") risks.push("timeline");
  if (pricing.budgetRisk === "high") risks.push("budget");

  return {
    layer: "world_operating_layer",
    location,
    weather,
    localSignals,
    pricing,
    logistics,
    riskLevel: risks.length >= 2 ? "elevated" : risks.length ? "watch" : "stable",
    risks,
    nextWorldAction:
      risks.includes("weather") ? "prepare_weather_backup" :
      risks.includes("timeline") ? "compress_plan_and_confirm" :
      risks.includes("budget") ? "protect_budget_before_recommending" :
      "continue"
  };
}

async function getWeatherSignal(location) {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl, { next: { revalidate: 3600 } });
    const geo = await geoRes.json();
    const first = geo?.results?.[0];

    if (!first) throw new Error("No location match");

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", first.latitude);
    url.searchParams.set("longitude", first.longitude);
    url.searchParams.set("daily", "precipitation_probability_max,wind_speed_10m_max,temperature_2m_max");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", first.timezone || "auto");

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const data = await res.json();

    const precip = data?.daily?.precipitation_probability_max || [];
    const wind = data?.daily?.wind_speed_10m_max || [];
    const temp = data?.daily?.temperature_2m_max || [];

    const maxPrecip = Math.max(0, ...precip.map(Number));
    const maxWind = Math.max(0, ...wind.map(Number));
    const maxTemp = Math.max(0, ...temp.map(Number));

    const riskLevel = maxPrecip >= 60 || maxWind >= 25 || maxTemp >= 95 ? "high" : maxPrecip >= 35 ? "medium" : "low";

    return {
      ok: true,
      source: "Open-Meteo",
      place: `${first.name}${first.admin1 ? ", " + first.admin1 : ""}`,
      maxPrecip,
      maxWind,
      maxTemp,
      riskLevel
    };
  } catch (error) {
    return { ok: false, source: "Open-Meteo", riskLevel: "unknown", error: error.message };
  }
}

async function getLocalSignal(location) {
  return {
    source: "local_signal_placeholder",
    location,
    traffic: "not_connected",
    venueAvailability: "not_connected",
    providerAvailability: "not_connected",
    note: "Connect maps, providers, calendars, and marketplace APIs here."
  };
}

async function inferPricingSignal(text) {
  const t = String(text).toLowerCase();
  const budgetMatch = String(text).match(/\$?\s?(\d{1,3}(?:,\d{3})+|\d{2,7})(k)?/i);
  let budget = null;
  if (budgetMatch) {
    budget = Number(String(budgetMatch[1]).replace(/,/g, ""));
    if (budgetMatch[2]) budget *= 1000;
  }

  return {
    requested: /price|cost|budget|estimate|quote|how much/.test(t),
    budget,
    mode: /luxury|premium|elite/.test(t) ? "premium" : /cheap|save|budget/.test(t) ? "budget" : "balanced",
    budgetRisk: budget && budget < 1000 ? "high" : "normal"
  };
}

async function inferLogisticsSignal(text) {
  const t = String(text).toLowerCase();
  return {
    urgent: /now|asap|today|tomorrow|soon|quick|fast/.test(t),
    timelineRisk: /now|asap|today|tomorrow/.test(t) ? "high" : "normal",
    needsVendors: /dj|food|catering|venue|hotel|chairs|tables|tent|transport/.test(t)
  };
}
