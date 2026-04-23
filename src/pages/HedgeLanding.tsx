import { useEffect, useRef } from "react";
import { HedgeNavbar } from "@/components/hedge/HedgeNavbar";
import { HedgeHero } from "@/components/hedge/HedgeHero";
import { HedgeHowItWorks } from "@/components/hedge/HedgeHowItWorks";
import { HedgeLiveExample } from "@/components/hedge/HedgeLiveExample";
import { HedgeTrustBar } from "@/components/hedge/HedgeTrustBar";
import { HedgeKeyRules } from "@/components/hedge/HedgeKeyRules";
import { HedgeFAQ } from "@/components/hedge/HedgeFAQ";
import { HedgeFinalCTA } from "@/components/hedge/HedgeFinalCTA";
import { HedgeFooter } from "@/components/hedge/HedgeFooter";
import { HedgeMobileFloatingCTA } from "@/components/hedge/HedgeMobileFloatingCTA";

const HedgeLanding = () => {
  // We watch the entire Hero section so the floating CTA only appears
  // once the user has fully scrolled past the primary CTA above the fold.
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Hedge-to-Earn — Free hedge on your Polymarket positions | OmenX";

    const desc =
      "Connect your Polymarket wallet and OmenX will airdrop you a free counter-position hedge. $0 cost, read-only access, up to $100 in free trading credit.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <div className="w-full bg-background text-foreground">
      <HedgeNavbar />
      <main>
        <div ref={heroRef}>
          <HedgeHero />
        </div>
        <HedgeHowItWorks />
        <HedgeLiveExample />
        <HedgeTrustBar />
        <HedgeKeyRules />
        <HedgeFAQ />
        <HedgeFinalCTA />
      </main>
      <HedgeFooter />
      <HedgeMobileFloatingCTA triggerRef={heroRef} />
    </div>
  );
};

export default HedgeLanding;
