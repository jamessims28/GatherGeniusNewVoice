# Next Generation Ambient AI Operating Layer

Implemented:
- Orb roams across the full page, including bottom of page, especially while Genius speaks.
- Strong speaking/listening pulse.
- Verbal interaction gated behind readiness checks.
- Checks browser, speech recognition, speech synthesis, microphone API, and microphone permission before starting.
- Polite Genius greeting before interaction.
- No buttons required; click/touch only unlocks browser audio permission where required.
- Ambient operating-state helper for readiness, intent, and next move.

Grounded implementation concepts:
- OpenAI voice agents / Realtime sessions for audio turns, interruptions, tools, and handoffs.
- MDN Web Speech API for browser speech recognition and speech synthesis.
- Supabase RLS model for protected storage if expanded.
- Open-Meteo geocoding/weather pattern already in the app for real-world signals.
