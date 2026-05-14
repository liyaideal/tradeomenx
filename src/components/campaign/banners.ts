import bannerMainnet from "@/assets/banner-mainnet-launch.jpg";
import bannerHedge from "@/assets/banner-hedge.jpg";

export type BannerThemeKey = "gold" | "primary" | "green" | "violet";

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
    id: "mainnet-launch",
    href: "/mainnet-launch",
    title: "Trade once. Earn up to $200.",
    ctaLabel: "Join Now",
    qualifierChip: { text: "100% WIN RATE", tone: "accent" },
    heroMetric: { value: "$5K", label: "Weekly pool" },
    countdown: true,
    theme: "gold",
    backgroundImage: bannerMainnet,
  },
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
