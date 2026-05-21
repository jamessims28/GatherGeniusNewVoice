# GatherGenius AI Event Operating System V1

This is the production-focused product wedge.

## What changed

GatherGenius is now focused on one real use case:

**AI-powered event orchestration.**

The landing page remains minimal:
- moving orb
- GatherGenius brand
- simple response
- no technical dashboards
- all event intelligence runs in the background

## Core event workflow

1. Event intent understanding
2. Event blueprint creation
3. Vendor candidate preparation
4. Event price estimation
5. Calendar draft preparation
6. Approval queue
7. Persistent event memory

## Modules

- `lib/event-os/eventIntentEngine.js`
- `lib/event-os/eventBlueprintEngine.js`
- `lib/event-os/vendorMatcher.js`
- `lib/event-os/eventPricingEngine.js`
- `lib/event-os/calendarPrepEngine.js`
- `lib/event-os/eventApprovalQueue.js`
- `lib/event-os/eventMemoryEngine.js`
- `lib/event-os/aiEventOperatingSystem.js`

## API

- `POST /api/event-os/run`

## Admin/product route

- `/event-os`

## Database

Run `docs/database.sql` in Supabase.

## Safety

No vendor outreach, booking, calendar invite, or payment is automatically executed. Everything external is prepared for approval first.
