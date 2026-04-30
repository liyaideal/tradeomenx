import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell, SectionTitle } from "./SectionShell";

interface Props { onCta: (section: string) => void; }

const steps = [
  { n: "01", title: "Open account", body: "Create an OmenX account and enter the mainnet market list." },
  { n: "02", title: "Trade volume", body: "Reach at least $5K volume from opening and closing contract positions." },
  { n: "03", title: "Reward cycle", body: "Event 1 reward enters processing; Event 2 tracks your highest tier." },
];

export const HowItWorks = ({ onCta }: Props) => (
  <SectionShell>
    <SectionTitle eyebrow="Path" title="One trade path. Two reward events." desc="The campaign is intentionally simple: activate with your first qualifying trade, then keep volume moving if the rebate ladder is worth pursuing." />
    <div className="border-y border-border/55">
      {steps.map((step) => (
        <div key={step.n} className="grid gap-4 border-b border-border/45 py-5 last:border-b-0 md:grid-cols-[120px_0.8fr_1.2fr] md:items-center">
          <span className="font-mono text-xs text-mainnet-gold">{step.n}</span>
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">{step.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">{step.body}</p>
        </div>
      ))}
    </div>
    <div className="mt-8 flex justify-start">
      <Button onClick={() => onCta("how_it_works")} className="w-full gap-2 rounded-sm bg-mainnet-gold font-mono text-background hover:bg-mainnet-gold/90 md:w-auto">
        Start Trading <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  </SectionShell>
);
