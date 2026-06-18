# Plan: CSS Filter Softening for Hedge Hero Image

## Objective
Apply a very subtle CSS filter to the transparent hero PNG in `HedgeHero.tsx` to smooth its rough/jagged edges and make it look more professional.

## Implementation
1. **File to change:** `src/components/hedge/HedgeHero.tsx`
2. **Target element:** The `<img>` at lines 59–64 (World Cup graphic)
3. **Change:** Add a subtle `filter` style using a very slight `drop-shadow` (e.g. `filter: drop-shadow(0 0 3px rgba(253,252,240,0.8))`) that blends with the `#FDFCF0` background, softening the anti-aliasing edges without creating a visible halo.
4. **Alternative if drop-shadow doesn't blend well:** Use a tiny `blur` (e.g. `filter: blur(0.3px)`) on a duplicated wrapper image, or a wrapper `box-shadow` inset trick. Will test the visually cleanest option.
5. **Verify:** Screenshot the campaign page hero to confirm edges look smoother and the image remains fully visible without cropping.

## Scope
Frontend-only. No logic or data changes.