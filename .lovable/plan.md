## Align Home Top Events with /events cards (single source of truth)

Replace the bespoke `HomeMatchCard` with `MarketCardB` (the same card `/events` grid view uses), and add a lightweight `noBackground` prop so Home can render it without the gradient surface + category background image.

### 1. `MarketCardB.tsx` — add `noBackground` prop

```ts
interface MarketCardBProps {
  market: EventRow;
  isWatched: boolean;
  onToggleWatch: (e?: React.MouseEvent) => void;
  chgTimeframe?: ChgTimeframe;
  noBackground?: boolean;  // ← new
}
```

Behavior when `noBackground` is true:
- Skip the inline `style={{ background: linear-gradient(...) }}` on the root.
- Skip the absolute-positioned category `<img>` overlay block (lines 55–65).
- Drop the outer `border` (border-border/40) → `border-transparent`, keeping rounded corners + padding.
- Everything else (header, title, outcome mini-table, footer Vol row) stays identical, so `/events` and Home render the same content/layout.

Default `noBackground={false}` → `/events` rendering is unchanged. This keeps the constraint that A/B/C card files don't modify each other (we're only extending B itself).

### 2. `HomeTopEvents.tsx` — swap card

- Replace `import { HomeMatchCard } from "./HomeMatchCard"` with `import { MarketCardB } from "@/components/events/MarketCardB"`.
- In the list render, swap `<HomeMatchCard … />` for `<MarketCardB market={m} isWatched={…} onToggleWatch={…} noBackground />`.
- Skeleton placeholder height stays the same.

### 3. Delete `src/components/home/HomeMatchCard.tsx`

No other importers (verify: `rg "HomeMatchCard"` shows only `HomeTopEvents.tsx`).

### 4. Memory

Update `mem://constraint/card-style-isolation` (or create if missing) to clarify: Home v3 reuses `MarketCardB` via `noBackground` prop instead of maintaining a D-class card. The "no cross-modification" rule still applies between A/B/C files themselves.

### Out of scope

- No change to `/events` page, `MarketGridView`, `MarketListView`, `HotShelf`.
- No change to data/hooks (`useMarketListData`, `useActiveEvents`).
- LIVE toggle, category chips, "Browse all markets" CTA in `HomeTopEvents` stay as-is.