# Fix MAINNET badge overlap

## Root cause

`<Logo>` (`src/components/Logo.tsx`) now always renders the `MainnetBadge` next to the wordmark in an `inline-flex`. That makes the rendered logo ~70–90px wider than the bare image. Every place that was sized assuming "logo = image only" now overlaps with the adjacent element (centered title, neighbor table text, fixed-width preview cell, etc.).

The Logo component already exposes `showMainnetBadge?: boolean` (default `true`). The fix is: keep the badge where the logo stands alone (home headers, auth dialogs, footers, landing branding), and turn it off in any layout where the logo sits next to text or in a constrained cell.

## Issues found (full sweep)

Real production UI:
1. `src/components/MobileHeader.tsx` — `renderLeft()` Back + Logo branch (line 182) and Logo-only branch (line 197). When the header also has a centered `title` (Detail/Custom modes), the badge eats into the centered title space and visually overlaps. Home page (no title) is fine.

Style guide / docs (visible in user's screenshots):
2. `src/pages/StyleGuide/sections/MobilePatternsSection.tsx`
   - Logo Sizes grid, line 105 — the `lg`/`xl` cells overflow because the badge pushes content past the cell's centered area.
   - Spec table cell, line 465 — `<Logo size="sm" /> Logo` — badge collides with the trailing word "Logo".
   - Detail Page Header preview, line 592 — same pattern as the real `MobileHeader` Detail mode; centered title overlaps the badge.
   - Custom rightContent preview, line 610 — Logo + centered "Settings" title overlap.
   - Other previews on lines 143, 154, 165, 177, 531 are standalone — keep badge.
3. `src/pages/StyleGuide/sections/CommonUISection.tsx`
   - Spec table cell, line 2051 — same pattern as #2's table cell.
   - Share Poster mock header, line 1431 — Logo md + date pill on `ml-auto`; tight on narrow widths.
   - EventsDesktopHeader preview (line 1998) — has enough horizontal space, leave as-is.

Verified safe (logo standalone, no overlap):
- `src/pages/Rewards.tsx` (xl, centered)
- `src/components/auth/AuthSheet.tsx`, `src/components/auth/AuthDialog.tsx`
- `src/components/seo/SeoFooter.tsx`
- `src/components/EventsDesktopHeader.tsx` (desktop has gap-4/xl:gap-8 around it)
- `src/pages/StyleGuide/sections/MobileHomeSection.tsx`
- All raw `<img src={omenxLogo}>` usages (Leaderboard, SharePosterLayout, SettlementShareCard, EventShareCard, StyleGuide Logo asset previews) — no badge attached, untouched.

## Changes

1. `src/components/MobileHeader.tsx`
   - In `renderLeft()`, pass `showMainnetBadge={false}` to both `<Logo>` instances when the header has a `title` (i.e. Detail / Trade / Custom modes). Keep the badge when no title (Home).
   - Net effect: home header keeps the live-on-mainnet signal; any page that renders a centered title no longer collides with it.

2. `src/pages/StyleGuide/sections/MobilePatternsSection.tsx`
   - Logo Sizes grid (lines 96–113): change to `grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4` and add `overflow-visible` to each cell so the badge has room next to `lg`/`xl`. Keep badge on (the grid is meant to show the canonical logo).
   - Spec-table cell at line 465: `<Logo size="sm" showMainnetBadge={false} />`.
   - Detail Page Header preview at line 592: `<Logo size="md" showMainnetBadge={false} />`. This mirrors the production `MobileHeader` fix.
   - Custom rightContent preview at line 610: same — `showMainnetBadge={false}`.
   - Add a one-line caption under the Logo Sizes grid: "Mainnet badge is hidden when the logo sits next to a title or in a tight cell — pass `showMainnetBadge={false}`."

3. `src/pages/StyleGuide/sections/CommonUISection.tsx`
   - Spec-table cell at line 2051: `<Logo size="sm" showMainnetBadge={false} />`.
   - Share Poster mock header at line 1431: `<Logo size="md" showMainnetBadge={false} />` (matches the real poster which also renders the bare wordmark).

4. No backend/data changes. No new files. Default Logo behavior (`showMainnetBadge=true`) is preserved.

## Out of scope

- Not adding the badge to the existing raw `<img src={omenxLogo}>` usages (Leaderboard, share cards, poster). The user only asked us to repair existing overlap, not to spread the badge further.
- Not changing the badge's visual design or breathing animation.
- Not refactoring `MainnetBadge`'s `responsive` flag.

## Verification

After the edits, refresh `/style-guide` (Mobile Patterns + Common UI tabs) at 390px and at desktop, and visit any Detail-mode page (e.g. an event page on mobile) to confirm: home header still shows the badge; titled headers and doc previews no longer overlap; the Logo Sizes grid renders all four sizes with the badge fully visible.