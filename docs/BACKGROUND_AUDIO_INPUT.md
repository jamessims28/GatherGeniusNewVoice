# Background Audio Input

Microphone, headset, and intercom mode remain enabled in the background.

## What changed

- Visible audio mode buttons removed from landing experience.
- `VoiceInputDevicePanel` now defaults to `background={true}`.
- Computer mic, headset, and intercom-compatible devices are still supported.
- User still needs browser microphone permission.

## Files

- `lib/voice/backgroundAudioInput.js`
- `components/VoiceInputDevicePanel.jsx`
- `components/RealtimeConversationCore.jsx`
