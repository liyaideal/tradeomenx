

## Plan: Homepage Airdrop Notification Modal/Drawer

### Problem
When new airdrops are detected from Polymarket scanning, users should see a rich modal (desktop) or bottom drawer (mobile) on the homepage — not just a small toast. Limited to 3 popups per day to avoid spamming.

### Design

**Mobile**: Bottom drawer (Vaul) with airdrop details, countdown timer, and "Activate Now" button.
**Desktop**: Dialog modal with same content.

Both show:
- Title: "🎁 New Airdrop Position!"
- Detected position info (event name, side)
- FREE $10 hedge position details
- Countdown timer (time remaining to activate)
- "Activate Now" button → navigates to `/trade?event={eventId}`
- Dismiss button

### Technical Approach

1. **New component: `AirdropHomepageModal.tsx`**
   - Accepts `pendingAirdrops` from `useAirdropPositions`
   - On mount (homepage only), checks for new unshown airdrops
   - Uses `localStorage` key `omenx-airdrop-modal-shown:{userId}:{date}` to track daily count (max 3)
   - Uses `sessionStorage` to track which airdrop IDs have already been shown in this session
   - Shows one airdrop at a time (most recent first)
   - Mobile: renders as `Drawer` from vaul; Desktop: renders as `Dialog`
   - Live countdown using `setInterval` for the `expiresAt` field
   - "Activate Now" calls `activateAirdrop(id)` then navigates to trade page
   - "Dismiss" closes and marks as shown

2. **Integration in `MobileHome.tsx` and `EventsPage.tsx` (desktop homepage)**
   - Add `<AirdropHomepageModal />` component
   - Only renders on homepage routes

3. **Rate limiting logic**
   - On each render, read `localStorage` for today's date key
   - Parse shown count; if >= 3, skip
   - After showing, increment count and save

### Files to Create/Edit
- **Create**: `src/components/AirdropHomepageModal.tsx`
- **Edit**: `src/pages/MobileHome.tsx` — add modal component
- **Edit**: `src/pages/EventsPage.tsx` — add modal component (desktop homepage)

