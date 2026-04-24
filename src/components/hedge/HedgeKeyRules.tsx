import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const mono = "font-mono font-medium text-foreground";

// 6 rules — split into two semantic groups:
//   1-3: ELIGIBILITY (trading-green check)
//   4-6: REWARD MECHANICS (primary check)
// Each rule expands to its detailed campaign-rules counterpart.
const RULES: {
  group: "eligibility" | "reward";
  short: React.ReactNode;
  detail: React.ReactNode;
}[] = [
  {
    group: "eligibility",
    short: (
      <>
        Position notional value <span className={mono}>≥ $200</span> on Polymarket
      </>
    ),
    detail: (
      <>
        Your Polymarket position must have a notional value of at least{" "}
        <span className={mono}>$200</span> at the time of scan. Smaller positions
        are skipped automatically — they may qualify later if you scale up.
      </>
    ),
  },
  {
    group: "eligibility",
    short: (
      <>
        Position held for at least <span className={mono}>3 days</span>
      </>
    ),
    detail: (
      <>
        We require a continuous holding period of <span className={mono}>≥ 3 days</span>{" "}
        to filter out short-term flippers. Closing and re-opening resets the clock.
      </>
    ),
  },
  {
    group: "eligibility",
    short: (
      <>
        Matching OmenX event has <span className={mono}>≥ 72 hours</span> until
        resolution
      </>
    ),
    detail: (
      <>
        The corresponding OmenX market must have at least{" "}
        <span className={mono}>72 hours</span> remaining until settlement so the
        hedge has meaningful runway. Markets closing sooner are excluded.
      </>
    ),
  },
  {
    group: "reward",
    short: (
      <>
        Each qualifying position receives a <span className={mono}>$10</span> free
        counter-side hedge
      </>
    ),
    detail: (
      <>
        Once linked, the system scans your positions{" "}
        <span className={mono}>every 15 minutes</span>. Each eligible position is
        airdropped a simulated counter-position worth <span className={mono}>$10</span>.
        It tracks PnL only — it doesn't lock real funds and can't be traded,
        closed, or reversed. After issuance you must{" "}
        <span className="font-medium text-foreground">manually claim</span> within
        the campaign window.
      </>
    ),
  },
  {
    group: "reward",
    short: (
      <>
        Up to <span className={mono}>3 active airdrops</span> per linked account
      </>
    ),
    detail: (
      <>
        A maximum of <span className={mono}>3 airdrops</span> can be issued per
        account during the campaign. Daily issuance is capped at{" "}
        <span className={mono}>500 airdrops</span> platform-wide; once the daily
        cap is reached no new airdrops are issued until the next day.
      </>
    ),
  },
  {
    group: "reward",
    short: (
      <>
        Airdrops expire in <span className={mono}>72 hours</span> if not activated ·
        Max <span className={mono}>$100</span> lifetime per account
      </>
    ),
    detail: (
      <>
        Unclaimed airdrops expire automatically after <span className={mono}>72 hours</span>{" "}
        and cannot be reissued. Settled positive PnL is credited to your OmenX
        balance, capped at <span className={mono}>$100 lifetime</span> per account.
        Settlement happens when (a) the OmenX market resolves, or (b) the system
        detects you've reduced your original Polymarket position by{" "}
        <span className={mono}>≥ 80%</span>. Unlocked balance becomes
        tradable/withdrawable after you reach{" "}
        <span className={mono}>≥ $400,000</span> cumulative volume on OmenX, and
        expires <span className={mono}>May 31, 2026 23:59 (UTC+8)</span>. Total
        reward pool: <span className={mono}>150,000 USDC</span>.
      </>
    ),
  },
];

const groupColor = (group: "eligibility" | "reward") =>
  group === "eligibility"
    ? "bg-trading-green/20 text-trading-green"
    : "bg-primary/20 text-primary";

export const HedgeKeyRules = () => {
  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-24">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
            The fine print isn't fine print
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:mt-3 md:text-base">
            Six rules. Tap to expand for the full terms.
          </p>
        </div>

        {/* Group legend */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground md:mb-5 md:gap-4 md:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-trading-green" />
            Eligibility
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Reward mechanics
          </span>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {RULES.map((rule, i) => (
            <AccordionItem
              key={i}
              value={`rule-${i}`}
              className="overflow-hidden rounded-xl border border-border/40 bg-card px-4 last:border-b md:px-5"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-start gap-3 text-left">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${groupColor(rule.group)}`}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-[13px] font-medium leading-snug text-foreground md:text-sm md:leading-relaxed">
                    {rule.short}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-8 text-sm leading-relaxed text-muted-foreground">
                {rule.detail}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Risk & disclaimer collapsed at the bottom */}
        <details className="mt-8 rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground/90 md:px-5">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
            Risk control & disclaimer
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Users flagged by our risk-control system for abnormal behavior will
              be disqualified and forfeit all rewards.
            </li>
            <li>
              If the platform determines that a user has engaged in cheating or
              violations, OmenX reserves the right to disqualify them and claw
              back distributed rewards without prior notice.
            </li>
            <li>
              Disputes regarding rewards must be submitted via our{" "}
              <a
                href="https://discord.gg/qXssm2crf9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Discord
              </a>{" "}
              within <span className={mono}>7 days</span> of campaign end. Late
              submissions are treated as waiver.
            </li>
            <li>
              OmenX reserves the right to modify these rules at any time without
              prior notice. The final interpretation of this campaign belongs to
              OmenX.
            </li>
          </ul>
          <p className="mt-3 text-[10px] text-muted-foreground/70">
            Open to invited users in supported regions only · Last updated: Apr 2026
          </p>
        </details>
      </div>
    </section>
  );
};
