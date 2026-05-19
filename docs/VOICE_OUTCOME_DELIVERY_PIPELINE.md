# Voice Outcome Delivery Pipeline

Implemented the requested voice flow:

1. Intent Understanding
2. Human Understanding
3. Prediction
4. Coordination
5. Execution
6. Protection
7. Outcome Delivery

## Added files

- `lib/voice-pipeline/intentUnderstanding.js`
- `lib/voice-pipeline/predictionCoordinationExecution.js`
- `lib/voice-pipeline/voiceOutcomePipeline.js`
- `app/api/voice-pipeline/run/route.js`
- `components/VoiceOutcomePipelinePanel.jsx`
- `app/voice-pipeline/page.js`

## Integrated into conversation

`app/api/conversation/respond/route.js` now uses the voice pipeline response when available.

## Database

Adds `voice_outcome_pipeline_runs` to `docs/database.sql`.
