## 目标

V1 只做"兑换页 + 兑换后进入 positions"两块。投放（运营后台）和邮件不在此次范围。复用 `airdrop_positions` 流水线，让兑换后的仓位自动出现在 `/portfolio` 和 `/trade` 的 Positions 模块。

## 关键差异 vs H2E

| 维度 | H2E airdrop | Voucher 兑换 |
|---|---|---|
| 来源 | 系统匹配 polymarket 持仓后空投 | 用户主动用券兑换 |
| 初始状态 | `pending`，要点 Activate | **直接 `active`**（兑换动作即激活） |
| 用户能否手动平仓 | **不能** | **不能**（沿用 h2e 规则） |
| 退出时机 | event 结算 / 对手 polymarket 仓位关闭 | event 结算 / **持仓满 72h** |
| 收益封顶 | 现有 h2e 规则 | `min(unrealized_pnl, face_value × 50%)` |

→ 仓位 UI 上**不显示 Close 按钮**，Action 列保持锁定/连字符态（跟 h2e 的 active airdrop 一样），只靠系统自动平仓。

## 数据模型

### 新表 `position_vouchers`

- `user_id`、`code`（6 位字母数字）、`face_value`
- `redeemable_cap_pct`（默认 0.5）、`max_holding_hours`（默认 72）
- `entry_price_min`/`entry_price_max`（默认 0.20 / 0.80）
- `min_hours_to_settlement`（默认 12）
- `status`：`issued` / `redeemed` / `expired` / `revoked`
- `issued_at` / `expires_at` / `redeemed_at`
- `redeemed_airdrop_position_id`、`redeemed_event_id` / `redeemed_option_id` / `redeemed_side`

RLS：用户 SELECT 自己的；INSERT/UPDATE 仅 admin / service_role。

### `airdrop_positions` 扩展

- `source` check 扩成 `('matched','welcome_gift','voucher')`
- `connected_account_id` 改 nullable（voucher 没有连号）
- 新增 `redeemable_cap numeric NULL` — voucher 行写 `face_value × cap_pct`，其余 source 为 NULL（走旧规则）
- 复用 `expires_at` 表示"max_holding_until"（voucher 写 `now() + 72h`）
- Voucher 仓位 INSERT 时 `status='active'`、`activated_at=now()`、`activated_trade_id=NULL`

## 兑换页 `/vouchers`

未登录套 `AuthGateOverlay`。登录后列出该用户所有 `status='issued'` 的券。

点 Redeem 打开 Dialog（桌面）/ MobileDrawer（移动）：

1. **Step 1 — 选 event/option/side**
   - 列出当前 tradable events（`useActiveEvents`）。
   - 每个 option 校验：价格 ∈ voucher 区间、`end_date - now ≥ min_hours_to_settlement`、未 resolved。
   - 不符合的灰掉 + tooltip 写原因（"Price out of 0.20–0.80 band" / "Closes within 12h" / "Already resolved"），不隐藏。
   - 支持搜索 + category 筛选。
2. **Step 2 — 确认面板**
   - 展示 entry price、size = face/entry、`max holding until`（72h 倒计时）、`redeemable cap = face × 50%`、自动平仓规则、"Position can't be closed manually — auto-settles at event end or after 72h"。
3. 提交 → edge function `redeem-position-voucher`。

## Edge function `redeem-position-voucher`

POST body `{ voucherId, eventId, optionId, side }`，service role 校验：

1. 用 `voucherId + user_id` 锁券，确认 `issued` 且未过期。
2. 再校验 event/option：未 resolved、settlement 余量、价格在 voucher 区间。
3. INSERT `airdrop_positions`：
   - `source='voucher'`、`connected_account_id=NULL`
   - `counter_*` 写 event/option 快照
   - `airdrop_value = face_value`、`redeemable_cap = face_value × cap_pct`
   - `status='active'`、`activated_at=now()`、`expires_at=now() + max_holding_hours h`
4. 乐观锁 UPDATE `position_vouchers ... WHERE status='issued' RETURNING`；空就报"券已被兑换"。
5. 返回 airdrop_position id，前端跳 `/trade?event=…` 或 `/portfolio`。

## 自动平仓（沿用 h2e settlement edge function）

V1 不新建 cron。在现有 h2e settlement function 里把"settle 条件"扩成对 voucher source 同时支持：

- event resolved → 按胜负结算，但收益封顶 `min(pnl, redeemable_cap)`，亏损不扣用户余额（trial）。
- `now() > expires_at` → 强制以当时 mark price 平仓，同样套 `redeemable_cap`。

> 这一步如果时间紧，可以先只做"event resolved → settle"，72h 强平先留 TODO，因为现有 h2e settlement 已经处理 event resolved，加 voucher cap 一行就行。

## 前端改动清单

- 新页面 `src/pages/Vouchers.tsx` + 路由 `/vouchers`。
- 新组件：`VoucherCard` / `RedeemVoucherDialog`（桌面）/ `RedeemVoucherDrawer`（移动）/ `EventPickerList`（disabled + reason tooltip）。
- 新 hook `src/hooks/usePositionVouchers.ts`。
- `useAirdropPositions` / `AirdropPositionCard` / Positions 表加 `source==='voucher'` 分支：
  - 徽章紫色 "Voucher"（替代 "Airdrop"）
  - 直接走 active 分支（没有 Activate 按钮）
  - **沿用 h2e 的"无 Close 按钮、TP/SL 锁定"行为**
  - Tooltip 提示 redeemable cap 与自动结算时机
- `Portfolio` / `MobileHome` 顶部加 "You have N unredeemed voucher(s) → Redeem" 入口横幅（没邮件，用户得自己找入口）。

## 不在此次范围

- 邮件发送
- 运营后台投放页（运营直接往 `position_vouchers` insert）
- 全新独立的强平 cron（V1 复用 h2e 那条 settlement function；72h 强平视时间情况）

## 实施顺序

1. migration：建 `position_vouchers`、扩 `airdrop_positions.source`、加 `redeemable_cap`、放开 `connected_account_id` NULL、RLS / GRANT。
2. edge function `redeem-position-voucher`。
3. 前端：`/vouchers` 页 + 组件 + hook + 路由。
4. Positions 渲染层加 voucher 分支（紫色徽章、直接 active、无 Close 按钮）。
5. h2e settlement function 加 `redeemable_cap` 封顶分支。
6. Portfolio 顶部未兑券提醒条。
