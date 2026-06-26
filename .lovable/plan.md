## 调整 Voucher 解锁阶梯为 5 阶

### 新规则

| 阶 | 解冻条件 | 累计可解冻 |
|---|---|---|
| T0 | 无门槛（默认） | $2 |
| T1 | 链上充值 ≥ $10 | $5 |
| T2 | 完成 $1,000 交易量 | $10 |
| T3 | 完成 $10,000 交易量 | $20 |
| T4 | 完成 $50,000 交易量 | $50 |

与旧版的关键差异：
- 阶数 4 → 5
- 新增"链上充值"作为非交易量解锁条件（T1）
- 上限大幅下调（旧 T4 Unlimited → 新 T4 $50），不再有 Unlimited 档
- 默认就有 $2 可解冻（T0 无门槛）

### 落地范围

**1. `src/lib/voucherTiers.ts`（核心）**
- `VoucherTier` 增加 `unlock` 字段：`{ kind: "none" } | { kind: "deposit"; amount: number } | { kind: "volume"; amount: number }`
- `VOUCHER_TIERS` 改为 5 条，按上表填值；`maxClaim` 全部为有限值（移除 `null`/Unlimited 处理）
- `deriveVoucherTierState` 入参增加 `depositTotal`：按条件依次判定 current/next
- `formatTierCap` 移除 Unlimited 分支

**2. `src/hooks/useVoucherEarnings.ts`**
- 查询用户链上充值累计（`transactions` 表，type=`deposit` 且 status=`completed`，按 user_id 求和），传入 `deriveVoucherTierState`
- realtime 频道增加 transactions 订阅刷新

**3. `src/components/vouchers/VoucherEarningsCard.tsx`**
- TierSegment 渲染 5 段；副标题展示解锁条件简写（"No req." / "$10 deposit" / "$1K vol" / "$10K vol" / "$50K vol"）
- helper 文案按当前缺口动态生成：
  - 缺充值：`Deposit $X more to reach T1 (up to $5 claimable).`
  - 缺交易量：保持现有 `Trade $X more to reach Tn ...`
  - T4：`Tier T4 unlocked — up to $50.`（删去 Unlimited 文案）
- 移除 lifetimeAtCap 处的 Unlimited 假设

**4. `supabase/functions/claim-voucher-earnings/index.ts`**
- 同步 5 阶配置 + 充值条件；服务端读取用户充值累计与交易量后用同样规则计算 `headroom`
- 上限改为有限值，删除 `null` 分支

**5. `src/pages/StyleGuide/sections/VouchersSection.tsx`（playground）**
- Slider/PresetRail 增加"链上充值累计"维度（presets：$0 / $10 / $25），与"交易量"组合穷举每一档
- 状态读数同步展示 current tier、解锁条件、claimable

**6. memory**
- 更新 `mem://features/voucher-earnings-pool.md` 与 `mem://index.md` Core 中的 Voucher Earnings 行：5 档、新阈值、新增充值条件、移除 Unlimited

### 不在范围
- 不改 voucher 发放/Hold window/7 天 redeem 流程
- 不改 `voucher_earnings` 表结构（只读 + 复用 `transactions` 求和）
