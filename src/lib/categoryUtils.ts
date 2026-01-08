// Unified category system with consistent colors
// Based on event icon to determine category

export interface CategoryInfo {
  category: string;
  label: string; // Display label
  color: string; // HSL color value for custom styling
}

// Master category definitions with consistent colors
export const CATEGORY_STYLES = {
  Social: { class: "bg-primary/20 text-primary", hsl: "260 60% 55%" },
  Crypto: { class: "bg-trading-yellow/20 text-trading-yellow", hsl: "48 100% 55%" }, 
  Finance: { class: "bg-trading-green/20 text-trading-green", hsl: "145 80% 42%" },
  Market: { class: "bg-muted text-foreground", hsl: "222 25% 55%" },
  Politics: { class: "bg-trading-purple/20 text-trading-purple", hsl: "260 65% 58%" },
  Tech: { class: "bg-primary/20 text-primary", hsl: "260 60% 55%" },
  general: { class: "bg-muted text-foreground", hsl: "222 25% 55%" },
} as const;

export type CategoryType = keyof typeof CATEGORY_STYLES;

// Get category info based on category string from database
export const getCategoryInfo = (categoryKey: string): CategoryInfo => {
  const normalizedKey = categoryKey.toLowerCase();
  
  const categoryMap: Record<string, { label: string; hsl: string }> = {
    social: { label: "Social", hsl: CATEGORY_STYLES.Social.hsl },
    crypto: { label: "Crypto", hsl: CATEGORY_STYLES.Crypto.hsl },
    finance: { label: "Finance", hsl: CATEGORY_STYLES.Finance.hsl },
    market: { label: "Market", hsl: CATEGORY_STYLES.Market.hsl },
    politics: { label: "Politics", hsl: CATEGORY_STYLES.Politics.hsl },
    tech: { label: "Tech", hsl: CATEGORY_STYLES.Tech.hsl },
    general: { label: "General", hsl: CATEGORY_STYLES.general.hsl },
  };

  const match = categoryMap[normalizedKey] || categoryMap.general;
  return {
    category: normalizedKey,
    label: match.label,
    color: match.hsl,
  };
};

// Get category info based on event icon (legacy support)
export const getCategoryInfoFromIcon = (icon: string): CategoryInfo => {
  switch (icon) {
    case "🐦": // Twitter/Social
      return getCategoryInfo("social");
    case "₿": // Bitcoin
    case "⟠": // Ethereum
      return getCategoryInfo("crypto");
    case "🏦": // Federal Reserve/Banking
    case "📈": // Stock market
      return getCategoryInfo("finance");
    case "🏛️": // Politics
      return getCategoryInfo("politics");
    case "🤖": // Tech
    case "🍎": // Apple
      return getCategoryInfo("tech");
    default:
      return getCategoryInfo("general");
  }
};

// Get category from event name as fallback
export const getCategoryFromName = (name: string): CategoryInfo => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("tweet") || lowerName.includes("twitter") || lowerName.includes("elon")) {
    return getCategoryInfo("social");
  }
  if (lowerName.includes("bitcoin") || lowerName.includes("btc") || lowerName.includes("eth") || lowerName.includes("crypto")) {
    return getCategoryInfo("crypto");
  }
  if (lowerName.includes("fed") || lowerName.includes("rate") || lowerName.includes("s&p") || lowerName.includes("stock")) {
    return getCategoryInfo("finance");
  }
  if (lowerName.includes("president") || lowerName.includes("election") || lowerName.includes("government") || lowerName.includes("shutdown")) {
    return getCategoryInfo("politics");
  }
  if (lowerName.includes("openai") || lowerName.includes("gpt") || lowerName.includes("tesla") || lowerName.includes("apple")) {
    return getCategoryInfo("tech");
  }
  
  return getCategoryInfo("general");
};
