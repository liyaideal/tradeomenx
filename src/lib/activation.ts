// Activation funnel — stage model + lightweight tracking stub.
// All stage derivation lives here so the UI is dumb.

export type ActivationStage = "S0" | "S1" | "S2" | "S3" | "S4";

export interface ActivationInputs {
  isAuthed: boolean;
  /** Real on-chain balance (USDC) */
  balance: number;
  /** H2E / welcome trial balance */
  trialBalance: number;
  /** Any airdrop position pending or activated (counts as "funded") */
  hasAirdrop: boolean;
  /** Number of filled real trades during the mainnet window */
  tradeCount: number;
  /** Mainnet-window filled volume in USD */
  volume: number;
}

export const ENGAGED_VOLUME_THRESHOLD = 5_000;

export const deriveActivationStage = (i: ActivationInputs): ActivationStage => {
  if (!i.isAuthed) return "S0";
  if (i.volume >= ENGAGED_VOLUME_THRESHOLD || i.tradeCount >= 3) return "S4";
  if (i.tradeCount > 0) return "S3";
  if (i.balance > 0 || i.trialBalance > 0 || i.hasAirdrop) return "S2";
  return "S1";
};

export const STAGE_LABELS: Record<ActivationStage, string> = {
  S0: "Visitor",
  S1: "Registered",
  S2: "Funded",
  S3: "Activated",
  S4: "Engaged",
};

// 4-step funnel for ProgressDots (S1..S4)
export const FUNNEL_STEPS: { id: Exclude<ActivationStage, "S0">; label: string }[] = [
  { id: "S1", label: "Sign in" },
  { id: "S2", label: "Fund" },
  { id: "S3", label: "First trade" },
  { id: "S4", label: "Reach $5k" },
];

export const trackActivation = (
  event: "stage_change" | "card_cta_click" | "card_dismiss",
  payload?: Record<string, unknown>,
) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[activation] ${event}`, payload ?? {});
  }
  // Hook for future analytics provider.
};
