---
name: Demo accounts for QA
description: Two persistent fixed demo accounts (matched / welcome) for previewing both H2E airdrop states — surfaced only in /style-guide, NOT in production Auth dialog
type: feature
---
**Two persistent demo accounts** for QA preview of the first-login airdrop modal:

- **Matched user (A)** — `demo.matched@omenx.dev` → returns `MOCK_AIRDROPS_MATCHED` (4 matched cards, no welcome_gift)
- **Welcome gift user (B)** — `demo.welcome@omenx.dev` → returns `MOCK_AIRDROPS_WELCOME` (1 welcome_gift card)
- Shared password (internal): `OmenxDemo!2026`

**Where surfaced:**
- `/style-guide` → UserIdentity section → "Demo accounts (QA only)" SubSection.
- Component: `src/components/auth/DemoAccountsBlock.tsx`.
- **Removed from production Auth dialog** (AuthDialog / AuthSheet / AuthContent) per `mem://workflow/no-demo-entries-in-product`.

**Mechanism:**
- `supabase/functions/ensure-demo-user` (verify_jwt = false) admin-creates the user idempotently with `email_confirm: true` then returns `{email, password}`.
- `DemoAccountsBlock` invokes the function, then `signInWithPassword`.
- `useAirdropPositions.ts` picks mock by `email` via `pickMockByEmail()`. Any other user (anonymous etc.) falls back to `MOCK_AIRDROPS_MATCHED`.
- `useConnectedAccounts` is already user-id scoped via localStorage → two accounts get independent connected-account state automatically.

**Why:** fixed credentialed accounts give us repeatable, comparable QA / demo / screenshot flows that survive sign-out (unlike `signInAnonymously`). Reusable for any future "new user vs old user" comparison.
