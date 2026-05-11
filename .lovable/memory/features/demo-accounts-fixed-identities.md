---
name: Demo accounts for QA
description: Two persistent fixed demo accounts (matched / welcome) on login screen for previewing both H2E airdrop states
type: feature
---
**Two persistent demo accounts** on the login screen replace ad-hoc scenario toggles:

- **Matched user (A)** — `demo.matched@omenx.dev` → returns `MOCK_AIRDROPS_MATCHED` (4 matched cards, no welcome_gift)
- **Welcome gift user (B)** — `demo.welcome@omenx.dev` → returns `MOCK_AIRDROPS_WELCOME` (1 welcome_gift card)
- Shared password (internal): `OmenxDemo!2026`

**Mechanism:**
- `supabase/functions/ensure-demo-user` (verify_jwt = false) admin-creates the user idempotently with `email_confirm: true` then returns `{email, password}`.
- Frontend in `AuthContent.tsx` → `handleDemoAccountLogin(scenario)` calls the function, then `signInWithPassword`. Buttons always visible (during demo phase).
- `useAirdropPositions.ts` picks mock by `email` via `pickMockByEmail()`. Any other user (anonymous etc.) falls back to `MOCK_AIRDROPS_MATCHED`.
- `useConnectedAccounts` is already user-id scoped via localStorage → two accounts get independent connected-account state automatically.

**Why:** anonymous sign-in (`signInAnonymously`) can't be returned to after sign-out. Fixed credentialed accounts give us repeatable, comparable QA / demo / screenshot flows. Reusable for any future "new user vs old user" comparison.
