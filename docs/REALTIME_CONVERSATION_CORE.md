# GatherGenius Realtime Conversation Core

Implemented 1-6:

1. Realtime Voice Session Route
   - `POST /api/voice/session`
   - Creates OpenAI Realtime session when `OPENAI_API_KEY` is set

2. Conversation Memory
   - `conversation_memory` table
   - `GET /api/conversation/memory`
   - memory inserts in `POST /api/conversation/respond`

3. Personality Layer
   - `lib/conversation/personality.js`
   - calm, pleasant, protective GatherGenius identity

4. Action Engine
   - `lib/conversation/actionRouter.js`
   - detects build, lock, permissions, pricing, issue actions

5. Context Awareness
   - approved permissions summarized
   - current lock passed into conversation response
   - memory route included

6. Natural Turn-Taking UI
   - `components/RealtimeConversationCore.jsx`
   - browser listen fallback
   - browser speech fallback
   - OpenAI realtime session route ready
   - dedicated `/conversation` page

Required env vars:
```env
OPENAI_API_KEY=
OPENAI_REALTIME_MODEL=gpt-4o-realtime-preview
OPENAI_VOICE=alloy
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
```
