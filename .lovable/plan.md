

# Plan: Align Transparency Pages with Real On-Chain Data Dictionary

## Problem
The three transparency scenarios currently display generic/invented field names that don't match the actual on-chain contract event logs. The user has provided the real data dictionary of fields committed to the blockchain.

## Changes

### 1. Merkle Proof Verification — align with State Root Snapshot fields

**Hook (`useMerkleVerification.ts`)**:
- Add `oldRoot` (previous batch state root) to mock data
- Change `batchId` format from `batch-XXXXX` to a realistic incrementing integer (e.g., `42817`)
- Add `commitTimestamp` (the L2 on-chain commit time)

**UI (`MerkleProofVerification.tsx`)**:
- In Cryptographic Details, show: `Batch ID`, `Old Root (Previous)`, `New Root (Current)`, `Commit Timestamp`
- Label the existing `stateRoot` as "New Root (newRoot)" and add `oldRoot` as "Previous Root (oldRoot)"

### 2. Trade Verification — use real Trade Logged event fields

**Hook (`useTradeVerification.ts`)**:
- Replace generic on-chain log fields with the real contract fields:
  - `eventId` → use event name or a mock numeric ID
  - `outcomeId` → numeric (0, 1, 2...)
  - `makerUid` → hashed UID (anonymized)
  - `takerUid` → current user's hashed UID
  - `price` → 6-decimal integer format (e.g., `500000` = $0.50), plus human-readable
  - `size` → contract share count
  - `side` → numeric enum: 0=Open Long, 1=Close Long, 2=Open Short, 3=Close Short

**UI (`TradeVerification.tsx`)**:
- Update comparison table to show these contract-native field names
- Add a "Raw Value" column showing the integer/enum values alongside human-readable translations
- Replace "Counterparty: Official AMM Node" with showing `makerUid` / `takerUid` pair

### 3. Liquidation Audit — use real Liquidation event fields

**Hook (`useLiquidationAudit.ts`)**:
- Module A on-chain fields should match the real event: `uid`, `positionSide` (long/short), `markPrice` (6-decimal integer), `size`
- Keep the oracle comparison (Module B) and conclusion (Module C) as-is since those are the analysis layer

**UI (`LiquidationAudit.tsx`)**:
- In Module A "On-Chain Liquidation Snapshot", display the event log fields in their raw contract format:
  - `uid` (hashed user ID)
  - `positionSide` (0 or 1, with human label)
  - `markPrice` (raw integer + formatted dollar value)
  - `size` (contract units)
- Keep the big red price display but add the raw 6-decimal integer below it

### 4. Add two new scenario cards (Funding Rate + Event Resolution)

**New Scenario: Funding Rate Audit**
- Card: "Am I Being Overcharged?" / Funding Rate Verification
- Flow: Select an event/outcome → fetch on-chain `FundingRate` log → display `eventId`, `outcomeId`, `fundingRate` (signed value, positive = longs pay shorts)
- Simple result: show the on-chain recorded rate vs what was applied to user's position

**New Scenario: Settlement Verification**  
- Card: "Was the Result Fair?" / Event Resolution Audit
- Flow: Select a resolved event → fetch on-chain `EventResolved` log → display `winningOutcomeId`, `oracleProof` (hash/link to external data source)
- Result: prove the winning outcome matches the oracle proof

### 5. Update TransparencyPage.tsx
- Add two new entries to `SCENARIOS` array
- Add routing for the two new scenario components

## Files to create/modify

| File | Action |
|------|--------|
| `src/hooks/useMerkleVerification.ts` | Add oldRoot, fix batchId format, add commitTimestamp |
| `src/components/transparency/MerkleProofVerification.tsx` | Show oldRoot/newRoot labels, commit timestamp |
| `src/hooks/useTradeVerification.ts` | Use real contract field names (eventId, outcomeId, makerUid, takerUid, price as 6-dec int, side as enum) |
| `src/components/transparency/TradeVerification.tsx` | Update comparison table with contract-native fields |
| `src/hooks/useLiquidationAudit.ts` | Add uid, positionSide enum, raw markPrice integer, size |
| `src/components/transparency/LiquidationAudit.tsx` | Display raw contract fields in Module A |
| `src/hooks/useFundingRateAudit.ts` | **New** — fetch positions, simulate funding rate log |
| `src/components/transparency/FundingRateAudit.tsx` | **New** — UI for funding rate verification |
| `src/hooks/useSettlementAudit.ts` | **New** — fetch resolved events, simulate EventResolved log |
| `src/components/transparency/SettlementAudit.tsx` | **New** — UI for settlement/oracle proof verification |
| `src/pages/TransparencyPage.tsx` | Add 2 new scenario cards + routing |

No database migrations needed — all mock/simulation data, no new tables required.

