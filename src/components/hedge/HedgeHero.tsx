import { HedgeCTAButton } from "./HedgeCTAButton";
import { HedgePosterFrame } from "./HedgePosterFrame";

// Operations can edit these constants directly.
const LIVE_STATS = {
  distributed: "$47,320",
  claimed: "1,284",
  remaining: "213",
};

/**
 * Retro Football Poster hero. World Cup Hedge-to-Earn campaign.
 * Copy is locked to OmenX_WorldCup_H2E_LandingCopy.md.
 */
export const HedgeHero = () => {
  return (
    <section className="relative bg-[#FDFCF0] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <HedgePosterFrame shadow="red" innerClassName="p-6 md:p-10">
          {/* Geometric backdrop accents */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute right-0 top-0 h-full w-1/2 -skew-x-12 translate-x-1/4 bg-[#1D4ED8] opacity-[0.06]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#FACC15] opacity-20" />
          </div>

          <div className="relative z-10 grid items-center gap-10 md:grid-cols-[1.15fr_1fr]">
            {/* Left: copy */}
            <div className="flex min-w-0 flex-col">
              {/* Rotated red sticker */}
              <span
                className="mb-5 inline-flex w-fit -rotate-2 items-center gap-2 border-2 border-[#0E0E0E] bg-[#E11D48] px-4 py-1 font-display text-xs uppercase tracking-wider text-white md:text-sm"
              >
                Special Campaign · World Cup 2026
              </span>

              <h1 className="font-display text-4xl uppercase leading-[0.9] tracking-tight text-[#0E0E0E] md:text-6xl lg:text-7xl">
                World Cup{" "}
                <span className="text-[#1D4ED8]">chaos?</span>{" "}
                Hedge it — redeem up to{" "}
                <span className="text-[#E11D48]">500U</span>.
              </h1>

              <p className="mt-6 max-w-xl border-l-4 border-[#FACC15] pl-4 text-lg font-semibold leading-snug text-[#0E0E0E]/80 md:text-xl">
                Connect your Polymarket wallet, open a hedge that moves opposite your pick,
                and redeem rewards if it closes in profit.
                <sup className="ml-0.5 text-xs text-[#E11D48]">*</sup>
              </p>

              <p className="mt-2 text-[11px] italic text-[#0E0E0E]/60">
                *Rewards not guaranteed — see campaign rules.
              </p>

              <div className="mt-7">
                <HedgeCTAButton size="lg" />
              </div>

              {/* Live stats strip — desktop inline */}
              <div className="mt-8 hidden grid-cols-3 divide-x-2 divide-[#0E0E0E] border-2 border-[#0E0E0E] bg-[#0E0E0E] text-white md:grid">
                <Stat value={LIVE_STATS.distributed} label="Distributed" tone="yellow" />
                <Stat value={LIVE_STATS.claimed} label="Users claimed" tone="red" />
                <Stat value={LIVE_STATS.remaining} label="Spots left today" tone="white" />
              </div>

              {/* Live stats — mobile 2x2-ish (3 wide stacked) */}
              <div className="mt-6 grid grid-cols-3 border-2 border-[#0E0E0E] bg-[#0E0E0E] text-white md:hidden">
                <Stat value={LIVE_STATS.distributed} label="Distributed" tone="yellow" compact />
                <Stat value={LIVE_STATS.claimed} label="Claimed" tone="red" compact />
                <Stat value={LIVE_STATS.remaining} label="Spots" tone="white" compact />
              </div>
            </div>

            {/* Right: retro football graphic */}
            <div className="relative hidden items-center justify-center md:flex">
              <div className="relative">
                <div
                  className="flex h-72 w-72 items-center justify-center rounded-full border-[6px] border-[#0E0E0E] bg-white"
                  style={{ boxShadow: "12px 12px 0 0 #FACC15" }}
                >
                  {/* hex/pentagon hint */}
                  <div className="grid h-full w-full grid-cols-2 opacity-20">
                    <div className="border-b-4 border-r-4 border-[#0E0E0E]" />
                    <div className="border-b-4 border-[#0E0E0E]" />
                    <div className="border-r-4 border-[#0E0E0E]" />
                    <div />
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="select-none font-display text-[8rem] leading-none text-[#0E0E0E]/10">
                      26
                    </span>
                  </div>
                  {/* diamond + star */}
                  <div className="absolute h-20 w-20 rotate-45 border-4 border-[#0E0E0E] bg-[#E11D48]" />
                  <div className="absolute -right-3 -top-3 h-10 w-10 border-4 border-[#0E0E0E] bg-[#FACC15]" />
                </div>

                {/* INSURED stamp */}
                <div
                  className="absolute -bottom-4 -left-6 -rotate-12 border-4 border-white bg-[#0E0E0E] px-4 py-2 font-display text-2xl italic text-[#FACC15]"
                  style={{ boxShadow: "4px 4px 0 0 #E11D48" }}
                >
                  HEDGED
                </div>
              </div>
            </div>
          </div>
        </HedgePosterFrame>
      </div>
    </section>
  );
};

const Stat = ({
  value,
  label,
  tone,
  compact = false,
}: {
  value: string;
  label: string;
  tone: "yellow" | "red" | "white";
  compact?: boolean;
}) => {
  const color =
    tone === "yellow" ? "text-[#FACC15]" : tone === "red" ? "text-[#E11D48]" : "text-white";
  return (
    <div className={compact ? "px-2 py-2.5 text-center" : "px-5 py-4"}>
      <div className={`font-display ${compact ? "text-lg" : "text-2xl"} ${color}`}>{value}</div>
      <div className={`mt-0.5 font-mono ${compact ? "text-[9px]" : "text-[10px]"} uppercase tracking-widest text-neutral-400`}>
        {label}
      </div>
    </div>
  );
};
