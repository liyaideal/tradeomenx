import { HedgeCTAButton } from "./HedgeCTAButton";

// Operations can edit these constants directly.
const LIVE_STATS = {
  distributed: "$47,320",
  claimed: "1,284",
  remaining: "213",
};

/**
 * Retro Football Poster hero. World Cup Hedge-to-Earn campaign.
 * Asymmetric Split Poster layout: 65% copy / 35% graphic, full-width stats strip.
 * Copy locked to OmenX_WorldCup_H2E_LandingCopy.md.
 */
export const HedgeHero = () => {
  return (
    <section className="relative bg-[#FDFCF0] py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className="relative border-[4px] border-[#0E0E0E] bg-[#FDFCF0] md:border-[6px]"
          style={{ boxShadow: "12px 12px 0 0 #E11D48" }}
        >
          {/* Upper band: copy (65%) + graphic (35%) */}
          <div className="relative flex flex-col border-b-[4px] border-[#0E0E0E] md:border-b-[6px] lg:flex-row">
            {/* Left: copy column */}
            <div className="relative z-10 flex min-w-0 flex-col gap-5 p-6 md:p-10 lg:w-[65%] lg:border-r-[6px] lg:border-[#0E0E0E]">
              {/* Rotated red sticker */}
              <span className="inline-flex w-fit -rotate-2 items-center gap-2 border-2 border-[#0E0E0E] bg-[#E11D48] px-4 py-1 font-display text-xs uppercase tracking-wider text-white shadow-[4px_4px_0_0_#0E0E0E] md:text-sm">
                Special Campaign · World Cup 2026
              </span>

              <h1 className="font-display text-4xl uppercase leading-[0.9] tracking-tight text-[#0E0E0E] md:text-6xl lg:text-7xl">
                World Cup{" "}
                <span className="text-[#1D4ED8]">chaos?</span>{" "}
                Hedge it — redeem up to{" "}
                <span className="text-[#E11D48]">500U</span>.
              </h1>

              <p className="max-w-xl border-l-4 border-[#FACC15] pl-4 text-lg font-semibold leading-snug text-[#0E0E0E]/80 md:text-xl">
                Connect your Polymarket wallet, open a hedge that moves opposite your pick,
                and redeem rewards if it closes in profit.
                <sup className="ml-0.5 text-xs text-[#E11D48]">*</sup>
              </p>

              <p className="-mt-3 text-[11px] italic text-[#0E0E0E]/60">
                *Rewards not guaranteed — see campaign rules.
              </p>

              <div className="mt-2">
                <HedgeCTAButton size="lg" />
              </div>
            </div>

            {/* Right: retro football graphic */}
            <div
              className="relative hidden items-center justify-center overflow-hidden bg-[#F3F2E7] p-8 lg:flex lg:w-[35%]"
              aria-label="OMENX World Cup Hedge-to-Earn campaign — hedge your Polymarket prediction position"
            >
              {/* dot texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(#0E0E0E 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />

              <div className="relative">
                <div
                  className="relative flex h-60 w-60 items-center justify-center rounded-full border-[6px] border-[#0E0E0E] bg-white xl:h-72 xl:w-72"
                  style={{ boxShadow: "10px 10px 0 0 #FACC15" }}
                  title="OMENX World Cup Hedge-to-Earn campaign — hedge your Polymarket prediction position"
                >
                  {/* crosshair */}
                  <div className="pointer-events-none absolute inset-4 rounded-full border-2 border-[#0E0E0E]/15">
                    <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#0E0E0E]/15" />
                    <div className="absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 bg-[#0E0E0E]/15" />
                  </div>
                  {/* 26 watermark */}
                  <span className="pointer-events-none absolute select-none font-display text-[7rem] leading-none text-[#0E0E0E]/10 xl:text-[8rem]">
                    26
                  </span>
                  {/* center diamond */}
                  <div className="absolute h-20 w-20 rotate-45 border-[6px] border-[#0E0E0E] bg-[#E11D48]" />
                  {/* yellow accent square */}
                  <div className="absolute -right-3 -top-3 h-10 w-10 border-4 border-[#0E0E0E] bg-[#FACC15]" />
                </div>

                {/* HEDGED stamp */}
                <div
                  className="absolute -bottom-4 -left-6 -rotate-12 border-4 border-white bg-[#0E0E0E] px-4 py-2 font-display text-2xl italic text-[#FACC15]"
                  style={{ boxShadow: "4px 4px 0 0 #E11D48" }}
                >
                  HEDGED
                </div>
              </div>
            </div>
          </div>

          {/* Lower band: full-width stats strip */}
          <div className="grid grid-cols-3 divide-x-2 divide-white/10 bg-[#0E0E0E] text-white">
            <Stat value={LIVE_STATS.distributed} label="Distributed" tone="yellow" />
            <Stat value={LIVE_STATS.claimed} label="Users claimed" tone="red" />
            <Stat value={LIVE_STATS.remaining} label="Spots left today" tone="white" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "yellow" | "red" | "white";
}) => {
  const color =
    tone === "yellow" ? "text-[#FACC15]" : tone === "red" ? "text-[#E11D48]" : "text-white";
  return (
    <div className="px-3 py-4 text-center md:px-6 md:py-5 md:text-left">
      <div className={`font-display text-xl md:text-3xl ${color}`}>{value}</div>
      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-neutral-400 md:text-[10px]">
        {label}
      </div>
    </div>
  );
};
