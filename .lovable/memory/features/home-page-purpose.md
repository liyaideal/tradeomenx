---
name: home-page-purpose
description: Home is a new-user conversion funnel, not a dashboard. Sportsbook-style market sections + trial callout. NOT a mixed priority feed.
type: feature
---

## Home is a conversion funnel, not a dashboard

**Mission priority** (decides 80% of the viewport):
1. Guest → wants to sign up (after seeing real markets + social proof)
2. Authed without first trade → wants to place first trade
3. Authed with positions → bonus discoverability; not the main job

Active traders manage PnL/positions in **Portfolio**, not on home.

## Structure (mobile)

All states share the same body — three sportsbook-style market sections (`HomeMarketsSections`):
- **Most traded today** — top 4 by `volume24h`
- **Closing soon** — `isClosingSoon`, time-asc, 3 cards (deduped vs section 1)
- **New this week** — `isNew`, recency, 3 cards (deduped vs above)
- Footer CTA: "Browse all markets →" → `/events`

Cards reuse **`MarketCardB`** (do not fork — single source of truth with /events). Watchlist via `useWatchlist`.

### State branches (in `MobileHome.tsx`)

| State | Top of page | Personal callouts | Sections title |
|---|---|---|---|
| Guest | `LiveStatsStrip` only | none | "Most traded today" + `TrialCallout` interlude after section 1 |
| Authed no positions | `HomeStatusStrip` + `LiveStatsStrip` | `OnboardingCard` (if incomplete) | "Pick your first prediction" |
| Authed with positions | `HomeStatusStrip` + `LiveStatsStrip` | `OnboardingCard` + top `PositionAlertCard` (largest \|pnl%\|) | "Most traded today" |

## What was removed

- Top **`CampaignBannerCarousel`** — gone from home (too aggressive). Future: re-introduce as a single `CampaignFeedCard` between sections, authed only.
- Generic priority-sorted feed (`HomeFeed` + `useHomeFeed`) is no longer used by `MobileHome`. The hook + tier cards still exist for potential reuse but are not mounted.
- Equity strip for guests — guests see no balance UI.

## Components

- `src/components/home/LiveStatsStrip.tsx` — `LIVE · N markets · $X traded today`. Pure social proof, no copy.
- `src/components/home/HomeMarketsSections.tsx` — three sections + dedup + "browse all" footer.
- `src/components/home/TrialCallout.tsx` — "$10 to try, no deposit" conversion strip. Guest-only, slotted between section 1 and 2.
- `HomeStatusStrip` — kept but **only rendered for authed users** now.

## Sportsbook conversion playbook applied

1. **Real activity > marketing copy**: live counters, no headline hero.
2. **Sectioned discovery**: hot / urgent / fresh — classic sportsbook IA.
3. **Conversion after engagement**: trial CTA appears AFTER user scrolls past first markets, not before.
4. **Free play hook**: "$10 to try, no deposit" not "Sign up".
