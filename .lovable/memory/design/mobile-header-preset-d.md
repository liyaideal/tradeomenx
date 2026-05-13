---
name: Mobile header Preset D · Home Equity Hero
description: Locked spec for `/` (MobileHome). Header uses standard Preset A (`<MobileHeader>`); Total Equity KPI lives in non-sticky `<HomeEquityHero>` card as the first body section. Do NOT reuse Hero on other pages, do NOT put KPI back into header. Source of truth: DESIGN.md §10 + StyleGuide → Mobile Patterns → "Header Preset D".
type: design
---

**Components:**
- `src/pages/MobileHome.tsx` — uses `<MobileHeader showLogo showBack={false} rightContent={headerActions} />`
- `src/components/home/HomeEquityHero.tsx` — Hero card, only used by `/`

**Locked tokens for `<HomeEquityHero>` (do not change without updating DESIGN.md and StyleGuide playground first):**

- Container: `rounded-2xl border border-border/40 bg-gradient-to-br from-trading-green/[0.04] via-card/40 to-card/20 px-5 pt-5 pb-5`
- Label "Total equity": `font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground`
- Main number: `font-mono text-[40px] font-bold tracking-tight leading-none text-foreground mt-2` — **max 40px**
- Meta row: `mt-3 flex items-center gap-2.5 font-mono text-[12px]`, format `today PnL · 7D %`
- Today PnL: `font-semibold text-trading-green/red`
- Separator: `·` with `text-muted-foreground/40`
- 7D label: `font-semibold text-muted-foreground` with inline colored percentage
- Logged-out CTA: same shell + `border-trading-green/30 from-trading-green/[0.08]`
- **Not sticky** — scrolls away with the page

**Header (separate concern):**
- `/` uses standard Preset A `<MobileHeader>` with `showLogo`, `showBack={false}`, `rightContent={headerActions}` (Discord / Globe / Bell)
- Mainnet badge comes from `<Logo showMainnetBadge={true}>` default — do NOT add a custom Mainnet pill in MobileHome

**Don't:**
- Do not reuse `<HomeEquityHero>` on `/events`, `/portfolio`, `/leaderboard`, `/wallet` — `/` only.
- Do not put the KPI back into the sticky header.
- Do not add Available / Locked / Trial Bonus / position counts into Hero — those belong to `<HomeAccountHub>`.
- Do not merge Onboarding / Airdrop / Campaign banners into Hero — keep three-layer stack independent.
- Do not add shadow / glow / animation to the number.
- Do not enlarge past `text-[40px]`.

**Workflow for any future change:** edit DESIGN.md §10 spec → update StyleGuide playground → update component. All three must stay in sync.
