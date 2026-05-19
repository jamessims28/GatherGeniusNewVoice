# Interactive Thought Conversation

Implemented data-backed conversation design into Genius.

## Research patterns used

- Turn-taking and endpointing
- Interruption handling
- Active listening
- Reflective response
- Follow-up handoff
- Conversation-type adaptation
- Shared thought memory

## Sources referenced

- OpenAI Voice Agents / Realtime sessions
- Google conversation design cooperative principle / turn-taking
- Nielsen Norman Group AI conversation types
- LiveKit turn detection concepts
- Turn-taking research literature

## Files added

- `lib/conversation/interactiveExchangeEngine.js`
- `app/api/conversation/exchange/route.js`
- `components/InteractiveExchangePanel.jsx`
- `app/exchange/page.js`

## Conversation behavior

Genius now frames responses as:

1. Acknowledge
2. Reflect thought/feeling
3. Respond
4. Ask a natural follow-up
5. Hand the turn back
