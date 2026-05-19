# Background Stack + Voice-Only UI Update

## What changed

The visible 1–10 Evolution Stack panel was removed from the user-facing page.

The AI stack remains implemented in code and runs quietly through:

- `lib/evolution/*`
- `POST /api/evolution/run`

## User-facing experience

The final interface is now:

```text
AI Voice → Result
```

No visible 1–10 stack.
No visible template grids.
No visible permission grid.
No complexity shown to the user.

## Background behavior

When GatherGenius builds an experience, it quietly calls the 1–10 stack in the background to support:
- presence intelligence
- predictive coordination
- emotional mapping
- multi-agent reasoning
- behavioral modeling
- ambient surface logic
- negotiation simulation
- trust/safety
- living spark state
- outcome consciousness
