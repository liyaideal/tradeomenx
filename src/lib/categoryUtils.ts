// Unified category system with consistent colors
// Based on event icon to determine category

export interface CategoryInfo {
  category: string;
  color: string; // Tailwind class for badge styling
}

// Master category definitions with consistent colors
export const CATEGORY_STYLES = {
  Social: "bg-primary/20 text-primary",
  Crypto: "bg-trading-yellow/20 text-trading-yellow", 
  Finance: "bg-trading-green/20 text-trading-green",
  Market: "bg-muted text-foreground",
} as const;

export type CategoryType = keyof typeof CATEGORY_STYLES;

// Get category info based on event icon
export const getCategoryInfo = (icon: string): CategoryInfo => {
  switch (icon) {
    case "🐦": // Twitter/Social
      return { category: "Social", color: CATEGORY_STYLES.Social };
    case "₿": // Bitcoin
    case "⟠": // Ethereum
      return { category: "Crypto", color: CATEGORY_STYLES.Crypto };
    case "🏦": // Federal Reserve/Banking
    case "📈": // Stock market
      return { category: "Finance", color: CATEGORY_STYLES.Finance };
    default:
      return { category: "Market", color: CATEGORY_STYLES.Market };
  }
};

// Get category from event name as fallback
export const getCategoryFromName = (name: string): CategoryInfo => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("tweet") || lowerName.includes("twitter") || lowerName.includes("elon")) {
    return { category: "Social", color: CATEGORY_STYLES.Social };
  }
  if (lowerName.includes("bitcoin") || lowerName.includes("btc") || lowerName.includes("eth") || lowerName.includes("crypto")) {
    return { category: "Crypto", color: CATEGORY_STYLES.Crypto };
  }
  if (lowerName.includes("fed") || lowerName.includes("rate") || lowerName.includes("s&p") || lowerName.includes("stock")) {
    return { category: "Finance", color: CATEGORY_STYLES.Finance };
  }
  
  return { category: "Market", color: CATEGORY_STYLES.Market };
};
