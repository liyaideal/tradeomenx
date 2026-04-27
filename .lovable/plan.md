# Plan: Position-intent aware margin + no cross-zero reverse opening

你说得对：desktop 不是没有 Order Preview，而是用 `DesktopTrading.tsx` 内部的 Dialog 做 preview；mobile 用独立 `/order-preview` 页面。实现时会分别接入这两个 preview，而不是误判为桌面端直接下单。

## Goal

When Buy/Sell prices are asymmetric, margin validation must be based on the user's canonical net position, not only on the clicked-side price.

New product rule:

```text
Same market + same canonical YES axis:
- Same direction: allow open/add, require new IM
- Opposite direction within current size: allow reduce/close, require 0 new IM
- Opposite direction beyond current size: block cross-zero; user must close to 0 first
```

This prevents cases like `YES Long 100 @ 0.10` being blocked from closing because `Buy NO 100 @ 0.90` incorrectly requires `9U` new margin.

## Implementation

### 1. Add shared order-intent logic
Create a shared utility, likely `src/lib/positionIntent.ts`, to classify a requested order as:

- `open`
- `add`
- `reduce`
- `close`
- `blocked-cross-zero`

It will:
- normalize binary `No` orders onto the canonical YES axis;
- calculate signed `q_before`, signed `dq_req`, and `q_after`;
- compute display values such as existing size, capped reduce qty, incremental margin, released margin estimate, and realized PnL estimate.

### 2. Update mobile order form and mobile Order Preview
In `src/components/TradeForm.tsx`:
- remove the existing `Reduce only` checkbox UI;
- calculate intent using current positions;
- show `Margin req. = 0` for reduce/close;
- show dynamic button labels:
  - `Buy Long` / `Sell Short` for open/add
  - `Reduce Long` / `Reduce Short`
  - `Close Long` / `Close Short`
- if cross-zero is attempted, block the preview and show a message explaining the current opposite position.

In `src/pages/OrderPreview.tsx`:
- re-run intent classification as a safety check;
- skip balance deduction for reduce/close except fees if applicable;
- block `blocked-cross-zero` with a toast and a clear UI message.

### 3. Update desktop trading panel and desktop Order Preview Dialog
In `src/pages/DesktopTrading.tsx`:
- remove the `Reduce only` checkbox from the desktop trade panel;
- use the same intent classification for the form summary and preview dialog;
- keep the existing desktop Order Preview Dialog flow;
- show reduce/close intent in the preview details;
- block cross-zero attempts before confirming.

Desktop preview remains a Dialog; mobile preview remains a page.

### 4. Implement backend/service safety in `executeTrade`
Update `src/services/tradingService.ts` so the database state follows the same rule:

- canonicalize binary orders to YES axis;
- locate the open position for the canonical event + option;
- if same direction: keep existing weighted-average add/open logic;
- if opposite direction and `qty < existing size`: reduce the existing position size and margin proportionally;
- if opposite direction and `qty == existing size`: close the existing position;
- if opposite direction and `qty > existing size`: throw an error: `Close existing position first before opening the opposite side.`

For reduce/close:
- calculate realized PnL using the canonical entry/close prices;
- release proportional margin immediately;
- return the released margin + realized PnL result to the caller so UI balance can update correctly.

### 5. Balance settlement
Because you selected immediate settlement:
- open/add orders still deduct `margin + fee`;
- reduce/close orders should not deduct new margin;
- reduce/close should immediately add released margin plus realized PnL back to the user balance, minus fee if applicable.

I will align this with the existing `useUserProfile` balance functions where possible; if a missing helper is needed, I will add one rather than overloading `deductBalance` incorrectly.

### 6. Close & Continue UX
Because you selected `Close & Continue`:
- when the requested order crosses zero, show a blocking hint with the existing position size;
- provide a `Close & Continue` action;
- clicking it closes/reduces the existing position to zero first, then returns the user to the same market/side so they can submit the opposite-side order cleanly.

To keep this safe, I will implement it as a two-step explicit action rather than silently bundling close + new open into one transaction.

### 7. Persist the product rule in memory
Add a project memory rule documenting:
- no cross-zero reverse opening;
- reduce/close requires zero incremental IM;
- users must close to zero before opening the opposite side;
- both mobile page preview and desktop dialog preview must enforce this.

## Notes

No database schema change is expected. This is primarily logic and UI behavior using existing `positions`, `trades`, and `profiles` tables.