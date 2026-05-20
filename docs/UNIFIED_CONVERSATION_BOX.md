# Unified Conversation Box

## Implemented

- One response/conversation box for written and spoken exchanges.
- User speech, user typing, Genius speech, and Genius responses all render in the same box.
- Proactive voice, Let Genius speak first, Talk, and Enable live voice moved to a small bordered footer.
- Bottom voice controls use very small font.
- Audio input device manager remains active in the background.
- Instant local acknowledgement still works, followed by backend final response.

## Main file changed

- `components/RealtimeConversationCore.jsx`

## Styling added

- `.gg-unified-response-box`
- `.gg-unified-line`
- `.gg-unified-input-row`
- `.gg-mini-voice-footer`
