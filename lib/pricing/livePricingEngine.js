
import { parsePricingRequest } from "./pricingIntent";
import { buildFallbackPricing } from "./pricingFallbacks";
import { searchGooglePlaces, searchWithSerpApi } from "./livePricingProviders";

export async function getLivePricing(input = "") {
  const intent = parsePricingRequest(input);

  const [searchPricing, places] = await Promise.all([
    searchWithSerpApi(intent).catch(() => null),
    searchGooglePlaces(intent).catch(() => null)
  ]);

  const fallback = buildFallbackPricing(intent);

  const pricing = searchPricing?.prices?.length
    ? {
        ...fallback,
        mode: "live-pricing",
        source: searchPricing.source,
        low: searchPricing.low,
        mid: searchPricing.mid,
        high: searchPricing.high,
        confidence: searchPricing.confidence,
        sources: searchPricing.sources,
        note: "Live search pricing was found. Confirm with provider before charging customer."
      }
    : fallback;

  return {
    ok: true,
    intent,
    pricing,
    providers: places?.places || [],
    liveSignals: {
      search: searchPricing?.mode || "not-configured-or-no-results",
      places: places?.mode || "not-configured-or-no-results"
    },
    nextBestAction: pricing.mode === "live-pricing" ? "confirm provider availability and lock estimate" : "connect live pricing APIs or confirm provider quote"
  };
}
