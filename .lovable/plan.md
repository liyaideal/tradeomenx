

## Problem

Desktop transaction history rows show a minimal inline detail line (just status icon + txHash), while mobile has a rich expandable panel showing Status, Network, and Transaction hash. Desktop is missing:
1. **Network** info is never shown on desktop
2. **Completed** transactions show no details at all on desktop (the condition filters them out)
3. The inline format is harder to read compared to the structured key-value layout on mobile

## Solution

Unify the desktop and mobile behavior — make desktop rows also expandable (click-to-expand) with the same detail panel layout (Status, Network, Transaction). Remove the `isMobile` guard so both platforms use the same expandable pattern.

### Changes to `src/components/wallet/TransactionHistory.tsx`

1. **Remove the `isMobile` condition from `showExpandable`** — make it `hasDetails(tx)` for both platforms
2. **Remove the desktop-only inline details block** (lines 330-358) — no longer needed
3. **Remove the `isMobile` guard from the expandable details block** (line 362) — show on both platforms
4. **Remove the `isMobile` guard from the inline status icon** (line 302) — show on both platforms
5. The expandable panel with Status / Network / Transaction hash will now work identically on desktop and mobile

### Result
- Both desktop and mobile will show the chevron arrow and expand on click
- The expanded panel shows Status, Network, and Transaction hash in a clean key-value layout
- Consistent UX across all viewports

