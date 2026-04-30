import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCampaignDayLabel } from "@/lib/mainnetLaunch";
import { Countdown } from "./Countdown";
import { SectionShell } from "./SectionShell";

interface Props { onCta: (section: string) => void; }

export const FinalCTA = ({ onCta }: Props) => (
  <SectionShell>
    <div className="rounded-lg border border-mainnet-gold/25 bg-mainnet-gold/5 p-6 text-center md:p-10">
      <h2 className="text-3xl font-black text-foreground md:text-5xl">The clock is ticking.</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
        Mainnet launch rewards won't last forever. 14 days. Then they're gone.
      </p>
      <Button onClick={() => onCta("bottom")} size="lg" className="mt-7 w-full gap-2 rounded-lg md:w-auto" style={{ background: "var(--gradient-mainnet)" }}>
        Start Trading <ArrowRight className="h-5 w-5" />
      </Button>
      <div className="mt-5 text-sm text-muted-foreground">
        Ends May 28, 2026 · 10:00 UTC+8 · <Countdown compact />
      </div>
    </div>

    <div className="mt-6 rounded-lg border border-border/60 bg-card/70 p-5 md:p-7">
      <h3 className="mb-6 text-lg font-bold text-foreground">Campaign Timeline</h3>
      <div className="relative px-2 py-5">
        <div className="absolute left-4 right-4 top-8 h-1 rounded-full bg-mainnet-gold/20" />
        <div className="relative grid grid-cols-3 gap-3 text-xs md:text-sm">
          <div>
            <div className="mb-4 h-4 w-4 rounded-full bg-mainnet-gold" />
            <p className="font-semibold text-foreground">Launch</p>
            <p className="text-muted-foreground">May 14 · 10:00 UTC+8</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 h-4 w-4 rounded-full bg-mainnet-orange shadow-[0_0_20px_hsl(var(--mainnet-orange)/0.6)]" />
            <p className="font-semibold text-mainnet-gold">You Are Here</p>
            <p className="text-muted-foreground">{getCampaignDayLabel()}</p>
          </div>
          <div className="text-right">
            <div className="ml-auto mb-4 h-4 w-4 rounded-full bg-border" />
            <p className="font-semibold text-foreground">Event Ends</p>
            <p className="text-muted-foreground">May 28 · 10:00 UTC+8</p>
          </div>
        </div>
      </div>
    </div>
  </SectionShell>
);
