/**
 * HedgeFoundersNote — Personal first-person commitment from the team.
 *
 * The strongest "anti-AI" signal: specific addresses, individual voice,
 * concrete links. AI-generated marketing pages can't fake this convincingly.
 */

import { ArrowUpRight } from "lucide-react";
import { XIcon } from "@/components/icons/XIcon";

// MOCK on-chain treasury address — ops should swap for the real Base address.
const TREASURY = "0x4A8b...c39D71";
const TREASURY_FULL = "0x4A8b1c8E2Fa091B0B9D8C0e9b3d1F4c67c39D71";
const BASESCAN_URL = `https://basescan.org/address/${TREASURY_FULL}`;

export const HedgeFoundersNote = () => {
  return (
    <section className="border-b border-border/40 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
          {/* Letter */}
          <div>
            <p className="mb-3 text-xs font-mono uppercase tracking-wider text-primary">
              A note from the team
            </p>
            <h2 className="mb-5 text-2xl font-bold tracking-tight md:text-3xl">
              Why we're spending real money on this
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/90 md:text-base">
              <p>
                Hi — I'm one of the people behind OmenX. We're a small team that
                thinks prediction markets are the most honest financial product
                on the internet, but onboarding has always been brutal: deposit
                first, learn later, hope it works.
              </p>
              <p>
                So we're flipping it. We allocated{" "}
                <span className="font-mono font-semibold text-foreground">150,000 USDC</span>{" "}
                from our own treasury to give Polymarket users a free hedge on
                positions they already hold. No deposit. No tricks. If our
                product is good, you'll come back. If not, you walk away with
                free cash. That's the deal.
              </p>
              <p className="text-muted-foreground">
                Treasury wallet (verifiable on Base):{" "}
                <a
                  href={BASESCAN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-mono text-primary hover:underline"
                >
                  {TREASURY}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Sidebar links */}
          <aside className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card p-5 md:min-w-[220px]">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Talk to us directly
            </p>

            <a
              href="https://discord.gg/j658YbRY"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">#</span>
                <span className="font-medium">Discord</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
            </a>

            <a
              href="https://x.com/omenx_app"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex items-center gap-2">
                <XIcon className="h-3.5 w-3.5" />
                <span className="font-medium">@omenx_app</span>
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
            </a>

            <a
              href="/transparency"
              className="group flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="font-medium">On-chain audit</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
};
