import { ArrowRight, CircleDollarSign, LineChart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell, SectionTitle } from "./SectionShell";

interface Props { onCta: (section: string) => void; }

const steps = [
  { n: "01", icon: UserPlus, title: "Sign Up", body: "Create your OmenX account in 30 seconds. No KYC needed." },
  { n: "02", icon: LineChart, title: "Make Your First Trade", body: "Trade any event with ≥5K USDC volume. Pick any market you like." },
  { n: "03", icon: CircleDollarSign, title: "Get Paid", body: "Win $2–$50 USDC instantly. Keep trading for even bigger rebates." },
];

export const HowItWorks = ({ onCta }: Props) => (
  <SectionShell>
    <SectionTitle title="How to Claim Your Reward" />
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step) => (
        <div key={step.n} className="relative rounded-lg border border-border/60 bg-card/70 p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-sm text-mainnet-gold">{step.n}</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-mainnet-gold/10 text-mainnet-gold">
              <step.icon className="h-5 w-5" />
            </div>
          </div>
          <h3 className="mb-3 text-lg font-bold text-foreground">{step.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
        </div>
      ))}
    </div>
    <div className="mt-8 flex justify-center">
      <Button onClick={() => onCta("how_it_works")} className="w-full gap-2 rounded-lg md:w-auto" style={{ background: "var(--gradient-mainnet)" }}>
        Start Trading <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </SectionShell>
);
