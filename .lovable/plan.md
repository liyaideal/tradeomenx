## Goal
Replace the right-side `RewardMeter` in the mainnet launch Hero with the new transparent OMENX gold coin image, while keeping reward info accessible elsewhere on the page.

## Steps

1. **Add the asset**
   - Copy the uploaded image to `src/assets/mainnet-coin.png` (transparent PNG, used via ES6 import).

2. **Rework `src/components/mainnet-launch/Hero.tsx` right column**
   - Remove `<RewardMeter />` from the Hero.
   - Replace it with a centered coin visual:
     - `<img src={coin} />` at full container width, max ~520px, `select-none`, `pointer-events-none`, `loading="eager"`.
     - Wrap in a relative div with:
       - A soft gold radial glow behind it (`bg-[radial-gradient(circle,hsl(var(--mainnet-gold)/0.35),transparent_65%)] blur-2xl`) so the coin sits on its own halo and merges with the existing Hero gold light in the top-right.
       - Subtle drop-shadow on the img: `drop-shadow(0_30px_60px_hsl(var(--mainnet-gold)/0.25))`.
     - Float animation (reuse the `hedge-float` pattern: 6s ease-in-out infinite, ±8px translateY) defined via a scoped `<style>` block as `mainnet-coin-float`.
     - Optional very slow rotate-y shimmer kept off for now to avoid distortion of the embossed text.
   - Keep the existing grid + radial Hero background as-is — the transparent PNG will sit cleanly on top.

3. **Preserve reward info on the page**
   - `RewardMeter` is currently only used in `Hero`. Since `RewardSnapshot` + `ProgressDashboard` already cover the reward breakdown right below the Hero, do not relocate the meter — just delete its import from Hero. Leave the `RewardMeter.tsx` file in place (unused) so nothing else breaks; we can clean it up later if desired.

4. **Mobile behavior**
   - On `<lg` the layout becomes single-column. The coin renders below the headline at a smaller max-width (~280px) and centered, so mobile users still see the visual without pushing the CTA below the fold. Apply `max-w-[280px] lg:max-w-[520px] mx-auto`.

## Technical notes
- File: `src/components/mainnet-launch/Hero.tsx` — remove `RewardMeter` import, add `import coinImage from "@/assets/mainnet-coin.png"`, replace right column markup.
- New asset: `src/assets/mainnet-coin.png`.
- No changes to `MainnetLaunch.tsx`, no new dependencies, no design tokens added (uses existing `--mainnet-gold`).

## Out of scope
- Deleting `RewardMeter.tsx`.
- Any changes to other sections (RewardSnapshot, ProgressDashboard, etc.).
