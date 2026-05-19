# Fix: Voice Unlock

The orb was moving, but browser voice often fails if speech synthesis or microphone access starts before a user gesture.

## Fixed

- Full page now acts as the voice unlock gesture.
- Genius politely asks the user to tap once.
- Microphone permission is requested only after tap/click.
- Speech synthesis is warmed up after user gesture.
- Genius greets politely once voice is ready.
- Listening loop starts after greeting completes.
- If mic permission is denied, Genius asks inside the same conversation box.
- Chrome/Edge speech recognition support is detected.
- Orb movement remains JS-driven across the full page.

## Important

Browser speech recognition depends on:
- HTTPS deployment
- Chrome/Edge support
- microphone permission
- user gesture to unlock audio
