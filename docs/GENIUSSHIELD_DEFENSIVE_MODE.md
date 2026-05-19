
# GeniusShield Defensive Mode

GeniusShield is a safe active-defense layer.

It does not attack anyone back.

It does:
- detect suspicious input
- block dangerous requests
- log forensic evidence
- preserve attack indicators
- harden browser security headers
- protect conversation endpoints
- provide `/security` status page
- provide `/api/security/genius-shield/report`

## Database

Run `docs/database.sql` to create:

- `security_incidents`

## Safe Incident Flow

```text
Detect
↓
Block
↓
Log
↓
Alert-ready
↓
Review
↓
Recover
```
