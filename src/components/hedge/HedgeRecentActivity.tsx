/**
 * HedgeRecentActivity — Horizontally auto-scrolling "recent activity" feed.
 *
 * Mock data, written for visual liveness (similar to an exchange's
 * "latest trades" ticker). Operations can edit FEED items directly.
 */

import { Sparkles, CheckCircle2, Link2, TrendingUp } from "lucide-react";

type FeedItem = {
  icon: typeof Sparkles;
  user: string;
  action: string;
  amount?: string;
  tone: "green" | "primary" | "muted";
};

const FEED: FeedItem[] = [
  { icon: CheckCircle2, user: "@cryptotrader_xyz", action: "claimed hedge", amount: "$10.00", tone: "green" },
  { icon: TrendingUp, user: "@degen_lisa", action: "settled +", amount: "$7.20", tone: "green" },
  { icon: Link2, user: "@0xmidas", action: "linked Polymarket", tone: "primary" },
  { icon: CheckCircle2, user: "@punter_42", action: "claimed hedge", amount: "$10.00", tone: "green" },
  { icon: TrendingUp, user: "@hedge_queen", action: "settled +", amount: "$8.40", tone: "green" },
  { icon: Sparkles, user: "@new_user_91", action: "qualified for airdrop", tone: "primary" },
  { icon: Link2, user: "@dao_voter", action: "linked Polymarket", tone: "primary" },
  { icon: TrendingUp, user: "@btc_maxi_88", action: "settled +", amount: "$6.10", tone: "green" },
  { icon: CheckCircle2, user: "@anon_whale", action: "claimed hedge", amount: "$10.00", tone: "green" },
  { icon: Sparkles, user: "@earlybird", action: "qualified for airdrop", tone: "primary" },
];

const toneClass = (tone: FeedItem["tone"]) => {
  if (tone === "green") return "text-trading-green";
  if (tone === "primary") return "text-primary";
  return "text-muted-foreground";
};

export const HedgeRecentActivity = () => {
  // Duplicate the feed once for seamless infinite scroll.
  const stream = [...FEED, ...FEED];

  return (
    <section
      aria-label="Recent activity"
      className="relative overflow-hidden border-b border-border/40 bg-card/60"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 md:px-6 md:py-2.5">
        <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-trading-green animate-pulse" />
          Live
        </span>

        <div className="relative flex-1 overflow-hidden">
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-card/60 to-transparent md:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-card/60 to-transparent md:w-12" />

          <div
            className="hedge-marquee-track flex w-max items-center gap-4 whitespace-nowrap md:gap-6"
          >
            {stream.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.user}-${i}`}
                  className="flex items-center gap-2 text-xs"
                >
                  <Icon className={`h-3.5 w-3.5 ${toneClass(item.tone)}`} />
                  <span className="font-mono text-foreground">{item.user}</span>
                  <span className="text-muted-foreground">{item.action}</span>
                  {item.amount && (
                    <span className={`font-mono font-semibold ${toneClass(item.tone)}`}>
                      {item.amount}
                    </span>
                  )}
                  <span className="text-border">·</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hedge-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hedge-marquee-track {
          animation: hedge-marquee 30s linear infinite;
        }
        @media (min-width: 768px) {
          .hedge-marquee-track {
            animation-duration: 50s;
          }
        }
      `}</style>
    </section>
  );
};
