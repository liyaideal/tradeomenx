/**
 * Total Equity 口径（Dual-Account · 2b 全站单一 source）
 *
 * Total Equity = spot_balance + balance (futures available) + trial_balance
 *
 * 不含未实现盈亏。任何 UI（顶栏 Equity 胶囊 / 首页 Hero / /wallet Band 1 /
 * HoverCard 汇总）读该口径必须走此 helper，禁止再各处拼装。
 */
export const computeTotalEquity = (parts: {
  spotBalance?: number | null;
  balance?: number | null;
  trialBalance?: number | null;
}): number => {
  return (
    (parts.spotBalance ?? 0) +
    (parts.balance ?? 0) +
    (parts.trialBalance ?? 0)
  );
};

export const formatEquityUsd = (value: number, digits = 2): string =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
