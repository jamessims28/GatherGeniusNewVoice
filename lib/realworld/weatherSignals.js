
export async function getWeatherRisk({ latitude, longitude, timezone = "auto" } = {}) {
  if (!latitude || !longitude) {
    return {
      ok: false,
      source: "Open-Meteo Forecast",
      riskLevel: "unknown",
      message: "Weather risk unavailable because location coordinates are missing."
    };
  }

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("daily", "precipitation_sum,precipitation_probability_max,wind_speed_10m_max,temperature_2m_max,temperature_2m_min");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", timezone || "auto");

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const data = await response.json();

    const precip = data?.daily?.precipitation_probability_max || [];
    const wind = data?.daily?.wind_speed_10m_max || [];
    const tempsHigh = data?.daily?.temperature_2m_max || [];

    const maxPrecip = Math.max(0, ...precip.map(Number));
    const maxWind = Math.max(0, ...wind.map(Number));
    const maxTemp = Math.max(0, ...tempsHigh.map(Number));

    const risks = [];
    if (maxPrecip >= 60) risks.push("rain_probability");
    if (maxWind >= 25) risks.push("high_wind");
    if (maxTemp >= 95) risks.push("heat_risk");

    const riskLevel = risks.length >= 2 ? "high" : risks.length ? "medium" : "low";

    return {
      ok: true,
      source: "Open-Meteo Forecast",
      riskLevel,
      risks,
      maxPrecipitationProbability: maxPrecip,
      maxWindSpeed: maxWind,
      maxTemperature: maxTemp,
      forecast: data?.daily || {},
      message:
        riskLevel === "high"
          ? "Weather could affect the outcome. Backup or indoor options should be prepared."
          : riskLevel === "medium"
          ? "Weather has some risk. Genius should monitor and prepare alternatives."
          : "Weather risk looks low for the next forecast window."
    };
  } catch (error) {
    return {
      ok: false,
      source: "Open-Meteo Forecast",
      riskLevel: "unknown",
      message: error.message
    };
  }
}
