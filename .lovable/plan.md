## Reuse /events Hot logic in Home Top Events

Extract the bucket classification used by `HotShelf` into a shared hook, then rebuild `HomeTopEvents` as a 3-chip filter (`All` / `Trending` / `Closing Soon`) backed by that same hook. No more duplicated filtering logic.

### 1. New hook: `src/hooks/useHotMarkets.ts`

Single source of truth, lifted verbatim from `HotShelf.tsx` (lines 55–79). Extends with an "all" view so Home can reuse it.

```ts
export type HotBucket = "all" | "trending" | "closingSoon";

export function useHotMarkets(markets: EventRow[]) {
  return useMemo(() => {
    const now = Date.now();
    const h48 = 48 * 3600000;

    const justLaunched = markets.filter(
      (m) => now - new Date(m.createdAt).getTime() <= h48,
    );
    const closingSoon = markets
      .filter((m) => m.expiry && m.expiry.getTime() - now <= h48 && m.expiry.getTime() > now)
      .sort((a, b) => b.openInterest - a.openInterest);

    const launchedIds = new Set(justLaunched.map((m) => m.id));
    const closingIds = new Set(closingSoon.map((m) => m.id));

    const trending = markets
      .filter(
        (m) => !launchedIds.has(m.id) && !closingIds.has(m.id) && m.volume24h > 10_000,
      )
      .sort((a, b) => b.volume24h - a.volume24h);

    const all = [...markets].sort((a, b) => b.volume24h - a.volume24h);

    return { all, trending, closingSoon, justLaunched };
  }, [markets]);
}
```

### 2. Refactor `HotShelf.tsx`

Replace the inline `useMemo` block with `const { trending, justLaunched, closingSoon } = useHotMarkets(markets)`. Apply existing slice limits at the call site (`.slice(0, 5)` for trending, `.slice(0, 3)` for the others). No visual change to `/events` Hot tab.

### 3. Rewrite `HomeTopEvents.tsx`

Replace the current LIVE toggle + category chips + custom filter logic with:

- **3-chip filter row** (single-select, default `All`):
  - `All` → `useHotMarkets(rows).all.slice(0, 8)`
  - `Trending` → `.trending.slice(0, 8)`
  - `Closing Soon` → `.closingSoon.slice(0, 8)`
- Empty state: "No markets in this view" + "Reset to All" button.
- Keep:
  - Section header `Top Events` (no LIVE switch).
  - `MarketCardB noBackground` card render (already aligned with /events).
  - `interlude` slot between cards 2 and 3.
  - "Browse all markets" CTA → `/events`.
- Remove: `CATEGORY_STYLES` import, category chip generation, `liveOnly` state, `activeChip` per-category state.

Chip styling: same pill style currently used for category chips (rounded-full border + active = `bg-foreground text-background`).

### 4. No other changes

- `MarketCardB`, `MarketGridView`, `MarketListView`, `EventsPage` untouched.
- `useMarketListData`, `useActiveEvents` untouched.

### Out of scope

- Wiring Home chips to URL state.
- Adding `Just Launched` to Home (user explicitly listed only 3 options).