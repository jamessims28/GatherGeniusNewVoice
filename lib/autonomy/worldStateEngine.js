
export async function geocodeWithOpenMeteo(location = "Virginia") {
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
  } catch (error) {
    return { ok: false, source: "Open-Meteo Geocoding", location, error: error.message };
  }
}

export async function geocodeWithNominatimFallback(location = "Virginia") {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "GatherGenius/1.0 contact@example.com" },
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const first = data?.[0];
    if (!first) throw new Error("No fallback geocode result");
    return {
      ok: true,
      source: "OpenStreetMap Nominatim",
      name: first.display_name,
      latitude: Number(first.lat),
      longitude: Number(first.lon),
      timezone: "auto"
    };
  } catch (error) {
    return { ok: false, source: "OpenStreetMap Nominatim", location, error: error.message };
  }
}

export async function getWeatherWorldState({ latitude, longitude, timezone = "auto" } = {}) {
  if (!latitude || !longitude) {
    return { ok: false, riskLevel: "unknown", risks: [], message: "Coordinates unavailable." };
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("daily", "precipitation_probability_max,wind_speed_10m_max,temperature_2m_max");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", timezone || "auto");

  try {
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
      maxTemp,
      forecast: data?.daily || {}
    };
  } catch (error) {
    return { ok: false, source: "Open-Meteo Forecast", riskLevel: "unknown", risks: [], error: error.message };
  }
}

export async function mapContinuousReality({ location = "Virginia" } = {}) {
  const primaryGeo = await geocodeWithOpenMeteo(location);
  const geo = primaryGeo.ok ? primaryGeo : await geocodeWithNominatimFallback(location);
  const weather = await getWeatherWorldState({
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: geo.timezone
  });

  return {
    layer: "continuous_reality_mapping",
    location: geo,
    weather,
    mappedAt: new Date().toISOString(),
    worldRisk: weather.riskLevel === "high" ? "elevated" : weather.riskLevel === "medium" ? "watch" : "stable"
  };
}
