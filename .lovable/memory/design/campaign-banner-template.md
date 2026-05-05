---
name: Campaign banner unified template
description: Homepage campaign banner standard — two-column skeleton with theme + visual slot, no full-bleed background photos
type: design
---

All homepage campaign banners must use the unified `CampaignBannerCarousel` template in `src/components/campaign/CampaignBannerCarousel.tsx`.

**Skeleton (fixed, do not customize per campaign):**
- Left column (1fr): `[eyebrow][status]` meta row → title (≤7 words) → heroMetric (one number + label) → CTA button + optional countdown.
- Right column (220-300px): visual slot. Hidden on `< sm` to avoid overlap.

**Differentiation per campaign comes from only two things:**
1. `theme: "gold" | "primary" | "green" | "violet"` — drives metric color, CTA color, border, visual slot accent. Add new theme keys in `themeMap` only.
2. `visual: ReactNode` — pick one of the reusable primitives: `IconTileGrid`, `DiagramVisual`, `HeroObjectVisual`. New primitives may be added but must follow the same `min-h-[140px]` bordered tile shape.

**Forbidden:**
- Full-bleed photographic background images on banners (was tried with mainnet coin photo — caused mobile overlap, desktop emptiness, and zero reusability).
- Per-banner bespoke layouts (e.g. `isLaunch` branches with absolute-positioned CTAs).
- More than one heroMetric, more than 2 meta chips, subtitles, or descriptions.
- Embedding text/CTA inside artwork.

**Copy limits (hard):** eyebrow ≤ 2 words, title ≤ 7 words, ctaLabel ≤ 2 words, heroMetric.value ≤ 6 chars.

Mobile: visual slot hidden, single column, CTA full-width, countdown stacked below CTA. No `absolute` positioned elements in CTA row.
