
export async function runRealityStateEngine({ request = "", location = "Virginia", userState = {}, memory = {} } = {}) {
  const weather = await getWeather(location);
  const timing = inferTiming(request);
  const finance = inferFinance(request);
  const logistics = inferLogistics(request);
  const human = inferHumanState(request, userState);

  const worldState = {
    weather,
    timing,
    finance,
    logistics,
    human,
    memory,
    location,
    updatedAt: new Date().toISOString()
  };

  return {
    layer: "reality_state_engine",
    worldState,
    riskMatrix: calculateRisk(worldState)
  };
}

async function getWeather(location) {
  try {
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`, { next: { revalidate: 3600 } }).then(r => r.json());
    const first = geo?.results?.[0];
    if (!first) throw new Error("Location unavailable");

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", first.latitude);
    url.searchParams.set("longitude", first.longitude);
    url.searchParams.set("daily", "precipitation_probability_max,wind_speed_10m_max,temperature_2m_max");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", first.timezone || "auto");

    const data = await fetch(url.toString(), { next: { revalidate: 3600 } }).then(r => r.json());
    const maxPrecip = Math.max(0, ...(data?.daily?.precipitation_probability_max || []).map(Number));
    const maxWind = Math.max(0, ...(data?.daily?.wind_speed_10m_max || []).map(Number));
    const maxTemp = Math.max(0, ...(data?.daily?.temperature_2m_max || []).map(Number));

    return {
      ok: true,
      provider: "Open-Meteo",
      place: first.name,
      maxPrecip,
      maxWind,
      maxTemp,
      risk: maxPrecip >= 60 || maxWind >= 25 || maxTemp >= 95 ? "watch" : "stable"
    };
  } catch (error) {
    return { ok: false, provider: "Open-Meteo", risk: "unknown", error: error.message };
  }
}

function inferTiming(request) {
  const t = String(request).toLowerCase();
  return {
    urgent: /now|asap|today|tomorrow|soon|quick|fast/.test(t),
    dateSpecific: /\d{1,2}\/\d{1,2}|january|february|march|april|may|june|july|august|september|october|november|december/.test(t)
  };
}

function inferFinance(request) {
  const t = String(request).toLowerCase();
  const budgetMatch = String(request).match(/\$?\s?(\d{1,3}(?:,\d{3})+|\d{2,7})(k)?/i);
  let budget = null;
  if (budgetMatch) {
    budget = Number(String(budgetMatch[1]).replace(/,/g, ""));
    if (budgetMatch[2]) budget *= 1000;
  }
  return {
    budget,
    pricingRequested: /price|cost|budget|estimate|quote/.test(t),
    spendingMode: /premium|luxury|elite/.test(t) ? "premium" : /cheap|budget|save/.test(t) ? "protect_budget" : "balanced"
  };
}

function inferLogistics(request) {
  const t = String(request).toLowerCase();
  return {
    vendorNeeded: /vendor|dj|food|catering|tent|chairs|tables|hotel|venue|provider/.test(t),
    travelNeeded: /traffic|route|drive|transport|hotel|near/.test(t),
    scheduleNeeded: /calendar|schedule|date|remind|time/.test(t)
  };
}

function inferHumanState(request, userState = {}) {
  const t = String(request).toLowerCase();
  return {
    stress: /stress|worried|overwhelmed|confused|anxious/.test(t) ? 0.82 : userState.stress || 0.22,
    excitement: /excited|amazing|love|beautiful|great|perfect/.test(t) ? 0.8 : userState.excitement || 0.25,
    trustNeed: /proof|verify|safe|secure|trusted/.test(t) ? "proof_first" : userState.trustNeed || "balanced"
  };
}

function calculateRisk(worldState) {
  return {
    weatherRisk: worldState.weather?.risk === "watch",
    timingRisk: Boolean(worldState.timing?.urgent),
    financialRisk: Boolean(worldState.finance?.budget && worldState.finance.budget < 1000),
    logisticsRisk: Boolean(worldState.logistics?.vendorNeeded && worldState.timing?.urgent),
    emotionalRisk: Number(worldState.human?.stress || 0) > 0.7
  };
}
