import { SectionWrapper, SubSection } from "../components/SectionWrapper";
import { SingleDevicePreview } from "../components/DeviceFrame";

/**
 * Mobile Home — 真组件 + 全状态 + 375 真态。
 *
 * All previews mount real production components (or hook-locked mirrors clearly
 * labeled "MIRROR") inside a 375px iframe via <SingleDevicePreview device="mobile">. No more
 * fake `max-w-[360px]` desktop containers.
 *
 * Preview keys live in `../preview/mobileHomePreviews.tsx` and are registered
 * in `../preview/registry.tsx`.
 */
export const MobileHomeSection = () => {
  return (
    <div className="space-y-10">
      <SectionWrapper
        id="mobile-home-composed"
        title="Full-page composition — real components stacked"
        description="Real MobileHeader + HomeEquityHero + PersonalSlot + HomeCampaignRail + HomeTopEvents + BottomNav, rendered in a 375px iframe. Toggle Mobile to see actual mobile layout; Desktop toggle shows the same components at full width so drift is obvious."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mhome-full-page"
          label="Composed live — session-driven content"
          minHeight={780}
        />
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-header"
        title="Header (Preset A)"
        description="Real MobileHeader in Preset A configuration used by / (MobileHome): showLogo + no back + Discord/Globe/Bell action cluster. See DESIGN.md §10 for the preset table."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mhome-header-preset-a"
          label="Preset A · logo left · action cluster right"
          minHeight={110}
        />
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-equity-hero"
        title="HomeEquityHero (Preset D card)"
        description="Real <HomeEquityHero>. The card automatically renders the guest CTA when useAuth() has no user, or the equity block when signed in. Only real state available in style-guide session shown."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mhome-equity-hero-live"
          label="Live · auth-driven branch"
          minHeight={220}
        />
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-greeting"
        title="HomeGreeting — every branch"
        description="Live real component + three MIRRORS covering the branches HomeGreeting.tsx renders (guest, authed with 7D data, authed without 7D data). Mirrors are marked in the preview file and must stay 1:1 with production."
        platform="mobile"
      >
        <div className="space-y-4">
          <SingleDevicePreview device="mobile"
            previewKey="mhome-greeting-live"
            label="Live · real component (session-driven branch)"
            minHeight={260}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mhome-greeting-guest"
            label="MIRROR · Guest branch"
            minHeight={260}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mhome-greeting-authed-active"
            label="MIRROR · Authed · has 7D data"
            minHeight={220}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mhome-greeting-authed-empty"
            label="MIRROR · Authed · no 7D activity"
            minHeight={220}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-personal-slot"
        title="PersonalSlot — every branch"
        description="Real <PersonalSlot> renders 0/1 card based on onboarding progress + open position. Live shows current session branch; mirrors cover Onboarding step and PositionAlert branches for style reference."
        platform="mobile"
      >
        <div className="space-y-4">
          <SingleDevicePreview device="mobile"
            previewKey="mhome-personal-slot-live"
            label="Live · real PersonalSlot (may be empty)"
            minHeight={140}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mhome-personal-slot-onboarding"
            label="MIRROR · Onboarding step 2/3"
            minHeight={140}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mhome-personal-slot-position-alert"
            label="MIRROR · PositionAlertCard"
            minHeight={140}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-campaign-rail"
        title="HomeCampaignRail (real)"
        description="Real component pulling from banners registry. Horizontal snap rail; dots follow real banner count."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mhome-campaign-rail"
          label="Live · all banners from src/components/campaign/banners"
          minHeight={220}
        />
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-mainnet-callout"
        title="MainnetLaunchCallout (real)"
        description="Standalone conversion strip. Used both as a standalone module and as HomeTopEvents interlude (rendered after 2 markets)."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mhome-mainnet-callout"
          label="Live · standalone"
          minHeight={140}
        />
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-top-events"
        title="HomeTopEvents — with and without interlude"
        description="Real <HomeTopEvents>; hook-driven data. Interlude prop demonstrated with MainnetLaunchCallout injected between rows 2 and 3."
        platform="mobile"
      >
        <div className="space-y-4">
          <SingleDevicePreview device="mobile"
            previewKey="mhome-top-events-live"
            label="Live · default title (no interlude)"
            minHeight={480}
          />
          <SingleDevicePreview device="mobile"
            previewKey="mhome-top-events-interlude"
            label='Live · title="Pick your first prediction" + MainnetLaunchCallout interlude'
            minHeight={520}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper
        id="mobile-home-bottom-nav"
        title="BottomNav (real)"
        description="Real <BottomNav> with safe-area padding. Displayed inside a bounded relative container so fixed positioning is visible."
        platform="mobile"
      >
        <SingleDevicePreview device="mobile"
          previewKey="mhome-bottom-nav"
          label="Live · fixed bottom · safe area"
          minHeight={260}
        />
      </SectionWrapper>
    </div>
  );
};
