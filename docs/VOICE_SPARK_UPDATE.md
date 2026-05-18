# Voice Spark Update

GatherGenius now includes a light-spark speaking identity.

Added:
- `components/SpeakingSpark.jsx`
- `/voice` preview page
- Spark glow/pulse when speaking
- Waveform animation
- Browser-native speech preview
- CSS classes for speaking state

Production upgrade:
- Replace browser speechSynthesis with OpenAI TTS or Realtime API.
- Use the same spark state for listening, speaking, confirming, and error recovery.
