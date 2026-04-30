import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell, SectionTitle } from "./SectionShell";

interface Props { onCta: (section: string) => void; }

const rules = [
  "Event 1: First trade ≥ 5,000 USDC volume → Random reward $2–$50 with 100% win rate.",
  "Event 2: Keep trading → Tiered USDC rebates up to $200 based on highest tier only.",
  "Rewards distributed daily by 18:00 UTC+8, next day after qualifying.",
  "Campaign runs May 14 – May 28, 2026.",
  "Only real trading volume counts: fee ratio ≥ 0.04%, no wash trading.",
  "Open to invited users in eligible regions.",
];

export const KeyRules = ({ onCta }: Props) => (
  <SectionShell className="bg-mainnet-surface/50">
    <SectionTitle title="The Rules (Short and Simple)" />
    <div className="rounded-lg border border-border/60 bg-card/70 p-5 md:p-7">
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule} className="flex gap-3 text-sm leading-6 text-muted-foreground md:text-base">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-trading-green" />
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </div>
    <p className="mt-5 text-sm text-muted-foreground">Straightforward rules. No surprises.</p>
    <div className="mt-8 flex justify-center">
      <Button onClick={() => onCta("rules")} className="w-full gap-2 rounded-lg md:w-auto" style={{ background: "var(--gradient-mainnet)" }}>
        Start Trading <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </SectionShell>
);
