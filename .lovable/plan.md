## World Cup 2026 floating portal

A persistent floating panel that lives bottom-right during the World Cup window, linking to OmenX Sports. Single state — always expanded, no collapsed pill. Visual direction is the selected "Gold trophy rim" prototype: gold→green→blue gradient border, Bebas Neue title with gold gradient, big Anton score numbers, broadcast lower-third energy.

### What gets built

**New files**
- `src/lib/worldCup.ts` — constants: `WC2026_START = 2026-06-11T20:00:00-06:00` (Mexico vs South Africa kickoff), `WC2026_END = 2026-07-19T23:59:59-04:00`, `SPORTS_URL = "https://omenx-sports.lovable.app"`, helper `isWorldCupActive()`.
- `src/components/world-cup/WorldCupPanel.tsx` — the floating panel, fixed `bottom-20 right-4` on mobile / `bottom-6 right-6` on desktop, `z-40`, mounts only when `isWorldCupActive()`. Dismissible via × → writes `wc2026-panel-dismissed` to localStorage with 24h TTL. Animation: `animate-fade-in` on mount.
- `src/components/world-cup/WorldCupPanel.data.ts` — for now a hardcoded `featuredMatches` array (1 live + 2 upcoming) matching the prototype data. Designed to be swapped later for a fetch to OmenX Sports' public matches endpoint (no backend work this round).
- `src/pages/StyleGuide/sections/WorldCupSection.tsx` — playground entry with PresetRail states: `live | pre-match | between-matches | dismissed-preview`, per the playground-state-coverage rule.

**Modified files**
- `src/pages/MobileHome.tsx` — mount `<WorldCupPanel />` once at page level (above `BottomNav`).
- `src/pages/EventsPage.tsx` — same mount for desktop.
- `src/pages/StyleGuide/sections/index.ts` — register the new section.

**Not in scope this round**
- Sports station's public `/api/featured-matches` endpoint (data is hardcoded for launch; we can wire real data in a follow-up once the Sports project exposes it).
- Campaigns Rail banner card (separate follow-up).
- Bottom-nav / header product switcher (rejected earlier).
- Post-World-Cup mode (panel auto-hides after `WC2026_END`; we'll redesign the permanent Sports entry later).

### Visual spec (locked from prototype)

- Outer wrapper: `w-[340px] rounded-2xl p-[2px] bg-gradient-to-br from-yellow-400 via-green-500 to-blue-600 shadow-[0_0_40px_rgba(34,197,94,0.25)]`
- Inner: `bg-[#0c0c0e] rounded-[14px] border border-white/5`
- Header: Bebas Neue 2xl, gold gradient text-clip, yellow dot with glow, × dismiss
- Live hero row: red `LIVE` pulse chip, JetBrains Mono `72'`, Anton 4xl score `1 : 0`, Anton uppercase team names, flag color blocks (no emoji)
- "Coming Up Next" divider
- Two upcoming rows: flag color blocks + `ARG v CAN`, yellow odds `+142`, time chip
- CTA: gold-gradient outer / dark inner that inverts to gold-on-black on hover, Bebas Neue `OPEN OMENX SPORTS` + arrow → `window.open(SPORTS_URL + "?ref=omenx-main&src=wc-panel", "_blank")`

### Technical notes

- Bebas Neue + Anton loaded via `<link>` in `index.html` (Google Fonts), or `@import` in `src/index.css`. Use the CSS import route so it's bundled once.
- Mobile/desktop responsiveness: panel keeps its 340px width; on viewports < 360px wide, shrink to `w-[calc(100vw-2rem)]` to avoid edge overflow.
- Dismiss state: `localStorage.getItem("wc2026-panel-dismissed")` parsed as ISO timestamp; show again after 24h.
- Memory: save `mem://features/world-cup-portal` documenting the window dates, URL, ref param, and dismiss behavior so future sessions don't drift.
