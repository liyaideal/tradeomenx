## Goal
Give the Mainnet Launch page a proper mobile design pass — eliminate awkward line breaks, oversized hero, cramped tables, and information-dense desktop layouts that don't translate to a 390px viewport.

## Issues observed on mobile (390px)
1. **Hero** — coin is huge and pushes CTA below fold; headline manually breaks at weird spots; the "Ends in 22d 22:19:36" pill + green status row wrap clumsily; long body copy line breaks awkwardly.
2. **Section titles** — `text-2xl` works, but `eyebrow` + `title` + `desc` block has too much vertical space (`mb-7`) before content.
3. **RewardSnapshot cards** — `p-6` + lots of gap inside makes two stacked cards span nearly two screens.
4. **HowItWorks** — three cards each `p-6` = ~3 full screens of identical-looking blocks.
5. **RewardLadder** — 7 rows × 3 columns (`1.4fr_0.8fr_1.6fr`) on 390px squeezes the progress bar to ~80px, "Top tier" / "You're here" labels truncate.
6. **TrustAndRules** — right card uses `grid-cols-[120px_1fr]` which forces narrow text column; 4 trust cards in 2×2 cramped.
7. **FinalCTA timeline** — 3-column grid with left/center/right alignment makes the middle "Day X of 14" text overlap dot positions; dates wrap.
8. **MobileFloatingCTA** — already exists, but main content has no bottom padding so the last section sits behind it.

## Changes (file-by-file, mobile-only — desktop untouched)

### 1. `src/components/mainnet-launch/Hero.tsx`
- Reduce mobile hero vertical padding (`pt-7 pb-12` → `pt-5 pb-8`).
- Replace the right-column coin (currently `hidden` on mobile via grid? no — it's shown always) with a **mobile-specific compact treatment**:
  - On `<lg`: render coin as a **140×140px chip** floated to the right of the headline area, OR placed above the eyebrow centered at `max-w-[160px]`. Choose: **above the eyebrow, centered, 160px**, so the page reads coin → badge → title → body → CTA → meta.
  - On `lg+`: keep current right-column behavior.
- Fix headline forced wrap: remove the visual break — let it wrap naturally. Drop `text-[2.75rem]` to `text-[2.25rem]` on mobile so "Your first trade pays you back." flows in 3 lines, not awkward 2.
- "Ends in" pill: on mobile turn into a **sub-row under the CTA button** — small `text-[10px]` mono, single line, no border box. Keeps the gold CTA as the only large element.
- Status row ("Live on mainnet · withdraw anytime" / "Paid out every day at 18:00 UTC+8"): on mobile stack as two single lines, smaller mono `text-[10px]`, no flex-wrap mid-sentence.
- Body copy: shorten the wrap by tightening `max-w-` and using `text-base` (not `text-lg`) on mobile.

### 2. `src/components/mainnet-launch/SectionShell.tsx`
- `SectionTitle`: shrink mobile `mb-7` → `mb-5`, eyebrow `mb-3` → `mb-2`, desc `mt-4` → `mt-3`.
- `SectionShell`: mobile `py-12` → `py-10`.

### 3. `src/components/mainnet-launch/RewardSnapshot.tsx`
- Mobile card padding `p-6` → `p-5`; internal `space-y-5` → `space-y-3.5`.
- Reward number `text-3xl` → `text-[28px]` on mobile so it fits one line.
- Eyebrow chip `mb-6` → `mb-4`.
- "See the 3 steps" link `mt-7` → `mt-5`.

### 4. `src/components/mainnet-launch/HowItWorks.tsx`
- On mobile, switch from 3 stacked full cards to a **compact horizontal-numbered list**:
  ```
  01  Sign up & deposit
      30-second signup. Email is enough — no KYC for the bonus.
  ─────────────────
  02  Trade $5K volume
      Any market, any leverage. Open and close adds to your volume.
  ─────────────────
  03  Get paid daily
      USDC shows up in your account by 18:00 UTC+8 the next day.
  ```
  - Drop the icon on mobile (number + title is enough), keep on desktop.
  - Use a single bordered container with horizontal dividers between rows.
- Desktop layout (`md:grid-cols-3` cards) unchanged.

### 5. `src/components/mainnet-launch/RewardLadder.tsx`
- On mobile, **drop the Progress column entirely** and switch to a 2-column layout: `Volume` | `Rebate`. Replace per-row progress bar with a thin gold left-border on rows `reached/active`. The "You're here" / "Top tier" pill moves inline next to the rebate value.
- Header row: only `Volume` and `Rebate` on mobile; show `Progress` only at `md+`.
- Bottom CTA card: stack vertically (already does), but reduce padding `p-4` → `p-4` (already fine), set CTA button height to `h-11` on mobile.

### 6. `src/components/mainnet-launch/TrustAndRules.tsx`
- `trust` 2×2 grid: switch to single-column on mobile (`grid-cols-1 sm:grid-cols-2`).
- `rules` grid `[120px_1fr]`: on mobile change to single-column rows where the label sits above the body (`grid-cols-1 md:grid-cols-[120px_1fr]`), label with `mb-1`.

### 7. `src/components/mainnet-launch/FinalCTA.tsx`
- Hero card: keep stacked layout (already `md:grid-cols`), reduce mobile heading `text-3xl` → `text-2xl`.
- Timeline: on mobile, switch from 3-column horizontal to a **vertical list** (3 stacked rows, dot on left, label/date on right). The horizontal connector line is desktop-only.

### 8. `src/components/mainnet-launch/FAQ.tsx`
- Trigger `text-sm` is fine; reduce trigger vertical padding `py-5` → `py-4` on mobile.

### 9. `src/pages/MainnetLaunch.tsx`
- Add `pb-24 md:pb-0` to `<main>` so the last section isn't hidden behind `MobileFloatingCTA`.

## Out of scope
- No copy changes (only layout/sizing).
- No new components.
- Desktop appearance must remain identical.
- `ProgressDashboard` already only renders for qualified users; will inherit the new `SectionShell` mobile spacing automatically — no further change needed.

## Verification
After implementation, view at 390px width and confirm:
- Hero CTA is above the fold
- No mid-sentence awkward wraps in headline / status rows
- RewardLadder readable end-to-end without horizontal scroll
- Last section has breathing room above the floating CTA
