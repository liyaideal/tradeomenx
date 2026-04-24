/**
 * HedgeCampaignRules — Full legal/operational terms for the H2E program.
 *
 * Pure typographic layout (no icons, cards, or accordions). Operations team
 * can edit copy directly in the constants below.
 */

const mono = "font-mono text-foreground";

export const HedgeCampaignRules = () => {
  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Campaign Rules
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Full terms for the Hedge-to-Earn program.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground md:text-base">
          {/* I. Eligibility */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground md:text-xl">
              I. Eligibility
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                This campaign is open only to invited users in supported regions.
                Users in restricted jurisdictions cannot participate.
              </li>
            </ul>
          </div>

          {/* II. Reward & Settlement Rules */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground md:text-xl">
              II. Reward &amp; Settlement Rules
            </h3>
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                Airdrop positions are <span className="font-medium text-foreground">simulated positions</span> used solely
                to track PnL — they do not lock real funds. They cannot be traded,
                closed, increased, or reversed. The airdrop direction is always
                <span className="font-medium text-foreground"> opposite</span> to the user's original
                Polymarket position (e.g. if you are LONG <span className={mono}>BTC &gt; $100K</span> on
                Polymarket, the airdrop will be <span className={mono}>SHORT</span>).
              </li>
              <li>
                Once your Polymarket account is linked, the system scans your
                positions <span className={mono}>every 15 minutes</span>. Airdrops are issued only after
                a scan confirms eligibility — actual delivery time prevails. A
                maximum of <span className={mono}>3 airdrops</span> can be issued per account during the
                campaign.
              </li>
              <li>
                After issuance, users must <span className="font-medium text-foreground">manually claim</span> the
                airdrop within the campaign period. Unclaimed airdrops expire
                automatically and cannot be reissued.
              </li>
              <li>
                <span className="font-medium text-foreground">Settlement triggers:</span>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-medium text-foreground">Event settlement</span> — when the
                    corresponding Polymarket event resolves.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Original position close</span> — when
                    the system detects the user has reduced their original
                    Polymarket position by <span className={mono}>≥ 80%</span>, PnL is calculated at
                    that moment's Market Price.
                  </li>
                </ul>
              </li>
              <li>
                Settled positive PnL is credited to the user's OmenX trading
                balance, capped at <span className={mono}>$100</span> per account (lifetime).
              </li>
              <li>
                <span className="font-medium text-foreground">Unlock threshold:</span> settled PnL becomes
                tradable / withdrawable only after the user reaches <span className={mono}>≥ $400,000</span>
                {" "}cumulative trading volume on OmenX.
              </li>
              <li>
                Unlocked balance expires on <span className={mono}>May 31, 2026 23:59 (UTC+8)</span>. Any
                unused portion is forfeited.
              </li>
              <li>
                Daily issuance is capped at <span className={mono}>500 airdrops</span> platform-wide. No
                new airdrops are issued once the daily cap is reached.
              </li>
              <li>
                Total reward pool: <span className={mono}>150,000 USDC</span>. When the pool is exhausted
                the campaign ends early, and any locked PnL that has not been
                unlocked will become unusable.
              </li>
              <li>
                Airdrops can be viewed via in-app notifications and the
                <span className="font-medium text-foreground"> Positions</span> page.
              </li>
            </ol>
          </div>

          {/* III. Risk Control & Disclaimer */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-foreground md:text-xl">
              III. Risk Control &amp; Disclaimer
            </h3>
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                Users flagged by our risk-control system for abnormal behavior
                will be disqualified and forfeit all rewards.
              </li>
              <li>
                If the platform determines that a user has engaged in cheating
                or violations, OmenX reserves the right to disqualify them and
                claw back distributed rewards without prior notice.
              </li>
              <li>
                Disputes regarding rewards must be submitted via our{" "}
                <a
                  href="https://discord.gg/j658YbRY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Discord
                </a>{" "}
                within <span className={mono}>7 days</span> of campaign end. Late submissions are
                treated as waiver.
              </li>
              <li>
                OmenX reserves the right to modify these rules at any time
                without prior notice.
              </li>
              <li>
                The final interpretation of this campaign belongs to OmenX.
              </li>
            </ol>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground/70">
          Last updated: Apr 2026 · OmenX reserves the right of final interpretation.
        </p>
      </div>
    </section>
  );
};
