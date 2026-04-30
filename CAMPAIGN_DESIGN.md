# OmenX Campaign Landing Design System

> Dedicated design specification for campaign landing pages and homepage campaign banners. Keep this separate from `DESIGN.md`, which remains the product UI system.

---

## 1. Purpose

Campaign landing pages are conversion microsites, not product screens. Their job is to move a user through one clear action with a confident visual narrative.

- **Primary use cases**: mainnet launch, trading competitions, referral campaigns, reward campaigns, seasonal activations.
- **Primary conversion**: one action per campaign, usually sign up, start trading, connect account, or claim reward.
- **Design tone**: premium exchange campaign, editorial finance, precise ledger language.
- **Do not imitate**: generic crypto launch pages, AI template pages, outsourced banner art, random card grids.

---

## 2. Separation from Product Design

`DESIGN.md` is for the core product: trading UI, wallet, portfolio, settings, transparency, data tables.

`CAMPAIGN_DESIGN.md` is for campaign surfaces only:

- `/mainnet-launch`
- `/hedge`
- future campaign landing pages
- homepage campaign carousel slides
- campaign-specific modals or final CTA blocks

Campaign pages may reuse brand tokens, auth flows, and product data, but they must not blindly reuse product page composition.

### Forbidden cross-contamination

- Do not use product desktop page title pattern with the purple left rail.
- Do not use `.trading-card`, `.stats-card`, or dense product cards as the main section language.
- Do not copy product list-page spacing into campaign sections.
- Do not add campaign-specific rules to the main `DESIGN.md` except for a short pointer to this document if needed.

---

## 3. Page Architecture

A campaign page should follow a clear narrative arc:

1. **Hero** — what this campaign is, why it matters, primary CTA.
2. **Proof / Trust** — concrete facts, not vague claims.
3. **Mechanism** — how the user qualifies.
4. **Reward Ledger** — reward amounts, status, tiers, payout timing.
5. **Rules** — constraints in plain language.
6. **FAQ** — technical details and edge cases.
7. **Final CTA** — one final conversion moment.

Each section must earn its place. If it does not help conversion or reduce confusion, remove it.

---

## 4. Layout Rules

### Safe width

- Desktop safe container: `max-w-7xl`.
- Desktop horizontal padding: `px-8`.
- Mobile horizontal padding: `px-5`.
- Every campaign page root must include `w-full max-w-full overflow-x-hidden`.
- Every full-width section must include `w-full max-w-full overflow-hidden`.
- All CSS grids must use `minmax(0, …)` when columns can shrink.

### Section spacing

- Desktop sections: `py-20`.
- Mobile sections: `py-12`.
- Hero desktop top/bottom may be larger, but must still reveal the next section on common desktop and mobile viewports.

### Section header rule

Campaign section headers are vertical:

```tsx
eyebrow
Title
Description
```

**Never place the title and description side by side in two columns** unless a specific signed-off editorial mockup requires it.

### Avoid card stacking

- Do not put cards inside cards.
- Do not make entire page sections floating cards.
- Use framed panels only for repeated items, ledgers, dashboards, and CTAs.

---

## 5. Typography

- Use `font-sans` for campaign headlines and explanations.
- Use `font-mono` only for amounts, dates, status tags, addresses, short tickers, and ledger values.
- Hero title: large, confident, short. Prefer the campaign name or literal offer.
- Section title: clear, editorial, not slogan-heavy.
- Body copy: direct and human. Avoid inflated marketing copy.

### Casing

- Eyebrows: uppercase mono, short only.
- Section titles: Title Case only when they are headings.
- Descriptions: sentence case.
- Data labels: short uppercase mono.

---

## 6. Visual Language

Campaign pages should have one coherent metaphor per campaign.

Examples:

- **Mainnet Launch**: launch console, ledger, settlement window, production switch.
- **Trading Competition**: scoreboard, bracket, rank table, arena lights.
- **Referral Campaign**: network graph, invite chain, payout tree.
- **Rewards Campaign**: vault, credit ledger, payout queue.

### Forbidden generic motifs

- Rocket illustrations.
- Emoji rewards or emoji section labels.
- Random purple-blue gradients.
- Floating glass cards without purpose.
- Glowing orb backgrounds.
- Fake 3D coins/gifts unless custom-directed.
- Stock-looking images unrelated to the actual campaign.
- Overdecorated banners with too many badges and CTAs.

---

## 7. Campaign Components

Use dedicated campaign-system components for new campaign pages:

- `CampaignPageShell`
- `CampaignSection`
- `CampaignSectionHeader`
- `CampaignMetricStrip`
- `CampaignLedgerPanel`
- `CampaignCTA`
- `CampaignBannerFrame`

Do not rebuild campaign section structure with ad hoc Tailwind each time.

---

## 8. Homepage Campaign Carousel

Homepage campaign slides are compact campaign entries, not separate ad posters.

Rules:

- The slide must use the same visual language as the landing page.
- It must fit within the same safe width as the event list.
- It must not create horizontal overflow at `1024px`, `1280px`, `1366px`, or mobile widths.
- One primary CTA only.
- No dense text blocks; use one headline and a small ticker strip.

---

## 9. Reward and Rules Presentation

Reward modules must feel like payout ledgers, not coupon cards.

Required clarity:

- Qualification threshold.
- Whether rewards are guaranteed or probabilistic.
- Whether tiers are cumulative.
- Volume formula if relevant.
- Payout timing.
- Exclusions such as wash trading.

Keep technical formulas out of the hero. Put formulas in FAQ or rules.

---

## 10. Responsive QA Checklist

Before shipping any campaign page, check:

- `1024 × 768`: no horizontal scrollbar; header and page safe area align.
- `1280 × 720`: hero fits and next section is hinted.
- `1366 × 768`: section rhythm does not feel sparse.
- `390 × 844`: headline wraps cleanly; CTA is reachable.
- `320 × 568`: no clipped CTA text or overlapping badges.
- Homepage carousel: both first and second slides fit at desktop and mobile.

---

## 11. Quality Bar

A campaign page is not acceptable if it looks like:

- a generic AI landing page,
- a crypto template,
- an outsourced one-off banner,
- a product settings page with larger text,
- or a collection of unrelated cards.

It is acceptable only when it has a clear campaign concept, restrained hierarchy, strong typography, and reusable campaign-system structure.
