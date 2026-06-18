import bannerHedge from "@/assets/banner-hedge.jpg";

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

export const banners: CampaignBannerConfig[] = [
  {
    id: "hedge",
    href: "/hedge",
    title: "Hedge your prediction trades. Free.",
    ctaLabel: "Open Hedge",
    qualifierChip: { text: "No deposit", tone: "success" },
    heroMetric: { value: "$100", label: "Free hedge credit" },
    theme: "primary",
    backgroundImage: bannerHedge,
  },
];
