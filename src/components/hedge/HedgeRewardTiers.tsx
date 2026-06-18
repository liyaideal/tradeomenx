import { Lock } from "lucide-react";
import { HedgePosterFrame } from "./HedgePosterFrame";
import { cn } from "@/lib/utils";

export type TierState = "locked" | "unlocked" | "claimed";

export interface HedgeTier {
  id: string;
  label: string;
  cap: string;
}

const DEFAULT_TIERS: HedgeTier[] = [
  { id: "t1", label: "Tier 1", cap: "up to 100U" },
  { id: "t2", label: "Tier 2", cap: "up to 250U" },
  { id: "top", label: "Top tier", cap: "up to 500U" },
];

interface HedgeRewardTiersProps {
  /** Used by playground only — defaults to all "unlocked". */
  stateOverride?: Record<string, TierState>;
}

export const HedgeRewardTiers = ({ stateOverride }: HedgeRewardTiersProps = {}) => {
  return (
    <section className="bg-[#FDFCF0] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 md:mb-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#E11D48]">
            Rewards
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-tight tracking-tight text-[#0E0E0E] md:text-5xl">
            The bigger your exposure, the bigger the hedge.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {DEFAULT_TIERS.map((t, i) => (
            <HedgeRewardTierCard
              key={t.id}
              tier={t}
              isTop={i === DEFAULT_TIERS.length - 1}
              state={stateOverride?.[t.id] ?? "unlocked"}
            />
          ))}
        </div>

        <p className="mt-6 text-[11px] italic text-[#0E0E0E]/60 md:text-xs">
          *Max redeemable reward is not guaranteed. It depends on your hedge
          position's performance and the campaign reward cap.
        </p>
      </div>
    </section>
  );
};

export const HedgeRewardTierCard = ({
  tier,
  isTop,
  state = "unlocked",
}: {
  tier: HedgeTier;
  isTop?: boolean;
  state?: TierState;
}) => {
  const locked = state === "locked";
  const claimed = state === "claimed";

  return (
    <HedgePosterFrame
      shadow={isTop ? "red" : "yellow"}
      size="sm"
      className={cn(locked && "opacity-60 grayscale")}
    >
      <div className="relative p-6">
        {claimed && (
          <div
            className="absolute right-2 top-2 -rotate-12 border-4 border-[#E11D48] bg-white px-3 py-1 font-display text-xs uppercase tracking-wider text-[#E11D48]"
            style={{ letterSpacing: "0.18em" }}
          >
            Redeemed
          </div>
        )}

        <div className="flex items-center gap-2">
          <div
            className={cn(
              "inline-block border-2 border-[#0E0E0E] px-3 py-0.5 font-display text-xs uppercase tracking-wider",
              isTop ? "bg-[#E11D48] text-white" : "bg-[#FACC15] text-[#0E0E0E]",
            )}
          >
            {tier.label}
          </div>
          {locked && <Lock className="h-4 w-4 text-[#0E0E0E]/60" />}
        </div>

        <div className="mt-5 font-display text-5xl text-[#0E0E0E] md:text-6xl">
          {tier.cap}
        </div>

        <p className="mt-3 text-xs italic text-[#0E0E0E]/60">
          Max redeemable reward<sup>*</sup>
        </p>
      </div>
    </HedgePosterFrame>
  );
};
