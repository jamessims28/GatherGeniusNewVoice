# Phase 6 — Production Autonomy + Real Integrations

Built GatherGenius Production Autonomy Core.

## What was added

### User Identity
- `lib/phase6/userIdentity.js`
- Stores/updates user profile in Supabase when configured.

### Persistent Memory
- `lib/phase6/persistentMemoryStore.js`
- Loads, updates, and saves long-term user memory.

### Integration Registry
- `lib/phase6/integrationRegistry.js`
- Checks Stripe, Supabase, OpenAI Realtime, Maps, Calendar, Email, Weather.

### Approval Workflow
- `lib/phase6/approvalWorkflow.js`
- Blocks payments, bookings, external messages, contracts, calendar invites, personal data access, and sensitive database writes until approval.

### Production Execution Engine
- `lib/phase6/productionExecutionEngine.js`
- Prepares safe internal actions and queues restricted actions for approval.

### Observability
- `lib/phase6/observability.js`
- Logs events, duration, and performance grade.

### Production Autonomy Orchestrator
- `lib/phase6/productionAutonomyCore.js`

## API Routes

- `POST /api/phase6/run`
- `POST /api/phase6/approve`
- `GET /api/phase6/integrations`

## Admin Dashboard

- `/phase6`

## Environment Variables

See `.env.example`.

## Deployment Checklist

1. Add Supabase URL, anon key, and service role key.
2. Run `docs/database.sql` in Supabase SQL editor.
3. Add OpenAI key for realtime/AI routes.
4. Add Stripe keys if payments are enabled.
5. Add Google Maps key for maps/places.
6. Add Google Calendar OAuth credentials for calendar execution.
7. Add email provider key for external messages.
8. Deploy to Vercel over HTTPS.
9. Test `/api/phase6/integrations`.
10. Test `/phase6` dashboard.
