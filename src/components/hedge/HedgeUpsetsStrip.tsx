import { HedgePosterFrame } from "./HedgePosterFrame";

// Hardcoded per copy doc. Business to verify before launch.
const UPSETS = [
  { fav: "Spain", score: "0 - 0", under: "Cape Verde", tag: "Draw" },
  { fav: "Brazil", score: "1 - 1", under: "Morocco", tag: "Stopped" },
  { fav: "Belgium", score: "1 - 1", under: "Egypt", tag: "Tied" },
  { fav: "Netherlands", score: "2 - 2", under: "Japan", tag: "Held" },
] as const;

export const HedgeUpsetsStrip = () => {
  return (
    <section className="bg-[#FDFCF0] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-6 md:mb-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E11D48]">
            This World Cup is an upset machine
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-3xl uppercase leading-tight tracking-tight text-[#0E0E0E] md:text-5xl">
            Every upset wipes out another wave of Polymarket positions.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {UPSETS.map((u, i) => (
            <HedgePosterFrame
              key={u.fav}
              shadow={i % 2 === 0 ? "blue" : "yellow"}
              size="sm"
            >
              <div className="p-4 md:p-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#0E0E0E]/60">
                  {u.tag}
                </div>
                <div className="mt-2 font-display text-lg uppercase tracking-tight text-[#0E0E0E] md:text-xl">
                  {u.fav}
                </div>
                <div className="mt-1 font-display text-4xl text-[#1D4ED8] md:text-5xl">
                  {u.score}
                </div>
                <div className="mt-1 font-display text-lg uppercase tracking-tight text-[#0E0E0E]/80 md:text-xl">
                  {u.under}
                </div>
              </div>
            </HedgePosterFrame>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-base font-semibold text-[#0E0E0E]/80 md:text-lg">
          One wrong call and your whole position can go to zero.{" "}
          <span className="bg-[#FACC15] px-1 font-display uppercase">
            This time, give your pick a hedge.
          </span>
        </p>
        <p className="mt-2 text-[11px] italic text-[#0E0E0E]/50">
          Match results pending business verification.
        </p>
      </div>
    </section>
  );
};
