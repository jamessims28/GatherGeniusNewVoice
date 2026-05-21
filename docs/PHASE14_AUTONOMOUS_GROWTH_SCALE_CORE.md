# Phase 14 — Autonomous Growth & Scale Intelligence Core

Built the next background phase for GatherGenius.

## Added

- Moving landing-page orb that travels across the entire viewport.
- Background growth signal engine.
- Acquisition strategy engine.
- Retention optimization engine.
- Scale-readiness engine.
- Growth/scale orchestrator.
- Phase 14 API route.
- Phase 14 admin dashboard.

## Files

- `lib/phase14/growthSignalEngine.js`
- `lib/phase14/acquisitionStrategyEngine.js`
- `lib/phase14/retentionOptimizationEngine.js`
- `lib/phase14/scaleReadinessEngine.js`
- `lib/phase14/autonomousGrowthScaleCore.js`
- `app/api/phase14/run/route.js`
- `components/Phase14GrowthScaleDashboard.jsx`
- `app/phase14/page.js`

## Landing Page

The main `app/page.js` now keeps all intelligence in the background while the orb moves around the landing page.

## Safety

Growth and scale recommendations are in review mode by default:
- `GROWTH_INTELLIGENCE_MODE=shadow`
- `SCALE_RECOMMENDATIONS_REQUIRE_REVIEW=true`

GatherGenius prepares growth strategies but does not run campaigns, charge users, contact vendors, or change pricing without review.
