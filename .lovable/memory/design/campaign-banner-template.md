---
name: Campaign banner unified template
description: Homepage campaign banner standard — full-card cinematic background image with left gradient mask, fallback bordered tile visual
type: design
---

All homepage campaign banners must use the unified `CampaignBannerCarousel` template in `src/components/campaign/CampaignBannerCarousel.tsx`.

## Layout skeleton (fixed)

3-layer card on desktop:
1. Full-card background image (`object-cover object-right`)
2. Left→right surface gradient mask (`from-{surface} from-30% via-{surface}/85 via-55% to-transparent`) — guarantees text contrast on the left
3. Dotted grid overlay at 15% opacity (vs 30% when no bg image)

Content column sits on top, constrained to `sm:max-w-[60%]`:
- `[qualifierChip?][countdown? on mobile]` meta row
- title (≤7 words)
- heroMetric (one number + label)
- CTA button + optional countdown

## Differentiation per campaign comes from only three things

1. `theme: "gold" | "primary" | "green" | "violet"` — drives metric color, CTA color, border, gradient mask color
2. `backgroundImage: string` — **preferred**. Full-card cinematic image meeting the spec below
3. `visual: ReactNode` — fallback only. Pick from `DiagramVisual` / `HeroObjectVisual` when no `backgroundImage` exists yet

## Background image hard requirements (verification checklist)

Every new banner image must pass all of these before being committed:

1. **Aspect ratio**: 16:9, minimum 1600×900
2. **Subject placement**: anchored to RIGHT 35-40% of frame, may bleed off right edge
3. **Left dark zone**: LEFT 50%+ must be pure black or extremely dark surface — no light spill, particles, text, or UI residue
4. **Light**: single direction (typically upper-right), monochromatic — warm gold for `gold` theme, theme neon for others
5. **Depth**: shallow DOF, subject sharp, background blurred
6. **Forbidden**: text, letters, numbers, logos overlay, UI cards, charts, frames, borders, rounded corners, drop shadows, sticker outlines, emoji
7. **File**: `.jpg`, <400KB, named `banner-{campaign-id}.jpg`, stored in `src/assets/`
8. **Mobile**: bg image is **not** rendered on mobile — banner falls back to plain text card. Don't optimize the image for small screens.

## Reusable AI prompt template (image-to-image)

When asked for a new banner image prompt, fill these 4 slots and hand the prompt + the campaign's main visual reference image to the user:

```
[Image-to-image edit]

Reference image: [user uploads the campaign's main visual]

Task: Transform this reference into a cinematic 16:9 banner background.

Subject: Keep the {SUBJECT_DESCRIPTION} from the reference exactly as it is — preserve all materials, engravings, branding, and lighting character.

Composition:
- Aspect ratio 16:9, minimum 1600x900
- Place the subject anchored to the RIGHT 35-40% of the frame, slightly tilted, can partially bleed off the right edge
- Add environmental context behind/beneath the subject: {SCENE_CONTEXT}, shallow depth of field
- LEFT 55-60% of the frame must fade to PURE SOLID BLACK (#0A0A0A) — no light spill, no particles, no objects, no text. This is the text reservation zone.
- Single {LIGHT_DIRECTION_AND_COLOR}, cinematic, slightly desaturated, monochromatic {DOMINANT_COLOR} + black palette

Hard constraints (do not violate):
- NO added text, letters, numbers, logos, watermarks
- NO UI elements, cards, charts, icons, shields, badges
- NO frames, borders, rounded corners, drop shadows, sticker outlines
- NO additional foreground objects in the left 55%
- Output must feel like one continuous environmentally-lit scene, not a subject pasted onto a background
- Preserve the engravings/branding that exist on the original subject (those are product identity, not overlay text)
```

Slot examples:
- `SUBJECT_DESCRIPTION` → `"gold OMENX coin with all engravings (OMENX, MAINNET, 2026)"` / `"purple neon protective chamber with violet particles"`
- `SCENE_CONTEXT` → `"a pile of out-of-focus gold coins on a dark reflective surface"` / `"faint volumetric purple fog and ground reflections"`
- `LIGHT_DIRECTION_AND_COLOR` → `"warm gold rim light from upper-right"` / `"neon purple rim light from upper-right"`
- `DOMINANT_COLOR` → `"warm gold"` / `"violet/purple"`

## Iteration workflow

1. Pick campaign + main visual reference → ask agent for the filled prompt
2. Run prompt + reference through nano banana / gemini-3-pro-image-preview
3. Send the chosen image back to agent
4. Agent saves to `src/assets/banner-{id}.jpg` and adds the banner config with `backgroundImage`

## Copy limits (hard)

- title ≤ 7 words
- ctaLabel ≤ 2 words
- heroMetric.value ≤ 6 chars
- qualifierChip.text ≤ 3 words

## Meta row chip rules (qualifierChip)

Meta row holds at most ONE chip. Test before adding: "Can the user infer this from the title or heroMetric?" If yes → don't add it.

**Allowed:**
1. Eligibility gate — `No deposit`, `New users only`, `Verified only`
2. Effort required — `One trade`, `5 minutes`, `First deposit`
3. Scarcity — `5 winners weekly`, `First 1,000 users`, `Limited slots`

**Forbidden:**
- In-app status (`Live`, `Active`, `Open`) — always true, zero info
- Campaign category names (`Mainnet Launch`) — duplicates title
- Any monetary amount — that's heroMetric's job
- Fabricated social proof (`2,341 joined`)

If no compliant chip exists, omit it.

## Mobile layout

- Background image NOT rendered on mobile
- Single column, CTA full-width
- Countdown moves into meta row top-right (not below CTA)
- No `absolute` positioned elements in CTA row

## Forbidden

- Per-banner bespoke layouts (e.g. `isLaunch` branches)
- More than one heroMetric, subtitles, or descriptions
- Embedding text/CTA inside artwork
- Background images that violate the hard requirements above
