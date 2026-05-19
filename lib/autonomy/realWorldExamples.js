
export const realWorldExamples = [
  {
    id: "voice_agent_realtime",
    source: "OpenAI Realtime",
    lesson: "Voice agents should support low-latency conversation, tool use, interruption, translation, and session memory.",
    implementedAs: ["RealtimeVoiceAgent", "toolActionRouter", "voiceOutcomePipeline"]
  },
  {
    id: "weather_risk",
    source: "Open-Meteo Forecast",
    lesson: "Real-world outcome systems should check weather and environmental risk before committing plans.",
    implementedAs: ["worldStateEngine.weather", "proactiveRiskWatcher"]
  },
  {
    id: "location_geocoding",
    source: "Open-Meteo Geocoding + OpenStreetMap/Nominatim pattern",
    lesson: "Natural locations must be converted into coordinates and operational regions.",
    implementedAs: ["worldStateEngine.location", "operationalMap"]
  },
  {
    id: "database_protection",
    source: "Supabase RLS + grants",
    lesson: "Autonomous systems must store memory, permissions, and runs with role-based database controls.",
    implementedAs: ["autonomy_runs", "autonomy_memory", "permissionBoundaries"]
  },
  {
    id: "marketplace_operations",
    source: "Logistics/provider marketplace pattern",
    lesson: "Execution requires provider confidence, backup paths, response SLAs, and replacement options.",
    implementedAs: ["providerSLAAgent", "backupCoordinator", "outcomeProtection"]
  }
];
