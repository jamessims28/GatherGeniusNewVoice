
import { geocodeLocation } from "./locationSignals";
import { getWeatherRisk } from "./weatherSignals";
import { getLivePricing } from "../pricing/livePricingEngine";

export async function gatherRealWorldSignals({ request = "", location = "Virginia", category = "general" } = {}) {
  const geo = await geocodeLocation(location);
  const weather = await getWeatherRisk({
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: geo.timezone || "auto"
  });

  const pricing = await getLivePricing(request).catch((error) => ({
    ok: false,
    pricing: { mode: "unavailable", note: error.message },
    providers: []
  }));

  return {
    ok: true,
    request,
    location,
    category,
    gatheredAt: new Date().toISOString(),
    signals: {
      location: geo,
      weather,
      pricing
    },
    sourceList: [
      geo.source,
      weather.source,
      pricing?.pricing?.source || "Pricing Engine"
    ],
    constraints: buildConstraints({ weather, pricing }),
    nextRealWorldMove: buildNextMove({ weather, pricing })
  };
}

function buildConstraints({ weather, pricing }) {
  const constraints = [];

  if (weather?.riskLevel === "high") constraints.push("Prepare indoor/backup weather path.");
  if (weather?.riskLevel === "medium") constraints.push("Monitor weather before lock.");
  if (pricing?.pricing?.mode === "fallback-estimate") constraints.push("Confirm provider quote before charging final price.");
  if (!pricing?.providers?.length) constraints.push("Provider availability needs confirmation.");

  return constraints;
}

function buildNextMove({ weather, pricing }) {
  if (weather?.riskLevel === "high") return "protect outcome with backup location or indoor option";
  if (pricing?.pricing?.mode === "fallback-estimate") return "confirm live provider pricing";
  return "proceed with protected recommendation";
}
