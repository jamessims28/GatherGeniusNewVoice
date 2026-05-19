# Stripe + Supabase Confirmation

This package preserves the existing Stripe and Supabase integration routes.

## Stripe route preserved

`app/api/engine/lock-event/route.js`

Uses:
- `STRIPE_SECRET_KEY`
- Stripe Checkout
- Safe preview mode if key is missing

## Supabase routes preserved

`lib/supabaseAdmin.js`

Uses:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Database writes still target:
- `event_locks`
- `event_executions`
- `user_data_permissions`

## Required Vercel environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

After adding/changing variables, redeploy Vercel.
