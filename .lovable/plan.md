Fix three voucher-related copy/labelling issues so voucher-redeemed airdrop positions are not mislabelled as welcome gifts or generic airdrops.

## Changes

### 1. Source column value (/portfolio/airdrops)
File: `src/pages/PortfolioAirdrops.tsx` (~line 352-355)

Current logic only distinguishes `welcome_gift` vs matched, so voucher rows fall into the "Welcome gift" branch.

New logic:
- `source === "voucher"` → `Voucher redemption`
- `source === "welcome_gift"` → `Welcome gift`
- else (matched) → `${externalSide} @ $${externalPrice}`

### 2. Source column tooltip (/portfolio/airdrops)
File: `src/pages/PortfolioAirdrops.tsx` (~line 307)

Current: `"Polymarket source position price."` — only describes matched airdrops.

New (multi-line, same `HeaderWithInfo` description pattern as Status):
- Matched: the price of the Polymarket source position this airdrop hedges.
- Welcome gift: no external source — a free starter position.
- Voucher redemption: no external source — opened by redeeming a position voucher.

### 3. TP/SL lock tooltip on /trade desktop positions table
File: `src/pages/DesktopTrading.tsx` (~line 1316-1324)

Current tooltip for any `isAirdrop` row: `"Airdrop positions auto-settle on event resolution"`. Wrong for voucher (voucher closes via the hold-window, profit goes to the Voucher earnings pool, no auto-settle on resolution).

New: branch on `position.airdropSource`:
- `voucher` → `"Voucher positions don't support TP/SL. Close manually within the hold window."`
- everything else (matched / welcome_gift) → keep existing copy.

## Out of scope

- No business-logic changes (TP/SL is already locked for vouchers, closing flow already routes through the voucher pool).
- Mobile `PositionCard` / `AirdropPositionCard` copy is not in the screenshots and not flagged — leave untouched.
- No copy-dictionary additions; these strings are descriptive UI helpers, not field labels.
