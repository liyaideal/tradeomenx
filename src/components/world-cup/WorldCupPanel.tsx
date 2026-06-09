import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import {
  SPORTS_LINK,
  isWorldCupActive,
  isPanelDismissed,
  dismissPanel,
} from "@/lib/worldCup";
import {
  featuredMatches as defaultMatches,
  type FeaturedMatch,
  type LiveMatch,
  type UpcomingMatch,
} from "./WorldCupPanel.data";

interface WorldCupPanelProps {
  /** Override active check (for playground/demo only) */
  forceShow?: boolean;
  /** Override match data (for playground/demo only) */
  matches?: FeaturedMatch[];
  /** Disable dismiss persistence (for playground/demo only) */
  ephemeral?: boolean;
  /** Position override; defaults to mobile-safe bottom-right */
  className?: string;
}

export const WorldCupPanel = ({
  forceShow = false,
  matches = defaultMatches,
  ephemeral = false,
  className,
}: WorldCupPanelProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      return;
    }
    if (!isWorldCupActive()) return;
    if (isPanelDismissed()) return;
    setVisible(true);
  }, [forceShow]);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (!ephemeral) dismissPanel();
  };

  const handleOpen = () => {
    window.open(SPORTS_LINK, "_blank", "noopener,noreferrer");
  };

  const live = matches.find((m): m is LiveMatch => m.kind === "live");
  const upcoming = matches.filter(
    (m): m is UpcomingMatch => m.kind === "upcoming"
  );

  return (
    <div
      className={
        className ??
        "fixed z-40 right-4 bottom-24 md:right-6 md:bottom-6 animate-fade-in"
      }
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      <div className="relative w-[340px] max-w-full rounded-2xl p-[2px] bg-gradient-to-br from-yellow-400 via-green-500 to-blue-600 shadow-[0_0_40px_rgba(34,197,94,0.25)]">
        <div className="relative bg-[#0c0c0e] rounded-[14px] overflow-hidden border border-white/5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-black via-zinc-900 to-black">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
              <h2
                className="text-2xl tracking-wider bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                WORLD CUP 2026
              </h2>
            </div>
            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Dismiss World Cup panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live hero row */}
          {live && (
            <button
              onClick={handleOpen}
              className="w-full p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)] tracking-tighter uppercase">
                  LIVE
                </span>
                <span className="font-mono text-green-400 text-xs font-bold uppercase">
                  {live.minute} MINUTES
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className="w-10 h-6 border border-white/20 rounded-sm mb-1"
                    style={{ background: live.homeFlag.primary }}
                  />
                  <span
                    className="text-sm text-zinc-100 uppercase tracking-wide text-center truncate w-full"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {live.home}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-4xl text-white"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {live.scoreHome}
                  </span>
                  <span className="text-zinc-600 font-black">:</span>
                  <span
                    className="text-4xl text-white"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {live.scoreAway}
                  </span>
                </div>

                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className="w-10 h-6 border border-white/20 rounded-sm mb-1"
                    style={{ background: live.awayFlag.primary }}
                  />
                  <span
                    className="text-sm text-zinc-100 uppercase tracking-wide text-center truncate w-full"
                    style={{ fontFamily: "'Anton', sans-serif" }}
                  >
                    {live.away}
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* Upcoming divider */}
          {upcoming.length > 0 && (
            <div className="px-4 py-1.5 bg-white/5 border-y border-white/5">
              <span className="text-[9px] font-bold text-zinc-500 tracking-[0.2em] uppercase">
                Coming Up Next
              </span>
            </div>
          )}

          {/* Upcoming list */}
          <div className="divide-y divide-white/5">
            {upcoming.map((m, i) => (
              <button
                key={`${m.homeShort}-${m.awayShort}-${i}`}
                onClick={handleOpen}
                className="w-full p-3 hover:bg-white/[0.03] transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex -space-x-1 shrink-0">
                    <div
                      className="w-6 h-4 border border-white/10 rounded-sm"
                      style={{ background: m.homeFlag.primary }}
                    />
                    <div
                      className="w-6 h-4 border border-white/10 rounded-sm"
                      style={{ background: m.awayFlag.primary }}
                    />
                  </div>
                  <div className="text-xs font-bold text-zinc-300 truncate">
                    {m.homeShort}{" "}
                    <span className="text-zinc-600 mx-1">v</span>{" "}
                    {m.awayShort}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">
                    {m.time}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="p-4">
            <button
              onClick={handleOpen}
              className="w-full relative group/btn overflow-hidden rounded-lg bg-green-500 p-[1px] transition-transform active:scale-95 shadow-[0_10px_20px_-10px_rgba(34,197,94,0.5)]"
            >
              <div className="bg-[#0c0c0e] rounded-[7px] py-2.5 flex items-center justify-center gap-2 transition-colors group-hover/btn:bg-transparent">
                <span
                  className="text-lg tracking-widest text-white group-hover/btn:text-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  OPEN OMENX SPORTS
                </span>
                <ArrowRight className="w-4 h-4 text-green-500 group-hover/btn:text-black transition-colors" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldCupPanel;
