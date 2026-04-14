

# Event List V2 Redesign — Implementation Plan

## Summary

Replace the current large EventCard + Quick Trade layout with a Binance-style dual-view (List/Grid) event list. This is a full rewrite of the `/events` page with 10-column table view, compact grid cards, tabbed navigation, watchlist, Hot tab with 3-shelf layout, NEW badges, Closing Soon tiered countdown, search, and filter chips.

## Scope (All PRD features, one-shot)

1. **Desktop List View** — 10-column table (Star, Market, Category, Mark Price, 24h Change, 24h Volume, Open Interest, Funding Rate, Max Leverage, Expiry, Arrow). Event aggregation with expandable multi-market rows.
2. **Grid View** — Compact cards for mobile default and desktop toggle. Single column mobile, 3-4 col desktop.
3. **View Toggle** — List/Grid switch with localStorage persistence. Mobile forces Grid.
4. **Top-level Tabs** — [All] [Hot] [Watchlist] [Crypto] [Macro] [Sports] [Politics] with URL sync (`/events?tab=hot`).
5. **Hot Tab** — 3-shelf layout: Trending (top 5), Just Launched (top 3, ≤48h), Closing Soon (top 3, ≤48h). Frontend sorting with mock thresholds.
6. **Watchlist** — Reuse existing localStorage favorites from `useEvents`. Create `user_watchlist` Supabase table for logged-in users. Merge on login.
7. **Filter Chips** — Search, Chain, Expiry, Leverage, Sort dropdowns. Clear All button.
8. **NEW Badge** — Green pill on events created ≤72h ago, with pulse animation. Suppressed when Closing Soon.
9. **Closing Soon** — 4-tier red countdown (72h-24h, 24h-1h, 1h-5m, <5m). Refresh interval: 60s default, 1s when <5m.
10. **Column sorting** — Click column headers to cycle: desc → asc → default.
11. **Remove Quick Trade** — Delete all inline trading from EventCard.
12. **Mock data** — 24h Change, OI, Funding Rate, Max Leverage use generated mock values until backend delivers.

## Technical Design

### Database Migration
```sql
CREATE TABLE user_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, event_id)
);
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;
-- Users can only manage their own watchlist
CREATE POLICY "Users manage own watchlist" ON user_watchlist
  FOR ALL TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### New Files
| File | Purpose |
|------|---------|
| `src/components/events/MarketListView.tsx` | Desktop 10-column table with expandable rows |
| `src/components/events/MarketGridView.tsx` | Compact grid cards |
| `src/components/events/MarketRow.tsx` | Single table row (parent event or child market) |
| `src/components/events/MarketCard.tsx` | Single grid card |
| `src/components/events/EventTabs.tsx` | Top-level tab bar with URL sync |
| `src/components/events/FilterChips.tsx` | Search + Chain/Expiry/Leverage/Sort dropdowns |
| `src/components/events/ViewToggle.tsx` | List/Grid switch |
| `src/components/events/HotShelf.tsx` | 3-shelf Hot tab layout |
| `src/components/events/NewBadge.tsx` | NEW pill with pulse |
| `src/components/events/ClosingSoonCountdown.tsx` | Tiered countdown component |
| `src/hooks/useWatchlist.ts` | localStorage + Supabase watchlist sync |
| `src/hooks/useMarketListData.ts` | Transform events → flat market rows with mock fields |

### Modified Files
| File | Change |
|------|--------|
| `src/pages/EventsPage.tsx` | Full rewrite — tabs, filters, list/grid views |
| `src/components/EventCard.tsx` | Keep file but strip Quick Trade; may deprecate in favor of MarketCard |

### Data Model: Event → Markets

Each `event_options` row = 1 market. The list shows markets (not events) as primary rows, grouped under parent events. For events with 1-2 options (binary), show as single row with the "Yes" market. For multi-option events, show collapsed parent row (highest volume market as representative) with expandable children.

Mock fields per market row:
```ts
{
  markPrice: option.price,           // real from DB
  change24h: randomMock(-15, +15),   // % mock
  volume24h: randomMock("$50K-$5M"), // mock
  openInterest: randomMock("$10K-$2M"), // mock
  fundingRate: randomMock(-0.05, 0.05), // mock %
  maxLeverage: 10,                   // static mock
  expiry: event.end_date,            // real from DB
  isNew: created_at within 72h,      // real from DB
  isClosingSoon: end_date within 72h, // real from DB
}
```

### Responsive Rules
- Desktop (>1024px): Default List, toggle to Grid
- Tablet (768-1024px): Default Grid, toggle to List
- Mobile (<768px): Forced Grid, toggle hidden

### Watchlist Strategy
- Guest: Continue using existing localStorage `Set<string>` from `useEvents`
- Logged in: Read/write `user_watchlist` table
- `useWatchlist` hook abstracts both, merges localStorage → Supabase on first login

### Implementation Order
1. Create `user_watchlist` table migration
2. Build atomic components (NewBadge, ClosingSoonCountdown, ViewToggle)
3. Build `useMarketListData` hook (transform DB events → market rows with mocks)
4. Build `useWatchlist` hook
5. Build MarketRow + MarketListView (desktop table)
6. Build MarketCard + MarketGridView (mobile/grid cards)
7. Build EventTabs + FilterChips + HotShelf
8. Rewrite EventsPage to compose everything
9. Remove Quick Trade from old EventCard (keep file for potential other uses)

