---
name: H2E landing page architecture
description: /hedge page section order, anti-AI design tactics, and mock data conventions
type: design
---

`/hedge` (HedgeLanding) section order — **do not regress** to template-y card-grid layout:

1. **HedgeHero** — pain-point headline ("Lock in profit — on us"), live stats bar (mock), inline trust line (replaces former TrustBar)
2. **HedgeRecentActivity** — auto-scrolling marquee feed bar, dark `bg-card/60`
3. **HedgeHowItWorks** — horizontal connected steps with big `01/02/03` numbers + arrow connectors (NO icon squares, NO card grid)
4. **HedgeLiveExample** — uses MOCK testimonial `@cryptotrader_xyz` + "Average claim settled +$6.40 within 7 days" (replaces "You have nothing to lose. Literally.")
5. **HedgeFoundersNote** — first-person letter + MOCK treasury address `0x4A8b...c39D71` linking to Basescan (strongest anti-AI signal)
6. **HedgeKeyRules** — accordion: 6 rules split into eligibility (trading-green check, items 1-3) and reward mechanics (primary check, items 4-6). Risk & disclaimer collapsed into `<details>` at the bottom
7. **HedgeSocialProof** — 3 mock tweet/Discord cards (placeholder for real screenshots)
8. **HedgeFAQ** — `bg-card` (dark) to break the gray-rhythm monotony
9. **HedgeFinalCTA** — unchanged

Deleted files (do not recreate): `HedgeTrustBar.tsx`, `HedgeCampaignRules.tsx` (content merged into Hero inline trust + KeyRules accordion).

CTA budget = 3 only: Hero + FinalCTA + MobileFloatingCTA. Do NOT add CTAs to HowItWorks or KeyRules.

All mock data (`LIVE_STATS`, `FEED`, `QUOTES`, `TREASURY`) lives as top-of-file constants for ops to edit without touching JSX.
