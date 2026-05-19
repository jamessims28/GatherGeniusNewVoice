# AI Experience Operating Layer

This build evolves Genius toward real-world outcome coordination.

## Public data sources wired

- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- existing live pricing engine
- existing human intelligence core

## Code added

- `lib/realworld/locationSignals.js`
- `lib/realworld/weatherSignals.js`
- `lib/realworld/realWorldSignalEngine.js`
- `lib/operating-layer/experienceOperatingLayer.js`
- `app/api/operating-layer/run/route.js`
- `components/ExperienceOperatingLayerPanel.jsx`
- `app/operating-layer/page.js`

## What it does

1. Understands human intent.
2. Geocodes the location.
3. Pulls forecast/weather risk.
4. Pulls pricing/provider intelligence when available.
5. Runs human intelligence core.
6. Builds an operational plan.
7. Decides whether Genius can proceed or should request confirmation.
8. Stores the run in Supabase.

## Sources

- Open-Meteo forecast/geocoding APIs
- Supabase RLS/grants security model
