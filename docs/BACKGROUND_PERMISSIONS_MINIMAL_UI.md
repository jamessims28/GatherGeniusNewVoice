# Background Permissions + Minimal UI Update

## What changed

Visible permission complexity was reduced.

GatherGenius now:
- keeps permissions mostly in the background
- shows only a small permission status panel
- asks before using new data points
- explains clearly if syncing or access fails
- allows quick "Allow Recommended" and "Change" actions

## User-facing principle

The page should feel minimal:
- one sentence
- voice spark
- background intelligence
- quiet permissions
- clear issue alerts only when needed

## Technical additions

- `components/DataPermissionCenter.jsx` simplified
- `/permissions` page minimized
- `/api/permissions/request` added for background permission prompts
- permission sync still saves to localStorage and attempts Supabase save
