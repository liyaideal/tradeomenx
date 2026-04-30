import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { AuthSheet } from "@/components/auth/AuthSheet";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { MobileHeader } from "@/components/MobileHeader";
import { SeoFooter } from "@/components/seo/SeoFooter";
import { FAQ } from "@/components/mainnet-launch/FAQ";
import { FinalCTA } from "@/components/mainnet-launch/FinalCTA";
import { Hero } from "@/components/mainnet-launch/Hero";
import { HowItWorks } from "@/components/mainnet-launch/HowItWorks";
import { KeyRules } from "@/components/mainnet-launch/KeyRules";
import { MobileFloatingCTA } from "@/components/mainnet-launch/MobileFloatingCTA";
import { ProgressDashboard } from "@/components/mainnet-launch/ProgressDashboard";
import { RewardLadder } from "@/components/mainnet-launch/RewardLadder";
import { TrustBar } from "@/components/mainnet-launch/TrustBar";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { trackMainnetLaunch } from "@/lib/mainnetLaunch";

const MainnetLaunch = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [authOpen, setAuthOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "OmenX Mainnet Launch — First Trade Bonus";
    const desc = "Trade on OmenX mainnet and win $2–$50 USDC on your first qualifying trade, plus volume rebates up to $200.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) localStorage.setItem("mainnet_launch_ref", ref);
    trackMainnetLaunch("mainnet_launch_page_view", { ref: ref ?? localStorage.getItem("mainnet_launch_ref") });
  }, [searchParams]);

  const handleCta = (section: string) => {
    trackMainnetLaunch("mainnet_launch_cta_click", { section });
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const ref = searchParams.get("ref") ?? localStorage.getItem("mainnet_launch_ref");
    navigate(ref ? `/events?ref=${encodeURIComponent(ref)}` : "/events");
  };

  useEffect(() => {
    if (!user || !authOpen) return;
    setAuthOpen(false);
    const ref = searchParams.get("ref") ?? localStorage.getItem("mainnet_launch_ref");
    navigate(ref ? `/events?ref=${encodeURIComponent(ref)}` : "/events");
  }, [user, authOpen, navigate, searchParams]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground">
      <div className="md:hidden">
        <MobileHeader title="Mainnet Launch" showLogo={false} showBack />
      </div>
      <div className="hidden md:block">
        <EventsDesktopHeader />
      </div>

      <main className="w-full max-w-full overflow-hidden">
        <div ref={heroRef}>
          <Hero onCta={handleCta} />
        </div>
        <ProgressDashboard onCta={handleCta} />
        <HowItWorks onCta={handleCta} />
        <RewardLadder onCta={handleCta} />
        <TrustBar />
        <KeyRules onCta={handleCta} />
        <FAQ />
        <FinalCTA onCta={handleCta} />
      </main>

      <SeoFooter />
      {isMobile ? <AuthSheet open={authOpen} onOpenChange={setAuthOpen} /> : <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="signup" />}
      <MobileFloatingCTA triggerRef={heroRef} onCta={handleCta} />
    </div>
  );
};

export default MainnetLaunch;
