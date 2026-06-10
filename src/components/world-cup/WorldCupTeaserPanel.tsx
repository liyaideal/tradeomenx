import { useEffect, useRef, useState } from "react";
import { X, ArrowRight, Trophy, MapPin } from "lucide-react";
import {
  SPORTS_LINK,
  WC2026_START,
  getCountdownTo,
  isPanelDismissed,
  dismissPanel,
  getWorldCupPhase,
} from "@/lib/worldCup";
import trophyAsset from "@/assets/trophy-silhouette.png.asset.json";

interface WorldCupTeaserPanelProps {
  forceShow?: boolean;
  ephemeral?: boolean;
  targetDate?: Date;
  className?: string;
}

/** Flip-card style countdown cell — animates only when value changes. */
const Cell = ({ value, label }: { value: number; label: string }) => {
  const [display, setDisplay] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipKey, setFlipKey] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setDisplay(value);
      return;
    }
    if (value !== display) {
      setPrev(display);
      setDisplay(value);
      setFlipKey((k) => k + 1);
    }
  }, [value, display]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-14 rounded-md bg-gradient-to-b from-zinc-900 to-black border border-yellow-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_6px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/60 z-10" />
        {/* Outgoing digit slides up & fades */}
        <span
          key={`out-${flipKey}`}
          className="absolute inset-0 flex items-center justify-center text-3xl leading-none bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent wc-flip-out"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {prev.toString().padStart(2, "0")}
        </span>
        {/* Incoming digit slides up from below */}
        <span
          key={`in-${flipKey}`}
          className="absolute inset-0 flex items-center justify-center text-3xl leading-none bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent wc-flip-in"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {display.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1 text-[9px] font-bold tracking-[0.18em] text-zinc-500 uppercase">
        {label}
      </span>
    </div>
  );
};

