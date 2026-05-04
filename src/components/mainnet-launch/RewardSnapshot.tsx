import { ArrowDown, Coins, Trophy } from "lucide-react";
import { SectionShell, SectionTitle } from "./SectionShell";

const cards = [
  {
    eyebrow: "Guaranteed Reward",
    icon: Coins,
    accent: "mainnet-gold",
    action: "Trade $5K volume",
    actionDetail: "open + close, any market",
    arrow: "→",
    reward: "$2 – $50 USDC",
    rewardDetail: "paid daily · 18:00 UTC+8",
  },
  {
    eyebrow: "Volume Rebate",
    icon: Trophy,
    accent: "mainnet-orange",
    action: "Keep trading",
    actionDetail: "across the 14-day window",
    arrow: "→",
    reward: "up to $200 USDC",
    rewardDetail: "7 tiers · $10K to $1M",
  },
] as const;

export const RewardSnapshot = () => (
  <SectionShell className="bg-mainnet-surface/40">
    <SectionTitle
      eyebrow="What you can earn"
      title="Two rewards. One trade path."
      desc="Hit the activation threshold to unlock a guaranteed bonus. Keep trading to climb the rebate ladder. You can win both."
    />

    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        const accentText = card.accent === "mainnet-gold" ? "text-mainnet-gold" : "text-mainnet-orange";
        const accentBorder = card.accent === "mainnet-gold" ? "border-mainnet-gold/30" : "border-mainnet-orange/30";
        const accentBg = card.accent === "mainnet-gold" ? "bg-mainnet-gold/10" : "bg-mainnet-orange/10";
        return (
          <div
            key={card.eyebrow}
            className={`group relative overflow-hidden rounded-md border ${accentBorder} bg-background/40 p-6 transition-colors hover:bg-background/60 md:p-8`}
          >
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border ${accentBorder} ${accentBg} px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${accentText}`}>
              <Icon className="h-3.5 w-3.5" />
              {card.eyebrow}
            </div>

            <div className="space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">You do</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">{card.action}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.actionDetail}</p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <ArrowDown className="h-3.5 w-3.5" />
                you get
              </div>

              <div>
                <p className={`font-mono text-3xl font-semibold tracking-[-0.02em] md:text-4xl ${accentText}`}>{card.reward}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.rewardDetail}</p>
              </div>
            </div>

            <a
              href="#how-it-works"
              className="mt-7 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              See how it works
              <ArrowDown className="h-3 w-3" />
            </a>
          </div>
        );
      })}
    </div>
  </SectionShell>
);
