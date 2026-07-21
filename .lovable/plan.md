## Goal
Add a new "toast with help link" variant in the Style Guide's Toast section, showing an official EN restriction message with an inline action that navigates to the help center. Must render/behave correctly on both desktop and mobile.

## Scope
Frontend-only. Single file edit:
- `src/pages/StyleGuide/sections/CommonUISection.tsx` — Advanced Toast Patterns card (around L1136–1237).

No changes to the sonner `<Toaster />` config, no new routes, no memory updates.

## Design
- Uses `toast.warning(...)` with:
  - **Title:** `Withdrawal restricted`
  - **Description:** `Your account is under review. Only principal can be withdrawn; profits are temporarily locked. See the help center for details.`
  - **Action:** label `Learn more` → `navigate("/faq")` (existing help center route).
  - `duration: 8000` so the user has time to tap the action on mobile.
- Uses `useNavigate()` from `react-router-dom` (already available in the app; add import at top of file if missing).
- Mobile parity: sonner's default `<Toaster />` already renders bottom-center on small screens; the action button is tappable. No mobile-specific branch needed — the same call works on both.

## Deliverables in the section
1. New trigger button in the "Advanced Toast Patterns" card:
   `Toast with help link`
2. Updated `CodePreview` snippet below the buttons showing the new pattern, e.g.:
   ```ts
   toast.warning("Withdrawal restricted", {
     description: "Your account is under review. Only principal can be withdrawn; profits are temporarily locked.",
     duration: 8000,
     action: { label: "Learn more", onClick: () => navigate("/faq") },
   });
   ```

## Verification
- Click the new button on desktop `/style-guide` → toast appears with "Learn more" action → clicking navigates to `/faq`.
- Repeat via the mobile viewport switch (or DevTools mobile emulation) → toast readable, action tappable.
- `bunx tsgo --noEmit` clean.
