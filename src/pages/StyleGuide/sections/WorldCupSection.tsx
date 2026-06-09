import { useState } from "react";
import { WorldCupPanel } from "@/components/world-cup/WorldCupPanel";
import { WorldCupTeaserPanel } from "@/components/world-cup/WorldCupTeaserPanel";
import type { FeaturedMatch } from "@/components/world-cup/WorldCupPanel.data";

interface Props {
  isMobile?: boolean;
}

type LivePreset =
  | "live-plus-upcoming"
  | "pre-match"
  | "between-matches"
  | "single-live";

type TeaserPreset = "t-days" | "t-hours" | "t-minutes" | "t-seconds";

const LIVE_PRESETS: Record<LivePreset, { label: string; matches: FeaturedMatch[] }> = {
  "live-plus-upcoming": {
    label: "Live + Upcoming",
    matches: [
      { kind: "live", home: "Mexico", homeShort: "MEX", away: "S. Africa", awayShort: "RSA", homeFlag: { primary: "#006341" }, awayFlag: { primary: "#007A4D" }, scoreHome: 1, scoreAway: 0, minute: "72'" },
      { kind: "upcoming", home: "Argentina", homeShort: "ARG", away: "Canada", awayShort: "CAN", homeFlag: { primary: "#75AADB" }, awayFlag: { primary: "#D52B1E" }, odds: "+142", time: "IN 14M" },
      { kind: "upcoming", home: "France", homeShort: "FRA", away: "Spain", awayShort: "ESP", homeFlag: { primary: "#0055A4" }, awayFlag: { primary: "#F1BF00" }, odds: "+205", time: "22:00" },
    ],
  },
  "pre-match": {
    label: "Pre-match (no live)",
    matches: [
      { kind: "upcoming", home: "Argentina", homeShort: "ARG", away: "Canada", awayShort: "CAN", homeFlag: { primary: "#75AADB" }, awayFlag: { primary: "#D52B1E" }, odds: "+142", time: "IN 14M" },
      { kind: "upcoming", home: "France", homeShort: "FRA", away: "Spain", awayShort: "ESP", homeFlag: { primary: "#0055A4" }, awayFlag: { primary: "#F1BF00" }, odds: "+205", time: "22:00" },
    ],
  },
  "between-matches": {
    label: "Between matches (upcoming only)",
    matches: [
      { kind: "upcoming", home: "Brazil", homeShort: "BRA", away: "Germany", awayShort: "GER", homeFlag: { primary: "#009C3B" }, awayFlag: { primary: "#000000" }, odds: "+118", time: "TOMORROW" },
      { kind: "upcoming", home: "England", homeShort: "ENG", away: "Italy", awayShort: "ITA", homeFlag: { primary: "#FFFFFF" }, awayFlag: { primary: "#0066CC" }, odds: "+175", time: "FRI 21:00" },
    ],
  },
  "single-live": {
    label: "Single live match",
    matches: [
      { kind: "live", home: "Brazil", homeShort: "BRA", away: "Germany", awayShort: "GER", homeFlag: { primary: "#009C3B" }, awayFlag: { primary: "#000000" }, scoreHome: 2, scoreAway: 2, minute: "88'" },
    ],
  },
};

const TEASER_PRESETS: Record<TeaserPreset, { label: string; offsetMs: number }> = {
  "t-days": { label: "30 days out", offsetMs: 30 * 86400 * 1000 },
  "t-hours": { label: "2 days out", offsetMs: 2 * 86400 * 1000 + 5 * 3600 * 1000 },
  "t-minutes": { label: "T-90 minutes", offsetMs: 90 * 60 * 1000 },
  "t-seconds": { label: "T-45 seconds", offsetMs: 45 * 1000 },
};

export const WorldCupSection = ({ isMobile }: Props) => {
  const [livePreset, setLivePreset] = useState<LivePreset>("live-plus-upcoming");
  const [teaserPreset, setTeaserPreset] = useState<TeaserPreset>("t-hours");

  const teaserTarget = new Date(Date.now() + TEASER_PRESETS[teaserPreset].offsetMs);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold mb-2">World Cup 2026 Portal</h2>
        <p className="text-sm text-muted-foreground">
          Phase-aware floating panel docked bottom-right.
          <br />
          <strong>Teaser</strong> (pre-kickoff) shows countdown + opening match.
          <strong className="ml-2">Live</strong> (Jun 11 – Jul 19, 2026) shows
          live scoreboard + upcoming odds. Auto-hides outside window or after
          dismiss (24h TTL).
        </p>
      </div>

      {/* ===== TEASER ===== */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Teaser (pre-kickoff)
        </h3>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {(Object.entries(TEASER_PRESETS) as [TeaserPreset, (typeof TEASER_PRESETS)[TeaserPreset]][]).map(
            ([key, p]) => (
              <button
                key={key}
                onClick={() => setTeaserPreset(key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  teaserPreset === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            )
          )}
        </div>

        <div className="relative w-full min-h-[520px] rounded-xl border border-border/50 bg-[#050505] overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-end p-6">
            <WorldCupTeaserPanel
              key={teaserPreset}
              forceShow
              ephemeral
              targetDate={teaserTarget}
              className="relative animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* ===== LIVE ===== */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Live (tournament window)
        </h3>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {(Object.entries(LIVE_PRESETS) as [LivePreset, (typeof LIVE_PRESETS)[LivePreset]][]).map(
            ([key, p]) => (
              <button
                key={key}
                onClick={() => setLivePreset(key)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  livePreset === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            )
          )}
        </div>

        <div className="relative w-full min-h-[520px] rounded-xl border border-border/50 bg-[#050505] overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-end p-6">
            <WorldCupPanel
              key={livePreset}
              forceShow
              ephemeral
              matches={LIVE_PRESETS[livePreset].matches}
              className="relative animate-fade-in"
            />
          </div>
        </div>
      </section>

      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Window:</strong> 2026-06-11 20:00 UTC → 2026-07-20 04:00 UTC</p>
        <p><strong>Link:</strong> https://omenx-sports.lovable.app?ref=omenx-main&amp;src=wc-panel</p>
        <p><strong>Dismiss:</strong> ×按钮写入 localStorage, 24h 内不再出现</p>
      </div>
    </div>
  );
};

export default WorldCupSection;
