## Consolidate Position + Onboarding into single PersonalSlot

Replace the two independent blocks in `MobileHome` with one slot that picks the right card based on user state.

### New file: `src/components/home/PersonalSlot.tsx`

Renders exactly one card (or nothing):

```text
guest                        → null (TrialCallout handles guest CTA)
S0_NEW / S1_DEPOSITED        → <OnboardingCard />     (activation first)
activated + hasPosition      → <PositionAlertCard />  (daily re-entry)
activated + no position      → null
loading                      → null
```

Priority: **Onboarding > PositionAlert**. Reasoning: an un-activated user with a stray demo/airdrop position should still see the deposit/first-trade nudge; once `S2_TRADED` / `S3_ACTIVE`, the position alert becomes the main personal signal.

Props: none. Internally uses `useAuth`, `useActivationState`, `usePositions` (same top-position selection logic currently in `MobileHome`).

### `src/pages/MobileHome.tsx`

- Remove the two conditional blocks (`PositionAlertCard` after search, `OnboardingCard` after Campaign rail).
- Remove now-unused imports + the `topPosition` / `hasPosition` derivation (moves into `PersonalSlot`).
- Insert `<PersonalSlot />` once, in a single `mt-3` slot between `HomeSearchBar` and `HomeCampaignRail`.

New section order:
```text
Greeting → Search → PersonalSlot → Campaign rail → TopEvents
```

### Untouched

- `OnboardingCard.tsx`, `PositionAlertCard.tsx` keep their own visibility guards (safe defense-in-depth, still reusable elsewhere).
- No data/hook/business-logic changes.

### Memory

Update `mem://features/home-page-purpose` to note: personal slot is single-card, onboarding-priority.