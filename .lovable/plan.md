

# Fix: Remove Icons & Rename Column Header

## Issues
1. **Icons**: Events/markets should NOT have icons (emoji). The `eventIcon` field is being rendered in both List View (line 83) and Grid View (line 52), and stored in `MarketRow.eventIcon`. The user has stated this before — events and markets have no icons.
2. **Column header**: The table header says "Market" (line 183) but should say "Event" — because "Market" is the term for an option/outcome, not the parent event.
3. **DESIGN.md**: Add a rule documenting that events and markets do not have icons, to prevent this from recurring.

## Changes

### 1. `src/components/events/MarketListView.tsx`
- Line 83: Remove `<span className="text-base mr-1">{row.eventIcon}</span>`
- Line 183: Change column header from `Market` to `Event`

### 2. `src/components/events/MarketCard.tsx`
- Line 52: Remove `{market.eventIcon}` from the title

### 3. `src/components/events/HotShelf.tsx`
- No icon references here — already clean

### 4. `DESIGN.md`
- Add a rule in an appropriate section stating: "Events and markets (options) do not have icons or emoji. Never render `eventIcon` or any icon/emoji next to event or market names."

### 5. `src/hooks/useMarketListData.ts`
- Keep `eventIcon` in the data model (it comes from DB `event.icon`), but the UI simply won't render it. No data layer changes needed.

