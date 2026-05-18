## 目标

让 funding fee 成为真实记账项：实时累计、持续展示、平仓结算扣除、详情弹窗可查；并附上一个统一的 Position Detail Dialog（按 Overlay 规范桌面 Dialog + 移动 MobileDrawer）。

---

## 一、数据模型（migration）

### 1. `positions` 新增列
- `funding_accrued NUMERIC NOT NULL DEFAULT 0` —— 累计已扣 funding（正=被扣，负=被支付）
- `last_funding_at TIMESTAMPTZ` —— 上次累计 funding 的时间戳（用于按时长结算）

### 2. `event_options` 新增列
- `funding_rate NUMERIC NOT NULL DEFAULT 0` —— 当前小时费率（小数，如 `0.0001` = 0.01%/h）。Long pays Short 为正。
- `next_funding_at TIMESTAMPTZ` —— 下次切换费率的时间

### 3. 新表 `position_funding_ledger`
单调追加的 funding 流水，给详情弹窗与 transparency audit 用。
- `id uuid pk`, `user_id uuid`, `position_id uuid`
- `option_id text`, `event_name text`
- `applied_rate numeric` —— 本次费率
- `notional numeric` —— 本次计费名义本金（`size × mark_price × leverage`）
- `amount numeric` —— 本次扣/付金额（正=扣，负=付）
- `accrual_start timestamptz`, `accrual_end timestamptz`
- `created_at timestamptz default now()`

RLS：
- `positions` / `event_options` 的 RLS 保持不变（新列继承）
- `position_funding_ledger`：用户 SELECT 自己；只有 service-role/cron 可 INSERT（policy `with check (false)` for authenticated → 仅 edge function 用 service role 写）

### 4. `trades` 新增列
- `funding_paid NUMERIC NOT NULL DEFAULT 0` —— 平仓时快照该笔仓位累计的 funding，用于 settlement & 透明度

---

## 二、Funding 累计 Edge Function（cron）

新建 `supabase/functions/accrue-funding/index.ts`：

每小时跑一次（pg_cron）。逻辑：
1. 拉取所有 `status='Open'` 的 positions（带 `option_id`, `size`, `leverage`, `entry_price`, `mark_price`, `side`, `funding_accrued`, `last_funding_at`）
2. 关联 `event_options.funding_rate`
3. 按时长比例计算：`hoursElapsed = (now - last_funding_at) / 3600`
4. `amount = side_sign × applied_rate × notional × hoursElapsed`
   - Long 仓位被扣正费率，Short 反之
   - `notional = size × mark_price × leverage`（用当前 mark）
5. 批量 UPDATE positions：`funding_accrued += amount`, `last_funding_at = now()`
6. 批量 INSERT `position_funding_ledger` 流水
7. 同步把 `pnl` 减去 `amount`（展示 PnL = price PnL − funding，以保持卡片显示一致）

费率刷新（独立或合并到 `update-prices`）：每 N 小时为每个 option 随机重置 `funding_rate ∈ [-0.0002, +0.0002]/h`，并写入 `next_funding_at`。建议合并到现有 `update-prices` 即可。

> 频率折中：真实交易所 8h 一次太慢，demo 看不见效果。**采用 1h 一次**，并允许 cron 用更短周期（例如每 5 分钟）做按比例累计，使界面有动效但金额仍小。

---

## 三、PnL & Settlement 调整

### 1. PnL 公式统一
所有读取 `position.pnl` 的地方含义改成 **"价格 PnL（不含 funding）"**，新增展示字段：
- `unrealizedPnl = position.pnl - position.funding_accrued`
- `netPnl` 是卡片展示主指标

修改文件：
- `src/lib/tradingUtils.ts`：新增 helper `getNetPnl(position)`
- `src/hooks/useSupabasePositions.ts`：返回 `funding_accrued`、`netPnl`

### 2. 平仓时
`useSupabasePositions.ts` 的 close / partial close 流程：
- 关仓前先调用一次 edge function `accrue-funding` 的"单仓追平"模式（POST `{ positionId }`），保证 funding 累到关仓瞬间
- `realizedPnl = priceRealizedPnl - funding_accrued`（部分平仓按比例分摊 funding）
- 写 `trades.funding_paid`，写一条 `position_funding_ledger` 收尾流水
- `marginReturned = margin + realizedPnl`（已扣 funding）

