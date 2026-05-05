## Goal
Mask the jagged alpha edges on the coin PNG by stacking a blurred "halo" copy of the same image behind a crisp top copy in `Hero.tsx`.

## Change (single file: `src/components/mainnet-launch/Hero.tsx`)

Inside the existing coin wrapper (`relative mx-auto w-full max-w-[280px] lg:max-w-[520px]`), replace the single `<img>` with two stacked copies:

1. **Bottom layer — feathering halo**
   - Same `coinImage` source, `aria-hidden`
   - Absolutely positioned, `scale-[1.025]`, `opacity-90`
   - Filter: `blur(6px) saturate(1.1) drop-shadow(0 0 24px hsl(var(--mainnet-gold)/0.45))`
   - This creates a soft golden glow that exactly traces the coin's silhouette, hiding the hard alpha edge.

2. **Top layer — crisp coin**
   - Same `coinImage` at full size, `relative` so it stacks above the halo
   - Filter: `drop-shadow(0 30px 60px hsl(var(--mainnet-gold)/0.28)) blur(0.4px)`
   - The 0.4px blur is sub-pixel — smooths remaining aliasing without visibly softening the embossed text.

Keep the existing radial gold halo div behind both layers for ambient bloom.

## Out of scope
- No changes to other components.
- Not regenerating the asset (that would be plan B if this isn't enough).
