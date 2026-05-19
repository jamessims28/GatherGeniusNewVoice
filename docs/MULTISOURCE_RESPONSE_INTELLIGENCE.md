# Multi-source Response Intelligence

GeniusGather can now gather information from multiple sources before responding.

## Sources

- Conversation memory from Supabase
- Experience history / locks
- Provider performance
- Live pricing engine
- Optional external search through Brave Search or SerpAPI

## API

`POST /api/intelligence/multisource`

## UI

- `/intelligence`
- `MultiSourceAnswerPanel`

## Environment variables

```env
MULTISOURCE_ENABLED=true
BRAVE_SEARCH_API_KEY=
SERPAPI_API_KEY=
GOOGLE_PLACES_API_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

If external search keys are missing, GeniusGather is honest and says the source is unavailable.
