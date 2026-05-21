
export function getIntegrationRegistry() {
  return {
    stripe: {
      configured: Boolean(process.env.STRIPE_SECRET_KEY),
      status: process.env.STRIPE_SECRET_KEY ? "ready" : "missing_env",
      actions: ["checkout_session", "payment_intent", "webhook"]
    },
    supabase: {
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "ready" : "missing_env",
      actions: ["memory", "logs", "approval_queue", "user_profiles"]
    },
    openaiRealtime: {
      configured: Boolean(process.env.OPENAI_API_KEY),
      status: process.env.OPENAI_API_KEY ? "ready" : "missing_env",
      actions: ["realtime_voice", "streaming_tokens"]
    },
    maps: {
      configured: Boolean(process.env.GOOGLE_MAPS_API_KEY),
      status: process.env.GOOGLE_MAPS_API_KEY ? "ready" : "placeholder",
      actions: ["geocoding", "routing", "traffic", "places"]
    },
    calendar: {
      configured: Boolean(process.env.GOOGLE_CALENDAR_CLIENT_ID && process.env.GOOGLE_CALENDAR_CLIENT_SECRET),
      status: process.env.GOOGLE_CALENDAR_CLIENT_ID ? "ready" : "placeholder",
      actions: ["availability", "calendar_hold", "invites"]
    },
    email: {
      configured: Boolean(process.env.EMAIL_PROVIDER_API_KEY),
      status: process.env.EMAIL_PROVIDER_API_KEY ? "ready" : "placeholder",
      actions: ["draft_email", "send_with_confirmation"]
    },
    weather: {
      configured: true,
      status: "ready",
      actions: ["open_meteo_forecast"]
    }
  };
}

export function summarizeIntegrations(registry = getIntegrationRegistry()) {
  const values = Object.entries(registry);
  return {
    ready: values.filter(([, item]) => item.status === "ready").map(([key]) => key),
    missing: values.filter(([, item]) => item.status === "missing_env").map(([key]) => key),
    placeholders: values.filter(([, item]) => item.status === "placeholder").map(([key]) => key)
  };
}
