## 目标
Voucher 仓位平仓盈利不再直接进 `trial_balance`，改为进入独立的 **Voucher Earnings** 池。在 `/vouchers` 页面新增展示模块，用户累计成交名义额达到 **50,000 USDC** 后，可一键 claim 全部累计盈利到 wallet 的 available balance（`profiles.balance`）。

## 改动概览

### 1. 数据库（migration）
新增 `voucher_earnings` 表（每用户一行池子余额）：
- `user_id`（unique）
- `pending_amount`（待 claim 的累计盈利）
- `lifetime_credited`（历史已 claim 总额，统计用）
- `last_settled_at`

新增 `voucher_earnings_ledger` 表（明细，方便 UI 列表与审计）：
- `user_id`、`type`（`accrual` | `claim`）
- `amount`（accrual 为正、claim 为负）
- `airdrop_position_id`（accrual 时关联）
- `created_at`

新增 RLS：用户可 SELECT 自己的行；只有 service_role 可写。配套 GRANT。

### 2. Edge function 改造
- `close-trial-position`：把"盈利 → `profiles.trial_balance`"那段替换为"盈利 → `voucher_earnings.pending_amount` + 一条 `accrual` ledger"。
- 新增 `claim-voucher-earnings`：
  1. 校验 user，读取 `voucher_earnings.pending_amount`；
  2. 计算用户历史交易量 = `SELECT COALESCE(SUM(amount),0) FROM trades WHERE user_id=? AND status='Filled'`；
  3. 若 < 50000 或 pending ≤ 0 → 返回 400 + 当前进度；
  4. 否则把 pending 加到 `profiles.balance`，pending 清零，`lifetime_credited += amount`，写一条 `claim` ledger，并在 `transactions` 表（如果允许 service_role 写入）插入一条 `voucher_claim` 类型记录用于交易历史。

### 3. 前端
- 新建 `src/hooks/useVoucherEarnings.ts`：
  - 查询 `voucher_earnings` 当前用户行；
  - 查询交易量（直接 `select sum`）；
  - 暴露 `pending`、`volume`、`required = 50000`、`progressPct`、`canClaim`、`claim()`。
- 新建 `src/components/vouchers/VoucherEarningsCard.tsx`：
  - 顶部大字：Pending Earnings（USDC，font-mono）
  - 中部：交易量进度条 `volume / 50,000 USDC`，剩余多少达标
  - 底部按钮：达标且 pending>0 → `Claim to wallet`；否则 disabled，附说明文案
  - 可选：展开最近 ledger 明细
- `src/pages/Vouchers.tsx`：在 voucher 列表上方插入 `VoucherEarningsCard`。
- 文案统一加入 `docs/copy-dictionary.md`：`Pending earnings / Trading volume / Claim to wallet / Volume requirement`。

### 4. 记忆更新
新增 `mem://features/voucher-earnings-pool`，记录：
- 盈利只进 `voucher_earnings.pending_amount`，**绝不**进 `trial_balance`；
- claim 门槛：lifetime Filled trades 名义额 ≥ 50,000 USDC；
- claim 一次清空所有 pending → `profiles.balance`。
更新 index Core 一行提示。

## 技术细节
- 不修改 `airdrop_positions.settled_pnl` 字段（仍记录原始 credited PnL，方便审计）；只改"钱去哪儿"。
- `transactions` 表当前用户无 INSERT 权限，由 edge function 用 service_role 写入新 `type = 'voucher_claim'`，并在 `TransactionHistory` 的类型映射中补一个标签 + 颜色（属于现有 history-labels 体系内的小补充）。
- 历史已经误入 `trial_balance` 的 voucher 盈利不回滚（避免破坏现有余额），仅从本次改动起生效，UI 上以"Pending earnings"从 0 开始累计。

## 不在范围
- 不调整 voucher 仓位的杠杆 / 关闭逻辑 / cap 公式；
- 不改 wallet 页面其它余额结构；
- 不做 partial claim、不做手动选择 claim 多少。
