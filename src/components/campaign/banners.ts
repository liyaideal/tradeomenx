export type BannerThemeKey = "gold" | "primary" | "green" | "violet" | "poster";

export interface CampaignBannerConfig {
  id: string;
  href: string;
  title: string;
  ctaLabel: string;
  qualifierChip?: { text: string; tone: "accent" | "success" | "neutral" };
  heroMetric: { value: string; label: string };
  countdown?: boolean;
  theme: BannerThemeKey;
  /** Full-card cinematic background image. */
  backgroundImage?: string;
}

/**
 * RETIRED 2026-07-31 — the World Cup hedge (H2E) banner was taken offline.
 * The landing page and its components remain; only the home entry was removed.
 * When empty, CampaignBannerCarousel and HomeCampaignRail render nothing.
 */
export const banners: CampaignBannerConfig[] = [];
