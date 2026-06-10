# Floating Sports launcher (V2 — Compact glass)

Add a single floating "OmenX Sports" entry point. Header (including the MAINNET chip) stays exactly as it is today.

## 1. New `SportsLauncher` component

**File:** `src/components/SportsLauncher.tsx` (new)

Fixed `bottom-6 left-6`, `z-50`. Renders only when both are true:
- `isWorldCupActive()` from existing `src/lib/worldCup.ts`
- `localStorage["sports-launcher-dismissed"]` missing or older than 24h (same TTL pattern as `wc2026-panel-dismissed`)

Composition (locked to selected V2 prototype):
- 56px tall pill, ~210px min-width, `rounded-2xl`, `bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl`
- Left: 40px gold-gradient circle containing soccer-ball icon (use existing `src/assets/soccer-ball.png` asset), red LIVE pulse dot top-right
- Middle: two-line label — `OmenX Sports` (15px bold) / `WORLD CUP · LIVE` (10px amber, font-mono, tracking-widest)
- Right: chevron-right; translates `+1px` on hover
- Hover: `-translate-y-0.5`, border brightens, subtle amber glow
- Dismiss × at `-top-2 -right-2`, opacity 0 → 1 on group-hover, writes `Date.now()` to localStorage and unmounts
- Click target (the pill itself): `window.open("https://omenx-sports.lovable.app?ref=omenx-main&src=launcher", "_blank", "noopener,noreferrer")`

Mobile (< 480px): collapse to a 48×48 round icon-only button (text hidden) so it doesn't fight the BottomNav.

## 2. Mount points

- `src/pages/Index.tsx` / `src/pages/MobileHome.tsx`
- `src/pages/EventsPage.tsx`

Mounted page-level alongside `WorldCupPanel`. Auto-hides outside the World Cup window — no manual teardown needed after the tournament.

## 3. Playground coverage (mandate)

**File:** `src/pages/StyleGuide/sections/WorldCupSection.tsx` (add section)

Add `SportsLauncher` PresetRail covering: default · hovered · mobile-collapsed · dismissed-hidden (with a "Reset dismissal" button so the demo state is restorable).

## Explicitly NOT changed

- MAINNET chip — stays as-is (user confirmed)
- Header layout, nav, logo, equity, avatar
- WorldCupPanel
- Discord floating button

## Tech notes

- All tokens via design system (`bg-card`, `text-foreground`, `text-trading-yellow` for gold, `text-trading-red` for LIVE dot)
- No hardcoded hex
- Reuses `isWorldCupActive()` so visibility automatically ends after 2026-07-20
- New memory after build: `mem://features/sports-launcher` describing dismiss key + visibility window + mount points
