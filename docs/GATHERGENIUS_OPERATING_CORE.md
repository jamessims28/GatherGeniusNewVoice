# GatherGenius Operating Core

Renamed and improved Ambient Operating Core V1 into **GatherGenius Operating Core**.

## Better name

Recommended: **GatherGenius Operating Core**

Why:
- stronger than V1
- investor-friendly
- describes the central execution intelligence
- keeps the brand attached to the core layer

## Improved modules

- `lib/operating-core/readinessGate.js`
- `lib/operating-core/intentEngine.js`
- `lib/operating-core/worldSignalEngine.js`
- `lib/operating-core/proactiveDecisionEngine.js`
- `lib/operating-core/outcomeProtectionEngine.js`
- `lib/operating-core/gatherGeniusOperatingCore.js`

## API

- `POST /api/operating-core/run`

## Improvements over V1

1. Stronger readiness gate with blockers, warnings, enabled systems, and better prompts.
2. Human intent engine now detects urgency, emotion, spending psychology, guests, budget, location, missing fields, and confidence.
3. World-signal engine now provides timing and pricing signals along with weather and location.
4. Proactive decision engine now ranks actions by priority and selects autonomy level.
5. Outcome protection engine now provides guardrails and protected action decisions.
6. Main orchestrator returns a clear decision object with action, confidence, message, and speak flag.
7. Database table renamed to `gathergenius_operating_core_runs`.
8. Interface text now uses GatherGenius Operating Core.
