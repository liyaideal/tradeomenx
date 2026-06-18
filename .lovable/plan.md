### 1. SEO & Meta Configuration
- **Metadata Management**: The current `HedgeLanding.tsx` uses `useEffect` to manually inject `document.title` and `meta[name="description"]`. I will refactor this to use `react-helmet-async` for cleaner per-route SEO management (title, description, OG tags, Twitter cards).
- **Meta Updates**:
    - **Title**: "Hedge Your Polymarket World Cup Pick | OMENX — Redeem up to 500U"
    - **Description**: "World Cup upsets wiping out your Polymarket picks? Connect your wallet on OMENX, open a hedge, and redeem rewards up to 500U if it closes in profit. Not guaranteed."
    - **Open Graph**: Set `og:title` and `og:description` as requested.
    - **Keywords**: Inject targeted keywords (`leveraged prediction market`, `Polymarket hedge`, etc.) via meta tag.
- **Alt Text**: Update the hero graphic in `HedgeHero.tsx` with the specified alt text.

### 2. URL Strategy
- **Routing**: Update `src/App.tsx` to mount `HedgeLanding` at `/campaign/world-cup-polymarket-hedge`.
- **Legacy Support**: Add a redirect or keep `/hedge` pointing to the same component to ensure old links don't break.
- **Canonical**: Set the canonical URL to the new slug.

### 3. Visual Text Adjustments
- **Hero Paragraph**: Update the hero copy to include "Polymarket" before "wallet" as requested in the follow-up.

### Technical Details
- **Dependency**: `bun add react-helmet-async` if not present.
- **Structure**:
    - `src/App.tsx`: Route updates.
    - `src/pages/HedgeLanding.tsx`: Helmet implementation.
    - `src/components/hedge/HedgeHero.tsx`: Alt text and hero text updates.
