---
name: Campaign banner unified template
description: Homepage campaign banner standard — two-column skeleton with theme + visual slot, no full-bleed background photos
type: design
---

All homepage campaign banners must use the unified `CampaignBannerCarousel` template in `src/components/campaign/CampaignBannerCarousel.tsx`.

**Skeleton (fixed, do not customize per campaign):**
- Left column (1fr): `[qualifierChip?][countdown? on mobile]` meta row → title (≤7 words) → heroMetric (one number + label) → CTA button + optional countdown.
- Right column (220-300px): visual slot. Hidden on `< sm` to avoid overlap.

**Differentiation per campaign comes from only two things:**
1. `theme: "gold" | "primary" | "green" | "violet"` — drives metric color, CTA color, border, visual slot accent. Add new theme keys in `themeMap` only.
2. `visual: ReactNode` — pick one of the reusable primitives: `IconTileGrid`, `DiagramVisual`, `HeroObjectVisual`. New primitives may be added but must follow the same `min-h-[140px]` bordered tile shape.

**Forbidden:**
- Full-bleed photographic background images on banners.
- Per-banner bespoke layouts (e.g. `isLaunch` branches with absolute-positioned CTAs).
- More than one heroMetric, subtitles, or descriptions.
- Embedding text/CTA inside artwork.

**Copy limits (hard):** title ≤ 7 words, ctaLabel ≤ 2 words, heroMetric.value ≤ 6 chars, qualifierChip.text ≤ 3 words.

## Meta row chip rules (qualifierChip)

Meta row holds at most ONE chip — `qualifierChip`. Its job is to deliver information the user CANNOT derive from `title` or `heroMetric`. Apply this test before adding a chip: "Can the user infer this from the title or heroMetric?" If yes → don't add it.

**Allowed content (3 categories only):**
1. **Eligibility gate** — `No deposit`, `New users only`, `Verified only`
2. **Effort required** — `One trade`, `5 minutes`, `First deposit`
3. **Scarcity** — `5 winners weekly`, `First 1,000 users`, `Limited slots`

**Forbidden chip content:**
- In-app status (`Live`, `Active`, `Open`, `Available`) — always true on this site, zero info.
- Campaign category names (`Mainnet Launch`, `Hedge Campaign`) — duplicates the title.
- Any monetary amount — that's `heroMetric`'s job, never duplicate.
- Fabricated social proof (`2,341 joined`) — never invent numbers.

If no compliant chip exists for a campaign, **omit it** — meta row stays empty (countdown still pinned right on mobile). Empty is better than redundant.

## Mobile layout
Visual slot hidden, single column, CTA full-width, countdown moves into meta row top-right (not below CTA). No `absolute` positioned elements in CTA row.
