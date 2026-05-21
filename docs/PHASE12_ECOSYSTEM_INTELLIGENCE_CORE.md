# Phase 12 — Predictive Market & Ecosystem Intelligence Core

Built the next background phase for GatherGenius.

## Purpose

Phase 12 extends GatherGenius from orchestration intelligence into ecosystem intelligence:
- market signal awareness
- ecosystem routing
- opportunity discovery
- revenue optimization
- marketplace readiness
- subscription and vendor monetization signals

## Background modules

- `lib/phase12/marketSignalEngine.js`
- `lib/phase12/ecosystemRoutingEngine.js`
- `lib/phase12/opportunityDiscoveryEngine.js`
- `lib/phase12/revenueOptimizationEngine.js`
- `lib/phase12/ecosystemIntelligenceCore.js`

## API

- `POST /api/phase12/run`

## Admin route

- `/phase12`

## Safety

Revenue and opportunity recommendations remain in review mode by default:
- `REVENUE_OPTIMIZATION_REQUIRES_REVIEW=true`
- `MARKET_INTELLIGENCE_MODE=shadow`

This means GatherGenius prepares recommendations but does not automatically change pricing, charge users, contact vendors, or alter business strategy without review.
