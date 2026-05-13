---
name: Mobile header Preset D · Home KPI
description: Locked spec for `<HomeKPIHeader>` on `/` (MobileHome). Two-row sticky header (brand + Mainnet pill / Total Equity KPI). Do not reuse on other pages and do not enlarge to text-4xl. Source of truth: DESIGN.md §10 + StyleGuide → Mobile Patterns → "Header Preset D".
type: design
---

**Component:** `src/components/home/HomeKPIHeader.tsx` — only used by `/` (MobileHome).

**Locked tokens (do not change without updating DESIGN.md and StyleGuide playground first):**

- Container: `px-4 pt-3 pb-3`, `bg-background/85 backdrop-blur-xl`, `border-b border-border/40`, sticky `z-40`
- Mainnet pill: `border-trading-green/30 bg-trading-green/10`, text `font-mono text-[9px] uppercase tracking-[0.18em] text-trading-green`
- KPI label "Total equity": `font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground`
- KPI number: `font-mono text-[26px] font-semibold tracking-tight leading-none` — **never enlarge to text-4xl**
- Weekly PnL amount: `font-mono text-xs font-medium`, trading-green/red
- Weekly PnL %: right-aligned `font-mono text-[10px] uppercase tracking-wider text-muted-foreground`, prefix `7d`
- Row gap: `mt-3` between brand row and KPI row

**Don't:**
- Do not reuse `<HomeKPIHeader>` on `/events`, `/portfolio`, `/leaderboard`, `/wallet` — those use Preset A (`<MobileHeader>`).
- Do not stuff Onboarding / Airdrop / Campaign banners inside the header — they live as separate sections (`HomeOnboardingStrip`, `HomeAirdropStrip`, `CampaignBannerCarousel`).
- Do not add gradients / shadows / glows to the KPI number.
- Do not add Available / Locked / Trial Bonus sub-rows here — those belong to `HomeAccountHub`.

**Workflow for any future change:** edit DESIGN.md §10 spec → update StyleGuide playground → update component. All three must stay in sync.
