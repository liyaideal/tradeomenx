import { useState } from "react";
import { WorldCupPanel } from "@/components/world-cup/WorldCupPanel";
import { WorldCupTeaserPanel } from "@/components/world-cup/WorldCupTeaserPanel";
import type { FeaturedMatch } from "@/components/world-cup/WorldCupPanel.data";

interface Props {
  isMobile?: boolean;
}

type PresetKey =
  | "teaser-days"
  | "teaser-hours"
  | "teaser-minutes"
  | "live-plus-upcoming"
  | "pre-match"
  | "between-matches"
  | "single-live";

const PRESETS: Record<PresetKey, { label: string; matches: FeaturedMatch[] }> = {
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

export const WorldCupSection = ({ isMobile }: Props) => {
  const [preset, setPreset] = useState<PresetKey>("live-plus-upcoming");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">World Cup 2026 Portal</h2>
        <p className="text-sm text-muted-foreground">
          Persistent floating panel docked bottom-right during the World Cup
          window (Jun 11 – Jul 19, 2026). Links out to OmenX Sports. Auto-hides
          outside the window and after dismiss (24h TTL).
        </p>
      </div>

      {/* Preset rail */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {(Object.entries(PRESETS) as [PresetKey, (typeof PRESETS)[PresetKey]][]).map(
          ([key, p]) => (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                preset === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          )
        )}
      </div>

      {/* Demo canvas */}
      <div className="relative w-full min-h-[520px] rounded-xl border border-border/50 bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-end p-6">
          <WorldCupPanel
            key={preset}
            forceShow
            ephemeral
            matches={PRESETS[preset].matches}
            className="relative animate-fade-in"
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Window:</strong> 2026-06-11 20:00 UTC → 2026-07-20 04:00 UTC</p>
        <p><strong>Link:</strong> https://omenx-sports.lovable.app?ref=omenx-main&amp;src=wc-panel</p>
        <p><strong>Dismiss:</strong> ×按钮写入 localStorage, 24h 内不再出现</p>
      </div>
    </div>
  );
};

export default WorldCupSection;
