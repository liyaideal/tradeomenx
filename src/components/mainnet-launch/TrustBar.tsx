import { BadgeDollarSign, Clock3, Rocket, ShieldCheck } from "lucide-react";
import { SectionShell } from "./SectionShell";

const items = [
  { icon: Rocket, title: "Mainnet Live", body: "No more testnet. This is real. Full production environment." },
  { icon: ShieldCheck, title: "Built on Base", body: "Low gas, fast execution, verifiable on-chain." },
  { icon: BadgeDollarSign, title: "Settle in USDC", body: "Real money in, real money out. No play tokens." },
  { icon: Clock3, title: "Rewards in 24h", body: "Daily reward distribution. No waiting weeks." },
];

export const TrustBar = () => (
  <SectionShell>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="rounded-lg border border-border/60 bg-card/70 p-5">
          <item.icon className="mb-4 h-6 w-6 text-mainnet-gold" />
          <h3 className="mb-2 font-bold text-foreground">{item.title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{item.body}</p>
        </div>
      ))}
    </div>
  </SectionShell>
);
