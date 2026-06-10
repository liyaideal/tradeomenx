## Goals

1. Mobile no longer shows the giant WorldCup floating teaser/scoreboard panel — it covers too much of the home screen.
2. The featured center slot in the mobile bottom nav becomes the **Sports** entrance (links out to OmenX Sports), replacing Leaderboard.
3. Leaderboard moves into the **Me** profile drawer as a list item, so it's still reachable.

## Changes

**`src/pages/MobileHome.tsx`**
- Remove `<WorldCupPortal />` mount and its import. Desktop `EventsPage.tsx` keeps the portal (request was mobile-only).

**`src/components/BottomNav.tsx`**
- Replace the featured center item `{ icon: Trophy, label: "Ranks", path: "/leaderboard", featured: true }` with a Sports entry:
  - Icon: `Trophy` (still works for sports/world cup) with the same elevated gold-glow featured treatment, but tinted to match the WC gold (`text-yellow-400`, `drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]`) so it reads as "Sports / World Cup" rather than the generic primary purple.
  - Label: `Sports`.
  - During WorldCup `teaser` / `live` phase (via `getWorldCupPhase()` from `@/lib/worldCup`), show a small red `LIVE` / yellow `SOON` dot badge on the icon to keep the hype.
  - On tap: open `SPORTS_LINK` in a new tab (`window.open(..., "_blank", "noopener,noreferrer")`) instead of navigating in-app. No active state needed (external link).
- Add a `Leaderboard` (Trophy icon) row into the Me drawer `MobileDrawerList`, placed right under `Portfolio`, navigating to `/leaderboard`.

**Desktop**
- Untouched. Desktop header/leaderboard nav and the desktop WorldCup portal stay as-is.

## Out of scope

- No data/route changes for `/leaderboard` itself.
- Desktop floating WorldCup panel stays (user only complained about mobile).
- No memory updates needed — existing `world-cup-portal` memory still accurate for desktop; will note "mobile floating panel removed" only after build is approved.