export const WorldCupTeaserPanel = ({
  forceShow = false,
  ephemeral = false,
  targetDate = WC2026_START,
  className,
}: WorldCupTeaserPanelProps) => {
  const [visible, setVisible] = useState(false);
  const [cd, setCd] = useState(() => getCountdownTo(targetDate));

  useEffect(() => {
    if (forceShow) {
      setVisible(true);
    } else {
      if (getWorldCupPhase() !== "teaser") return;
      if (isPanelDismissed()) return;
      setVisible(true);
    }
    const t = setInterval(() => setCd(getCountdownTo(targetDate)), 1000);
    return () => clearInterval(t);
  }, [forceShow, targetDate]);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (!ephemeral) dismissPanel();
  };
  const handleOpen = () =>
    window.open(SPORTS_LINK, "_blank", "noopener,noreferrer");

  return (
    <div
      className={
        className ??
        "fixed z-40 right-4 bottom-24 md:right-6 md:bottom-6 animate-fade-in"
      }
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      <style>{`
        @keyframes wc-flip-out {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes wc-flip-in {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .wc-flip-out { animation: wc-flip-out 220ms cubic-bezier(0.4,0,0.2,1) forwards; }
        .wc-flip-in { animation: wc-flip-in 220ms cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes wc-shimmer {
          0%   { transform: translateX(-150%); }
          40%  { transform: translateX(250%); }
          100% { transform: translateX(250%); }
        }
        .wc-shimmer-overlay {
          position: absolute;
          top: -50%;
          left: 0;
          width: 60%;
          height: 200%;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%);
          mix-blend-mode: overlay;
          pointer-events: none;
          animation: wc-shimmer 3.5s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes wc-trophy-glow {
          0%, 100% { opacity: 0.22; }
          50%      { opacity: 0.30; }
        }
        .wc-trophy { animation: wc-trophy-glow 5s ease-in-out infinite; }
      `}</style>

      <div className="relative w-[340px] max-w-full rounded-2xl p-[2px] bg-gradient-to-br from-yellow-400 via-green-500 to-blue-600 shadow-[0_0_40px_rgba(250,204,21,0.25)]">
        <div className="relative bg-[#0c0c0e] rounded-[14px] overflow-hidden border border-white/5">
          {/* Stadium beam backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(120% 60% at 50% -20%, rgba(250,204,21,0.35), transparent 60%), radial-gradient(80% 60% at 50% 120%, rgba(34,197,94,0.25), transparent 60%)",
            }}
          />

          {/* Trophy glow halo (behind trophy) */}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              right: "-25%",
              bottom: "-20%",
              width: "70%",
              height: "70%",
              background:
                "radial-gradient(circle at center, rgba(250,204,21,0.35), transparent 60%)",
              filter: "blur(20px)",
            }}
          />

          {/* Trophy silhouette */}
          <img
            src={trophyAsset.url}
            alt=""
            aria-hidden
            width={420}
            height={420}
            loading="lazy"
            className="wc-trophy pointer-events-none absolute select-none"
            style={{
              right: "-22%",
              bottom: "-12%",
              width: "75%",
              maxWidth: "320px",
              transform: "rotate(-6deg)",
              mixBlendMode: "screen",
              filter: "drop-shadow(0 0 18px rgba(250,204,21,0.35))",
            }}
            draggable={false}
          />

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-black via-zinc-900 to-black">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]" />
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
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* COMING SOON ribbon */}
          <div className="relative px-4 pt-4 pb-2 flex items-center justify-center gap-2">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-yellow-500/40" />
            <span
              className="px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 text-[10px] font-bold tracking-[0.25em] uppercase animate-pulse"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.25em" }}
            >
              Kickoff In
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-yellow-500/40 to-yellow-500/40" />
          </div>

          {/* Countdown */}
          <div className="relative px-4 pb-4 flex items-center justify-between gap-2">
            <Cell value={cd.days} label="Days" />
            <span className="text-yellow-500/60 text-2xl font-black -mt-4">:</span>
            <Cell value={cd.hours} label="Hours" />
            <span className="text-yellow-500/60 text-2xl font-black -mt-4">:</span>
            <Cell value={cd.minutes} label="Mins" />
            <span className="text-yellow-500/60 text-2xl font-black -mt-4">:</span>
            <Cell value={cd.seconds} label="Secs" />
          </div>

          {/* Opening match preview */}
          <div className="relative mx-4 mb-4 rounded-lg border border-yellow-500/20 bg-gradient-to-br from-yellow-500/[0.04] to-transparent overflow-hidden backdrop-blur-[2px]">
            <div className="px-3 py-1.5 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-yellow-300/80 tracking-[0.2em] uppercase">
                Opening Match
              </span>
              <span className="flex items-center gap-1 text-[9px] text-zinc-500 uppercase tracking-wider">
                <MapPin className="w-2.5 h-2.5" /> Estadio Azteca
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 gap-2">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="relative w-10 h-6 rounded-sm border border-white/20 mb-1 overflow-hidden">
                  <svg viewBox="0 0 30 18" className="w-full h-full block" aria-hidden>
                    <rect x="0" y="0" width="10" height="18" fill="#006847" />
                    <rect x="10" y="0" width="10" height="18" fill="#ffffff" />
                    <rect x="20" y="0" width="10" height="18" fill="#ce1126" />
                  </svg>
                  <span className="wc-shimmer-overlay" style={{ animationDelay: "0s" }} />
                </div>
                <span
                  className="text-sm text-zinc-100 uppercase tracking-wide"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  Mexico
                </span>
              </div>

              <span
                className="text-zinc-500 text-lg shrink-0"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                VS
              </span>

              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="relative w-10 h-6 rounded-sm border border-white/20 mb-1 overflow-hidden">
                  <svg viewBox="0 0 30 18" className="w-full h-full block" aria-hidden>
                    <rect x="0" y="0" width="30" height="9" fill="#007a4d" />
                    <rect x="0" y="9" width="30" height="9" fill="#ffb612" />
                  </svg>
                  <span className="wc-shimmer-overlay" style={{ animationDelay: "1.4s" }} />
                </div>
                <span
                  className="text-sm text-zinc-100 uppercase tracking-wide"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  S. Africa
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative px-4 pb-4">
            <button
              onClick={handleOpen}
              className="w-full relative group/btn overflow-hidden rounded-lg p-[1px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 transition-transform active:scale-95 shadow-[0_10px_24px_-10px_rgba(250,204,21,0.6)]"
            >
              <div className="bg-[#0c0c0e] rounded-[7px] py-2.5 flex items-center justify-center gap-2 transition-colors group-hover/btn:bg-transparent">
                <span
                  className="text-lg tracking-widest bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent group-hover/btn:from-black group-hover/btn:to-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  ENTER THE ARENA
                </span>
                <ArrowRight className="w-4 h-4 text-yellow-400 group-hover/btn:text-black transition-colors" />
              </div>
            </button>
            <p className="mt-2 text-center text-[10px] text-zinc-500 tracking-wider uppercase">
              Early access · Pre-match odds live now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldCupTeaserPanel;
