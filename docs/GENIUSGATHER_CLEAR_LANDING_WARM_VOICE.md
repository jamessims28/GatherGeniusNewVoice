# GeniusGather Clear Landing + Warm Voice Update

## Changed

- Landing page simplified.
- Visible UI now centers on GeniusGather asking questions.
- Templates remain hidden in the background.
- Permissions remain background/minimal.
- Voice tone slowed and softened to sound less robotic.
- Branding updated so the voice assistant presents as GeniusGather by GatherGenius.

## User experience

The only real action is conversation:

```text
GeniusGather asks.
User answers.
GeniusGather produces the result.
```

## Voice behavior

Browser speech fallback:
- slower rate
- warmer pitch
- slightly softer volume
- more natural phrasing

For production, connect OpenAI Realtime voice and choose the warmest available voice in environment variable:

```env
OPENAI_VOICE=alloy
```
