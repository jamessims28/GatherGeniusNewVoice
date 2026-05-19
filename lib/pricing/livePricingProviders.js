
export async function searchWithSerpApi({ query, location }) {
  if (!process.env.SERPAPI_API_KEY) return null;

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", `${query} price cost ${location}`);
  url.searchParams.set("api_key", process.env.SERPAPI_API_KEY);

  const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!response.ok) return null;

  const data = await response.json();
  const results = [...(data.shopping_results || []), ...(data.organic_results || [])].slice(0, 10);
  const prices = [];
  const sources = [];

  for (const item of results) {
    const text = `${item.title || ""} ${item.snippet || ""} ${item.price || ""}`;
    const matches = [...text.matchAll(/\$\s?(\d{1,3}(?:,\d{3})+|\d{2,7})(?:\.\d{2})?/g)];
    for (const match of matches) {
      const value = Number(String(match[1]).replace(/,/g, ""));
      if (value > 0) prices.push(value);
    }
    if (item.link) sources.push({ title: item.title || "Pricing source", link: item.link });
  }

  if (!prices.length) return { mode: "live-search-no-price", prices: [], sources };

  prices.sort((a, b) => a - b);
  return {
    mode: "live-search",
    source: "SerpAPI live search",
    low: prices[0],
    mid: prices[Math.floor(prices.length / 2)],
    high: prices[prices.length - 1],
    prices,
    sources: sources.slice(0, 5),
    confidence: prices.length >= 3 ? "medium-live" : "low-live"
  };
}

export async function searchGooglePlaces({ query, location }) {
  if (!process.env.GOOGLE_PLACES_API_KEY) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  url.searchParams.set("query", `${query} ${location}`);
  url.searchParams.set("key", process.env.GOOGLE_PLACES_API_KEY);

  const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!response.ok) return null;

  const data = await response.json();
  const places = (data.results || []).slice(0, 10).map((place) => ({
    name: place.name,
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
    priceLevel: place.price_level,
    address: place.formatted_address
  }));

  return { mode: "live-places", source: "Google Places", places, confidence: places.length ? "provider-live" : "none" };
}
