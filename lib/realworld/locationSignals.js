
export async function geocodeLocation(location = "Virginia") {
  const query = encodeURIComponent(location || "Virginia");

  try {
    const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`;
    const response = await fetch(openMeteoUrl, { next: { revalidate: 3600 } });
    const data = await response.json();
    const first = data?.results?.[0];

    if (first) {
      return {
        ok: true,
        source: "Open-Meteo Geocoding",
        name: first.name,
        admin1: first.admin1,
        country: first.country,
        latitude: first.latitude,
        longitude: first.longitude,
        timezone: first.timezone
      };
    }
  } catch {}

  return {
    ok: false,
    source: "Open-Meteo Geocoding",
    name: location,
    latitude: null,
    longitude: null,
    timezone: "auto",
    message: "Location could not be geocoded."
  };
}
