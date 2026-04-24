/**
 * HedgeFoundersNote — Personal first-person commitment from the team.
 *
 * The strongest "anti-AI" signal: specific addresses, individual voice,
 * concrete links. AI-generated marketing pages can't fake this convincingly.
 */

import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { XIcon } from "@/components/icons/XIcon";

export const HedgeFoundersNote = () => {
  return (
    <section className="border-b border-border/40 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
          {/* Letter */}
          <div>
            <p className="mb-2 text-[11px] font-mono uppercase tracking-wider text-primary md:mb-3 md:text-xs">
              A note from the team
            </p>
            <h2 className="mb-4 text-xl font-bold tracking-tight md:mb-5 md:text-3xl">
              Why we're spending real money on this
            </h2>
            <div className="space-y-3 text-sm leading-relaxed text-foreground/90 md:space-y-4 md:text-base">
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
            </div>
          </div>

          {/* DESKTOP: vertical sidebar links */}
          <aside className="hidden md:flex md:flex-col md:gap-2 md:rounded-xl md:border md:border-border/40 md:bg-card md:p-5 md:min-w-[220px]">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Talk to us directly
            </p>

            <a
              href="https://discord.gg/qXssm2crf9"
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
              href="https://x.com/OmenX_Official"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex items-center gap-2">
                <XIcon className="h-3.5 w-3.5" />
                <span className="font-medium">@OmenX_Official</span>
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

          {/* MOBILE: 3 equal-width compact icon buttons */}
          <div className="grid grid-cols-3 gap-2 md:hidden">
            <a
              href="https://discord.gg/qXssm2crf9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border/40 bg-card px-2 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="text-base font-semibold">#</span>
              <span className="text-[11px] font-medium">Discord</span>
            </a>
            <a
              href="https://x.com/OmenX_Official"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border/40 bg-card px-2 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <XIcon className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">@OmenX_Official</span>
            </a>
            <a
              href="/transparency"
              className="flex flex-col items-center justify-center gap-1 rounded-lg border border-border/40 bg-card px-2 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Audit</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
