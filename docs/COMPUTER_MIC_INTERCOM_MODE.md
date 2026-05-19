# Computer Mic + Intercom Mode

Genius can now use browser-supported audio input devices.

## Supported input types

- Built-in computer microphone
- USB microphone
- Headset microphone
- Bluetooth microphone
- Intercom-style device if the operating system/browser exposes it as an audio input

## Added

- `components/VoiceInputDevicePanel.jsx`
- microphone permission request
- device selector
- Computer Mic / Headset / Intercom Mode buttons
- refresh audio inputs
- selected device permission check before listening

## Important

Browser SpeechRecognition may not let every browser force a specific mic directly, but this implementation requests access to the selected input and validates that the device is available before listening.

For true production-grade intercom audio routing, connect the device at the OS level or use OpenAI Realtime audio streams with explicit WebRTC input tracks.
