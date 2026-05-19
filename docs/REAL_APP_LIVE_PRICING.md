# GeniusGather Real App + Live Pricing

## Added

- `POST /api/pricing/live`
- `components/LivePricingPanel.jsx`
- `/pricing` page
- live pricing provider architecture
- SerpAPI connector
- Google Places connector
- fallback pricing model
- Supabase `pricing_requests` history table

## Important

True live pricing needs API keys.

Add these in Vercel:

```env
LIVE_PRICING_ENABLED=true
SERPAPI_API_KEY=
GOOGLE_PLACES_API_KEY=
PRICING_REGION_DEFAULT=Virginia
```

## Behavior

If keys exist:
- live search pricing attempts to find real price signals
- provider/location signals from Google Places can appear

If keys are missing:
- GeniusGather uses a safe baseline estimate
- result clearly says `fallback-estimate`

## Example prompts

- Price catering for 120 guests in Virginia
- Find tent rental pricing near Stafford VA
- Price a DJ for a wedding in Fredericksburg
- Estimate hotel rooms near Richmond for 30 guests
