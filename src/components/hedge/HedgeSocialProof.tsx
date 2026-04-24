/**
 * HedgeSocialProof — Lightweight social signal strip.
 *
 * MOCK content — ops should replace `quotes` with real screenshots
 * (`<img src="..." />`) of tweets / Discord messages once available.
 */

import { XIcon } from "@/components/icons/XIcon";
import { DiscordIcon } from "@/components/icons/DiscordIcon";

type Quote = {
  handle: string;
  source: "x" | "discord";
  body: string;
  timeAgo: string;
};

const QUOTES: Quote[] = [
  {
    handle: "@cryptotrader_xyz",
    source: "x",
    body: "Linked my Polymarket wallet to OmenX, got a free $10 hedge on my Trump 2028 long in like 30 seconds. Settled +$8 today. Wild.",
    timeAgo: "2h",
  },
  {
    handle: "@degen_lisa",
    source: "x",
    body: "I was skeptical of 'free money' but the EIP-712 sig is read-only and the hedge actually paid out in USDC on Base. Receipts on-chain.",
    timeAgo: "yesterday",
  },
  {
    handle: "punter_42",
    source: "discord",
    body: "OmenX team paid out my hedge within minutes of the Polymarket market closing. Smoothest claim I've had in this space.",
    timeAgo: "3d",
  },
];

const sourceLabel = (s: Quote["source"]) =>
  s === "x" ? "on X" : "in Discord";

export const HedgeSocialProof = () => {
  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <p className="mb-1.5 text-[11px] font-mono uppercase tracking-wider text-primary md:mb-2 md:text-xs">
              What people are saying
            </p>
            <h2 className="text-xl font-bold tracking-tight md:text-3xl">
              Receipts, not promises
            </h2>
          </div>
          <a
            href="https://x.com/search?q=omenx%20hedge"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline"
          >
            See more on X →
          </a>
        </div>

        {/* Mobile: vertical stack. Desktop: 3-col grid. */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {QUOTES.map((q, i) => (
            <article
              key={i}
              className="flex flex-col rounded-xl border border-border/40 bg-card p-4 md:p-5"
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                {q.source === "x" ? (
                  <XIcon className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <DiscordIcon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="font-mono text-xs text-foreground">
                  {q.source === "x" ? q.handle : `@${q.handle}`}
                </span>
                <span className="text-[10px] text-muted-foreground/70">
                  · {sourceLabel(q.source)} · {q.timeAgo}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {q.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
