

## Add Pagination to Style Guide + Audit Project Usage

### Findings

**Pagination component** exists at `src/components/ui/pagination.tsx` but is **never used** anywhere in the project.

**Current pagination patterns in the project:**
1. **ResolvedPage** (`src/pages/ResolvedPage.tsx`) — uses a manual "Load More" button with `displayCount` state. Not using the Pagination component.
2. **PointsHistoryList** (`src/components/rewards/PointsHistoryList.tsx`) — no pagination at all, renders all entries.
3. **EventCard** — has a "show more options" collapse, not true pagination.

**Conclusion:** Only ResolvedPage has pagination-like behavior, using a custom "Load More" pattern. This is a valid UX choice (infinite scroll / load-more) and doesn't necessarily need to switch to numbered pagination. No changes needed to existing pages — the two patterns serve different purposes.

### Plan

#### 1. Add Pagination section to CommonUISection

Add a new `SectionWrapper` block at the end of `CommonUISection.tsx` with:

- **Interactive Playground**: A demo list of 50 items paginated with the `Pagination` component. Controls for:
  - Items per page (5 / 10 / 20)
  - Current page display with Previous / Next / numbered links / ellipsis
- **Quick Reference**: Show all sub-components (`PaginationPrevious`, `PaginationNext`, `PaginationLink`, `PaginationEllipsis`)
- **Usage Note**: Document when to use numbered Pagination vs "Load More" pattern, noting that ResolvedPage intentionally uses Load More for feed-style content
- **CodePreview**: Show import and basic usage snippet

#### 2. State additions at top of CommonUISection

Add `paginationPage` and `paginationPageSize` state variables for the playground.

#### 3. No changes to existing pages

ResolvedPage's "Load More" is appropriate for its feed-style UX. PointsHistoryList currently shows all entries which is fine for typical volumes. No refactoring needed.

