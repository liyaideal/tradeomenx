# Fix "No 7D activity" wrapping in authed empty state

## Problem

In the authed-but-no-data branch, the row uses `flex items-end justify-between gap-3` with a left text column and a right `h-12 w-24` sparkline. When there's no 7D data, the sparkline only renders a dashed placeholder line — visually meaningless — but it still takes a fixed 96px of width. The remaining space on a 390px mobile card forces the message "No 7D activity — Tap deposit to start" (rendered as two adjacent spans, no `whitespace-nowrap`) to wrap into 3 lines, which is what the screenshot shows.

## Fix

Treat the empty state differently from the data state — collapse the placeholder sparkline so the line fits.

1. `src/components/home/HomeGreeting.tsx` (authed branch, lines ~140–224)
   - Render the sparkline `<div className="relative h-12 w-24 …">` only when `hasData && line` is true. Drop the dashed placeholder block entirely; it carries no information.
   - In the no-data inline message (lines 163–170), make it a single `<p>` with `whitespace-nowrap` so the two parts can never wrap. Slightly tighten copy to "No 7D activity · Tap Deposit to start" (single line, mid-dot separator) and use the existing tokens (`text-muted-foreground` for the prefix, `text-primary` for the CTA fragment).

2. `src/pages/StyleGuide/sections/MobileHomeSection.tsx` (authed replica, lines ~141–204)
   - Mirror the same change in the static replica so the playground previews match production for the "Authed · no 7D data" toggle.

Net effect: in the empty state the balance keeps full width, the CTA hint sits on a single line directly under the equity number, and the dashed placeholder graphic disappears. The data state is unchanged.

## Out of scope

- Guest branch and the data-present authed branch are untouched.
- No copy or layout changes elsewhere in HomeGreeting.