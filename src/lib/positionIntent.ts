import type { UnifiedPosition } from "@/hooks/usePositions";

export type CanonicalSide = "long" | "short";

export interface CanonicalOrder {
  optionLabel: string;
  side: CanonicalSide;
  price: number;
}

export type OrderIntentKind = "open" | "add" | "reduce" | "close" | "blocked-cross-zero";

export interface OrderIntent {
  kind: OrderIntentKind;
  canonical: CanonicalOrder;
  existingPosition?: UnifiedPosition;
  existingQty: number;
  requestedQty: number;
  incrementalMargin: number;
  releasedMargin: number;
  realizedPnl: number;
}

const EPSILON = 0.000001;

export const parseMoney = (value?: string | number | null) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  return parseFloat(String(value).replace(/[$,]/g, "")) || 0;
};

export const isNoLabel = (label: string) => label.trim().toLowerCase() === "no";

export const toCanonicalOrder = (optionLabel: string, side: "buy" | "sell", clickedPrice: number): CanonicalOrder => {
  const noOption = isNoLabel(optionLabel);
  const canonicalSide: CanonicalSide = noOption
    ? side === "buy" ? "short" : "long"
    : side === "buy" ? "long" : "short";

  return {
    optionLabel: noOption ? "Yes" : optionLabel,
    side: canonicalSide,
    price: +(canonicalSide === "long" ? clickedPrice : 1 - clickedPrice).toFixed(4),
  };
};

export const getIntentLabel = (intent: OrderIntent, uiSide: "buy" | "sell") => {
  if (intent.kind === "reduce") return `Reduce ${intent.canonical.side === "long" ? "Short" : "Long"}`;
  if (intent.kind === "close") return `Close ${intent.canonical.side === "long" ? "Short" : "Long"}`;
  if (intent.kind === "blocked-cross-zero") return "Close existing position first";
  return uiSide === "buy" ? "Buy Long" : "Sell Short";
};

export const classifyOrderIntent = ({
  positions,
  eventName,
  optionLabel,
  side,
  quantity,
  clickedPrice,
  leverage,
}: {
  positions: UnifiedPosition[];
  eventName: string;
  optionLabel: string;
  side: "buy" | "sell";
  quantity: number;
  clickedPrice: number;
  leverage: number;
}): OrderIntent => {
  const canonical = toCanonicalOrder(optionLabel, side, clickedPrice);
  const relevant = positions.filter(
    (position) =>
      !position.isAirdrop &&
      position.event === eventName &&
      position.option.toLowerCase() === canonical.optionLabel.toLowerCase()
  );

  const sameSide = relevant.find((position) => position.type === canonical.side);
  const oppositeSide = relevant.find((position) => position.type !== canonical.side);
  const existingPosition = oppositeSide ?? sameSide;
  const existingQty = existingPosition ? parseMoney(existingPosition.size) : 0;
  const requestedQty = Math.max(0, quantity || 0);
  const openingMargin = (clickedPrice * requestedQty) / Math.max(leverage, 1);

  if (!existingPosition || existingQty <= EPSILON) {
    return { kind: "open", canonical, existingQty: 0, requestedQty, incrementalMargin: openingMargin, releasedMargin: 0, realizedPnl: 0 };
  }

  if (existingPosition.type === canonical.side) {
    return { kind: "add", canonical, existingPosition, existingQty, requestedQty, incrementalMargin: openingMargin, releasedMargin: 0, realizedPnl: 0 };
  }

  const margin = parseMoney(existingPosition.margin);
  const entryPrice = parseMoney(existingPosition.entryPrice);
  const closeQty = Math.min(requestedQty, existingQty);
  const releasedMargin = existingQty > 0 ? (margin * closeQty) / existingQty : 0;
  const realizedPnl = existingPosition.type === "long"
    ? (canonical.price - entryPrice) * closeQty
    : (entryPrice - canonical.price) * closeQty;

  if (requestedQty > existingQty + EPSILON) {
    return { kind: "blocked-cross-zero", canonical, existingPosition, existingQty, requestedQty, incrementalMargin: 0, releasedMargin, realizedPnl };
  }

  return {
    kind: Math.abs(requestedQty - existingQty) <= EPSILON ? "close" : "reduce",
    canonical,
    existingPosition,
    existingQty,
    requestedQty,
    incrementalMargin: 0,
    releasedMargin,
    realizedPnl,
  };
};