### 3. 实时 PnL UI
所有 position 卡片改成显示 `netPnl`，并保留 tooltip 显示分解。

---

## 四、Position Detail Dialog

新增 `src/components/positions/PositionDetailDialog.tsx`（桌面 Dialog）+ `PositionDetailDrawer.tsx`（移动 MobileDrawer），共享 `PositionDetailContent.tsx`。

入口：position 卡片点击行（非按钮区域）打开。

内容：
- **Header**：event name · option label · Long/Short · leverage
- **PnL block**
  - Net PnL（大字，带颜色）
  - Price PnL · Funding · Open Fee · Est. Close Fee（小字明细）
- **Position**：Entry / Mark / Liq Price / Size / Margin
- **Funding section**
  - Current rate / hour（带方向：You pay · You receive）
  - Accrued since open（绝对值 + 占 margin %）
  - Next accrual countdown（基于 `last_funding_at + 1h`）
  - "View funding history" → 折叠展开最近 10 条 `position_funding_ledger`
- **Footer**：Close Position / Edit TP-SL 两个按钮（直接复用现有逻辑）

---

## 五、UI 现有静态值替换

| 文件 | 现状 | 改为 |
|---|---|---|
| `src/lib/tradingUtils.ts` 第 61 行 | `Funding Rate: "+0.05%"` 写死 | 从所选 option 的 `funding_rate` 实时读 |
| `src/pages/DesktopTrading.tsx` 884 行 Funding Rate 区 | 静态 | 绑定到当前 option |
| `src/pages/TradeOrder.tsx` 122 行 `Funding -0.01%` | 静态 | 绑定到当前 option |
| `src/hooks/useFundingRateAudit.ts` | mock | 改为从 `position_funding_ledger` 取真实流水（保留模拟 on-chain hash） |

---

## 六、Cron 调度

通过 `supabase--insert` 注册 pg_cron（不是 migration）：
```
select cron.schedule(
  'accrue-funding-every-5min',
  '*/5 * * * *',
  $$ select net.http_post(
    url:='https://lbrwdmnctmivgrsgdpqj.supabase.co/functions/v1/accrue-funding',
    headers:='{"Content-Type":"application/json","apikey":"<anon>"}'::jsonb,
    body:='{}'::jsonb
  ); $$
);
```

---

## 七、回滚/兼容性

- 所有新列有 default 值，老仓位安全（`funding_accrued = 0` 起算，`last_funding_at = COALESCE(last_funding_at, created_at)` 在 edge function 里 fallback）
- 静态 `+0.05%` 显示替换为动态值，不影响下单逻辑
- Transparency 的 FundingRateAudit 从 mock 切真数据，UI 形态保持不变

---

## 文件清单

**新建**
- `supabase/functions/accrue-funding/index.ts`
- `src/components/positions/PositionDetailDialog.tsx`
- `src/components/positions/PositionDetailDrawer.tsx`
- `src/components/positions/PositionDetailContent.tsx`
- migration（schema 变更）
- supabase--insert（cron 调度）

**修改**
- `src/hooks/useSupabasePositions.ts`（含 funding 的 PnL、平仓追平）
- `src/lib/tradingUtils.ts`（getNetPnl + 动态 funding rate）
- `src/pages/DesktopTrading.tsx`、`src/pages/TradeOrder.tsx`、`src/components/DesktopHeader.tsx`（静态值替换）
- `src/components/DesktopPositionsPanel.tsx`、`src/components/PositionCard.tsx`（绑定卡片点击 → 详情 Dialog/Drawer，PnL 改 net）
- `src/hooks/useFundingRateAudit.ts`（切真数据）
- `supabase/functions/update-prices/index.ts`（顺手刷新 `funding_rate`）

---

## 待你确认的 2 个参数

1. **累计粒度**：建议 cron 每 5 分钟跑一次按时长累计（用户看得到数字慢慢动）。如果你想要"每小时整点收一次"（更接近永续）也可以。
2. **费率区间**：建议每小时 ±0.02%（年化约 ±175%，对 10x 杠杆 demo 友好可见）。要更激进/温和也可调。

确认这两个数后我开工。