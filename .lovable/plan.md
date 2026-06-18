## Context

The mainnet-launch banner has already been removed. The hedge banner is now the only item in both:
- **Desktop**: `CampaignBannerCarousel` on `/events` (full-width ~220px tall card)
- **Mobile**: `HomeCampaignRail` on mobile home (260×140 snap card)

The hedge landing page (`/campaign/world-cup-polymarket-hedge`) already has a bold **retro poster aesthetic**: cream `#FDFCF0`, thick black border, red hard offset shadow, rotated sticker chips, bold display uppercase type. The user wants the carousel banner redesigned to match this energy.

## Scope

Redesign the hedge campaign banner card (both desktop carousel and mobile rail) with **one** of the 3 directions below. The content stays fixed:
- Headline: "Hedge your prediction trades. Free."
- Metric: "$100 Free hedge credit"
- CTA: "Open Hedge"
- Chip: "NO DEPOSIT"

## Three Design Directions

### Direction A: Retro Poster (matching HedgeHero)
Cream `#FDFCF0` surface, thick black border `border-[#0E0E0E]`, hard red offset shadow `box-shadow: 8px 8px 0 0 #E11D48` (desktop) / `6px 6px` (mobile). Rotated red sticker chip at top-left. Bold uppercase display headline with a single blue `#1D4ED8` accent word. Yellow left-border `#FACC15` on the metric sub-line. Black CTA button with cream text, arrow nudges right on hover.

**Feel**: Bold, playful, poster-like. High contrast, immediately grabs attention. Makes the banner feel like a collectible trading card.

### Direction B: Dark Neon Glass
Deep translucent dark surface (`bg-background/80` with `backdrop-blur-md`), thin neon accent border that glows on hover (cyan `#22d3ee` or violet `#a78bfa`). Subtle dot-grid texture at low opacity. The metric "$100" gets a large neon glow treatment. CTA is a filled neon pill button. Right side has a geometric shield/insurance icon pattern.

**Feel**: Premium, modern, Web3-native. Sophisticated and futuristic. Blends into the dark app while standing out through neon glow.

### Direction C: Editorial Swiss
Pure light surface (`bg-card` or off-white) on the dark page. Ultra-thin 1px border. Generous negative space. Headline is whispered (small, uppercase, wide tracking) while "$100" is the single massive typographic moment. Everything else is restrained. A single thin horizontal rule separates chip from headline.

**Feel**: Magazine-quality, confident through restraint. The contrast between the dark page and the light card is the statement. Appeals to users who appreciate precision and minimalism.

## Implementation (after direction is chosen)

1. **Update `banners.ts`**: Adjust the hedge entry (title, theme key, drop or keep background image).
2. **Extend `themeMap` in `CampaignBannerCarousel.tsx`**: Add a new theme entry for the chosen direction, or branch on `banner.id === "hedge"` for a dedicated layout.
3. **Update `HomeCampaignRail.tsx`**: Mirror the same visual treatment in the 260×140 mobile card (simplified due to space constraints: drop sticker cluster, keep colors/border/shadow).
4. **Build + verify**: Check desktop `/events` and mobile home, confirm no layout shift, clickable area still routes correctly.

## Out of Scope
- No new copy changes beyond what's listed.
- No changes to HedgeHero or the hedge landing page.
- No changes to carousel mechanics (dots, auto-scroll, snap behavior).