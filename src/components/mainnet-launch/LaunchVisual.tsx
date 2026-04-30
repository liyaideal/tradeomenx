import { Coins, Sparkles } from "lucide-react";

export const LaunchVisual = () => {
  return (
    <div className="relative min-h-[280px] md:min-h-[520px] overflow-hidden rounded-lg border border-mainnet-gold/20 bg-mainnet-surface shadow-[0_0_60px_hsl(var(--mainnet-gold)/0.12)]">
      <div className="absolute inset-0" style={{ background: "var(--gradient-mainnet-glow)" }} />
      <div className="absolute bottom-0 left-1/2 h-56 w-32 -translate-x-1/2 bg-gradient-to-t from-mainnet-orange/60 via-mainnet-gold/20 to-transparent blur-2xl" />
      <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-mainnet-gold animate-sparkle" />
      <div className="absolute right-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-mainnet-orange animate-sparkle [animation-delay:450ms]" />
      <div className="absolute left-[22%] bottom-[28%] h-1.5 w-1.5 rounded-full bg-mainnet-gold animate-sparkle [animation-delay:900ms]" />

      <div className="absolute left-[10%] top-[22%] rotate-[-12deg] rounded-full border border-mainnet-gold/40 bg-mainnet-gold/10 px-3 py-2 text-sm font-bold font-mono text-mainnet-gold shadow-lg shadow-mainnet-gold/10 animate-float">
        $50
      </div>
      <div className="absolute right-[12%] top-[34%] rotate-[10deg] rounded-full border border-mainnet-orange/40 bg-mainnet-orange/10 px-3 py-2 text-sm font-bold font-mono text-mainnet-orange shadow-lg shadow-mainnet-orange/10 animate-float [animation-delay:600ms]">
        $20
      </div>
      <div className="absolute left-[16%] bottom-[18%] rotate-[8deg] rounded-full border border-mainnet-gold/40 bg-mainnet-gold/10 px-3 py-2 text-sm font-bold font-mono text-mainnet-gold shadow-lg shadow-mainnet-gold/10 animate-float [animation-delay:1100ms]">
        $10
      </div>

      <div className="absolute right-[16%] bottom-[24%] flex h-14 w-14 items-center justify-center rounded-full border border-mainnet-gold/40 bg-mainnet-gold/10 text-mainnet-gold animate-float [animation-delay:300ms]">
        <Coins className="h-7 w-7" />
      </div>
      <div className="absolute left-[20%] top-[44%] flex h-11 w-11 items-center justify-center rounded-full border border-mainnet-orange/35 bg-mainnet-orange/10 text-mainnet-orange animate-float [animation-delay:900ms]">
        <Sparkles className="h-5 w-5" />
      </div>

      <svg
        viewBox="0 0 220 260"
        aria-label="Rocket launching from OmenX"
        className="absolute left-1/2 top-1/2 h-64 w-56 -translate-x-1/2 -translate-y-1/2 text-mainnet-gold animate-rocket-lift"
      >
        <defs>
          <linearGradient id="rocketBody" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--mainnet-gold))" stopOpacity="0.58" />
          </linearGradient>
          <linearGradient id="rocketFlame" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--mainnet-gold))" />
            <stop offset="100%" stopColor="hsl(var(--mainnet-ember))" />
          </linearGradient>
        </defs>
        <path d="M110 18C78 47 68 92 76 146h68c8-54-2-99-34-128Z" fill="url(#rocketBody)" stroke="hsl(var(--mainnet-gold))" strokeWidth="3" />
        <circle cx="110" cy="82" r="18" fill="hsl(var(--mainnet-surface))" stroke="hsl(var(--mainnet-gold))" strokeWidth="5" />
        <path d="M76 138 42 180l42-8M144 138l34 42-42-8" fill="hsl(var(--mainnet-orange) / 0.28)" stroke="hsl(var(--mainnet-orange))" strokeWidth="3" />
        <path d="M94 146h32l-16 86-16-86Z" fill="url(#rocketFlame)" />
        <path d="M83 206h54" stroke="hsl(var(--mainnet-gold) / 0.45)" strokeWidth="8" strokeLinecap="round" />
        <text x="110" y="122" textAnchor="middle" className="fill-background font-mono text-[22px] font-bold">OX</text>
      </svg>
    </div>
  );
};
