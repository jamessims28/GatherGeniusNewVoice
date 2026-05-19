# Source-aware Code Forge

GeniusGather now gathers multiple approved sources before writing code.

## Implemented

- `lib/codeforge/sourceAwareCodeEngine.js`
- `lib/codeforge/codeSafety.js`
- `POST /api/codeforge/generate`
- `/codeforge` page
- `SourceAwareCodeForge` component
- Supabase table: `source_aware_code_generations`

## How it works

1. User describes code needed.
2. GeniusGather gathers context from multiple sources:
   - memory
   - experience history
   - provider data
   - live pricing
   - optional external search
3. The code forge generates app-specific code from that context.
4. GeniusShield scans the output.
5. Unsafe code is blocked and replaced with a safe fallback.

## Required env vars

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
SOURCE_AWARE_CODE_ENABLED=true
CODE_FORGE_SAFE_MODE=true
```

## Notes

This creates original, app-specific code, but no system can honestly guarantee that no similar code exists anywhere in the world.
