import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCampaignDayLabel } from "@/lib/mainnetLaunch";
import { Countdown } from "./Countdown";
import { SectionShell } from "./SectionShell";

interface Props { onCta: (section: string) => void; }

export const FinalCTA = ({ onCta }: Props) => (
  <SectionShell>
    <div className="grid gap-6 border border-mainnet-gold/20 bg-mainnet-surface/55 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mainnet-gold">Final window</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-5xl">Complete the first qualifying trade before the campaign closes.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          The launch reward window is fixed. After May 28, new first-trade rewards and ladder rebates stop qualifying.
        </p>
      </div>
      <Button onClick={() => onCta("bottom")} size="lg" className="h-12 w-full gap-2 rounded-sm bg-mainnet-gold font-mono text-background hover:bg-mainnet-gold/90 md:w-auto">
        Start Trading <ArrowRight className="h-4 w-4" />
      </Button>
    </div>

    <div className="mt-5 border border-border/55 bg-background/35 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-foreground">Campaign Timeline</h3>
        <div className="font-mono text-xs text-mainnet-gold"><Countdown compact /></div>
      </div>
      <div className="relative py-5">
        <div className="absolute left-0 right-0 top-8 h-px bg-border/80" />
        <div className="relative grid grid-cols-3 gap-3 text-xs md:text-sm">
          <div>
            <div className="mb-4 h-3 w-3 border border-mainnet-gold bg-mainnet-gold" />
            <p className="font-semibold text-foreground">Launch</p>
            <p className="mt-1 text-muted-foreground">May 14 · 10:00 UTC+8</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-3 w-3 border border-mainnet-orange bg-mainnet-orange" />
            <p className="font-semibold text-mainnet-gold">{getCampaignDayLabel()}</p>
            <p className="mt-1 text-muted-foreground">reward window active</p>
          </div>
          <div className="text-right">
            <div className="ml-auto mb-4 h-3 w-3 border border-border bg-card" />
            <p className="font-semibold text-foreground">Event Ends</p>
            <p className="mt-1 text-muted-foreground">May 28 · 10:00 UTC+8</p>
          </div>
        </div>
      </div>
    </div>
  </SectionShell>
);
