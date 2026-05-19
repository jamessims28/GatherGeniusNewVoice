# Visible Orb + Instant Response Update

## What changed

### Orb Pulse
The Genius orb pulse is stronger and easier to see:
- larger scale pulse
- brighter glow
- stronger core flash
- faster speaking pulse

### Faster Response Feel
A new instant local response layer was added:

- `lib/voice/instantResponseEngine.js`
- `app/api/voice/instant/route.js`

When the user speaks or types:
1. Genius gives an immediate local acknowledgement.
2. The backend continues processing for accurate result.
3. The final response is delivered when ready.

## Important Reality Note

Full accurate AI responses cannot be guaranteed in less than one millisecond because network, browser, model, and database calls take measurable time.

This update makes the experience feel immediate by separating:
- instant local response
- accurate backend response
