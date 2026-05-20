# Fix: Moving Orb

The orb now moves using JavaScript state updates instead of relying only on CSS keyframes.

## What changed

- Added `orbPosition` state.
- Added an interval-driven full-page path.
- Orb moves across top, sides, center, and bottom of viewport.
- While speaking, movement becomes faster.
- CSS transitions now animate `left` and `top` smoothly.

## Main file changed

- `components/RealtimeConversationCore.jsx`
- `app/globals.css`
