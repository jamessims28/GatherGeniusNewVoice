
export async function runToolConnectors({ request = "", location = "Virginia" } = {}) {
  const [weather, pricing, maps, vendors, calendar, payments, database] = await Promise.all([
    weatherConnector(location),
    pricingConnector(request),
    mapsConnector(location),
    vendorConnector(request, location),
    calendarConnector(request),
    paymentConnector(request),
    databaseConnector()
  ]);

  return {
    layer: "phase4_tool_connectors",
    weather,
    pricing,
    maps,
    vendors,
    calendar,
    payments,
    database,
    checkedAt: new Date().toISOString()
  };
}

async function weatherConnector(location) {
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
    const maxTemp = Math.max(0, ...(data?.daily?.temperature_2m_max || []).map(Number));

    return {
      ok: true,
      provider: "Open-Meteo",
      location: first.name,
      maxPrecip,
      maxWind,
      maxTemp,
      risk: maxPrecip >= 60 || maxWind >= 25 || maxTemp >= 95 ? "watch" : "stable"
    };
  } catch (error) {
    return { ok: false, provider: "Open-Meteo", error: error.message };
  }
}

async function pricingConnector(request) {
  const t = String(request).toLowerCase();
  const budgetMatch = String(request).match(/\$?\s?(\d{1,3}(?:,\d{3})+|\d{2,7})(k)?/i);
  let budget = null;

  if (budgetMatch) {
    budget = Number(String(budgetMatch[1]).replace(/,/g, ""));
    if (budgetMatch[2]) budget *= 1000;
  }

  return {
    ok: true,
    provider: "internal_pricing_inference",
    requested: /price|cost|budget|estimate|quote/.test(t),
    budget,
    valueMode: /premium|luxury|elite|exclusive/.test(t) ? "premium" : /cheap|save|budget/.test(t) ? "budget" : "balanced",
    note: "Connect live vendor/provider pricing APIs here."
  };
}

async function mapsConnector(location) {
  return {
    ok: true,
    provider: "maps_connector_placeholder",
    location,
    status: "ready_for_google_maps_or_mapbox",
    note: "Connect geocoding, routing, traffic, and proximity search here."
  };
}

async function vendorConnector(request, location) {
  const needed = /vendor|dj|food|catering|tent|chairs|tables|hotel|venue|provider/.test(String(request).toLowerCase());
  return {
    ok: true,
    provider: "vendor_connector_placeholder",
    needed,
    location,
    categories: extractVendorCategories(request),
    status: "ready_for_marketplace_or_search_api"
  };
}

function extractVendorCategories(request) {
  const t = String(request).toLowerCase();
  return [
    /dj|music/.test(t) ? "dj" : null,
    /food|catering|chef/.test(t) ? "catering" : null,
    /tent/.test(t) ? "tent" : null,
    /chairs|tables/.test(t) ? "tables_chairs" : null,
    /hotel/.test(t) ? "hotel" : null,
    /venue/.test(t) ? "venue" : null
  ].filter(Boolean);
}

async function calendarConnector(request) {
  return {
    ok: true,
    provider: "calendar_connector_placeholder",
    requested: /calendar|schedule|date|remind|time/.test(String(request).toLowerCase()),
    status: "ready_for_google_calendar"
  };
}

async function paymentConnector(request) {
  return {
    ok: true,
    provider: "stripe_connector_placeholder",
    requested: /pay|payment|deposit|checkout|stripe|invoice/.test(String(request).toLowerCase()),
    status: "prepare_only_until_confirmed"
  };
}

async function databaseConnector() {
  return {
    ok: true,
    provider: "supabase",
    status: "ready",
    note: "Supabase persistence and RLS grants included in docs/database.sql"
  };
}
