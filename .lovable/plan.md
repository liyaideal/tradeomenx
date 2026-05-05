## Goal
On mobile (`<lg`), drop the large floating gold coin at the top of the Hero — it eats nearly half a screen and pushes the headline + CTA below the fold. Desktop layout stays untouched.

## Change

**`src/components/mainnet-launch/Hero.tsx`**
- Delete the entire mobile-only coin block (lines 17–52, the `<div className="relative flex justify-center lg:hidden">…</div>` wrapper and its contents).
- Keep the radial gold glow at the top of the section (line 14) so the page still has a warm gold accent where the coin used to be — this preserves the premium feel without taking real estate.
- Reduce hero top padding slightly: `pt-5` → `pt-6` on mobile so the eyebrow pill has a bit of breathing room now that the coin is gone (kept conservative).
- Desktop coin block (lines 99–134) is unchanged.

## Result
Mobile hero starts directly with the `MAINNET LAUNCH · MAY 14 – 28` eyebrow pill, then headline, body copy, CTA, countdown and status lines — all visible much higher up. Desktop is unchanged.

No other files need to change.