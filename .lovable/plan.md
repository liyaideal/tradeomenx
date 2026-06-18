## Objective
Update all H2E (Hedge-to-Earn) campaign rule references from old values to new values as specified by the user.

## Rule Changes
| Rule | Old | New |
|------|-----|-----|
| Single-account max reward | 100U | 500U |
| Eligibility: position size | ≥ 200 USDT | ≥ 20 U |
| Eligibility: hold time | ≥ 3 days | ≥ 1 day |
| Matching event remaining time | ≥ 72 hours | ≥ 24 hours |

## Files to Update

1. **`src/components/settings/ConnectedAccountsCard.tsx`** (lines 441-447)
   - Change "≥ $200" → "≥ $20"
   - Change "3 days" → "1 day"
   - Change "≥ 72 hours" → "≥ 24 hours"
   - Change "$100 lifetime earnings" → "$500 lifetime earnings"

2. **`src/hooks/useH2eRewardsSummary.ts`** (line 6)
   - Change `const H2E_EARNINGS_CAP = 100` → `const H2E_EARNINGS_CAP = 500`

3. **`src/components/AirdropPositionCard.tsx`** (line 178)
   - Change "Max $100 earnings per account" → "Max $500 earnings per account"

4. **`src/components/AirdropHomepageModal.tsx`** (line 169)
   - Change "Max $100 earnings per account" → "Max $500 earnings per account"

## Verification
- Run TypeScript compilation (`npx tsc --noEmit`) to confirm no type errors after changes.
