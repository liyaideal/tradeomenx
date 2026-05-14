## Fix expired events + surface closing-soon in "All"

Two distinct issues confirmed by inspecting `events` table and the hooks:

### Issue 1 — expired events still listed

`useActiveEvents` only filters `is_resolved = false`; it does not exclude rows where `end_date < now()`. The DB currently has **8 expired-but-unresolved** events (all dated 2026-04-15 → 2026-04-30, today is 2026-05-14):

```text
eth-4k-apr15, gold-apr15-pm, ufc-315-main, ev-c09,
sol-apr20-2026, trump-tariff-apr21, ev-s05, ev-c03
```

These are short-dated demo rows that aged out. Two-part fix:

**a. Data cleanup (migration)** — bump these 8 events' `end_date` (and `created_at` when needed) so they stay useful demo content instead of dead rows:

| id | new end_date |
|---|---|
| eth-4k-apr15 | now() + 12 hours |
| gold-apr15-pm | now() + 36 hours |
| ufc-315-main | now() + 60 hours |
| ev-c09 (DOGE) | now() + 5 days |
| sol-apr20-2026 | now() + 6 days |
| trump-tariff-apr21 | now() + 7 days |
| ev-s05 (Elon tweets) | now() + 10 days |
| ev-c03 (SOL Apr 30) | now() + 14 days |

This gives Home/Hot a healthy mix of "closing-soon" (within 48–72h) and normal markets.

**b. Defensive client filter** — in `useMarketListData`, skip events whose `end_date` is non-null and in the past, so future stale rows never leak into the UI:

```ts
.filter((event) => {
  if (!event.end_date) return true;
  return new Date(event.end_date).getTime() > Date.now();
})
```

### Issue 2 — closing-soon events absent from "All"

`useHotMarkets.all` is `[...markets].sort(volume24h desc)`. Closing-soon events with mid-range mock volume rank below the top 8 → user never sees them in the All chip.

Fix: change `all` ordering in `src/hooks/useHotMarkets.ts` so closing-soon events float to the top, then everything else by 24h volume:

```ts
const closingIds = new Set(closingSoon.map((m) => m.id));
const all = [...markets].sort((a, b) => {
  const aClose = closingIds.has(a.id) ? 1 : 0;
  const bClose = closingIds.has(b.id) ? 1 : 0;
  if (aClose !== bClose) return bClose - aClose;
  return b.volume24h - a.volume24h;
});
```

Effect: `/events` Hot tab unchanged (it doesn't use `all`). Home Top Events `All` chip now leads with closing-soon, then trending volume.

### Files touched

- `supabase/migrations/<timestamp>_refresh_demo_event_dates.sql` — UPDATE 8 expired event rows.
- `src/hooks/useMarketListData.ts` — add expired-filter guard at top of `events.map`.
- `src/hooks/useHotMarkets.ts` — re-rank `all` to put closing-soon first.

### Out of scope

- Auto-resolving expired events (they should be resolved by settlement workflow, not by filter).
- Changing `useActiveEvents` SQL — keeping it permissive avoids accidentally hiding events whose `end_date` is null or imminent due to clock skew. The client filter is enough.