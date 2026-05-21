## 目标

在 `/settings/transparency` → "Am I Being Overcharged?" 的资金费率审计流程中，新增一个**结算周期列表页**，让用户在选完持仓后先看到该仓位的所有 funding 结算记录，再点选某一条进入"单次结算核验"。同时把每次结算的窗口与时间信息显式带入核验详情页。

## 新流程

```text
idle → select(持仓) → periods(结算周期列表) → fetching → comparing → result(单次结算核验)
```

回退路径：result → periods（同一持仓换一条结算记录） → select（换持仓） → idle。

## 1. Hook 改造 — `src/hooks/useFundingRateAudit.ts`

- `FundingRateStep` 增加 `"periods"`。
- 新增类型 `FundingPeriodRecord`，对接 `position_funding_ledger`（已有 hook `useFundingHistory` 返回的同名字段）：
  - `id`, `applied_rate`, `notional`, `amount`, `accrual_start`, `accrual_end`, `created_at`（作为 `settlementTs` 使用）
- 新增 state：`periods: FundingPeriodRecord[]`、`selectedPeriod: FundingPeriodRecord | null`。
- 新增方法：
  - `selectPosition(pos)` 不再直接进核验，而是设 `step="periods"`，并调用 `loadPeriods(pos.id)` 拉取该 position 的 ledger。
  - `loadPeriods(positionId)`：`from("position_funding_ledger").select(...).eq("position_id", id).neq("amount", 0).order("created_at", { ascending: false }).limit(200)`。空集时 `periods` 设为 `[]`，UI 显示空态。
  - `selectPeriod(period)`：保留现有 fetching → comparing 节奏，把模拟出来的 on-chain 字段改成"基于该 period 派生"（详见下方字段映射）。
  - `backToPeriods()`：从 result 回到 periods，仅清 `audit` 与 `selectedPeriod`。
- `reset()` 同步清理 `periods` 与 `selectedPeriod`。

### 单次核验字段映射（result 数据来源）

- 真实字段（来自 ledger）：
  - `fundingRate` ← `period.applied_rate`
  - `appliedAmount` ← `Math.abs(period.amount)`
  - `direction` ← `period.amount < 0 ? "paid" : "received"`
  - `notional` ← `period.notional`（新增字段，详情页展示）
  - `windowStart` ← `period.accrual_start`
  - `windowEnd` ← `period.accrual_end`
  - `settledAt` ← `period.created_at`
- 仍然模拟（mock）：`eventId`, `outcomeId`, `txHash`, `blockNumber`（保持现有 mockHex 风格，因为是链上证据占位）。
- `ratesMatch` 始终 true（与现有逻辑保持一致）。

## 2. 组件改造 — `src/components/transparency/FundingRateAudit.tsx`

新增一个 `periods` 渲染分支，插在现有 `select` 与 `fetching` 之间：

- 顶部 `DesktopBackLink` 回到 `select`（调用 `openSelector`）。
- 头部小卡：复用当前 result 的"position info"小卡样式，展示所选持仓（event_name / option_label / side / leverage / size）。
- 列表区域：
  - 空态："No funding settlements yet for this position."
  - Loading：`Loader2` 居中。
  - 每行按钮（与 `select` 行风格一致 `rounded-xl bg-muted/30 hover:bg-muted/50`）：
    - 左列：`settledAt` 短日期 + 窗口区间 `start – end`（`font-mono text-xs`）
    - 右列：`appliedRate`（带正负号、emerald/red）+ `±amount USDC`
  - 列表 `max-h-[50vh] overflow-y-auto`，按 `settledAt` 倒序。
- 不使用 emoji，icon 用 `Clock` / `Percent`（Lucide）。

### `result` 分支增量

在现有 "Contract fields" 卡上方新增一张"Settlement Window"卡：
- `settledAt`（绝对时间，`font-mono`）
- `windowStartTsMs – windowEndTsMs`（"Funding Window"）
- `notional`（结算时仓位名义价值）

"On-Chain Event Fields" 表里追加：
- `windowStart` / `windowEnd` / `settlementTs`（ISO 字符串截到秒，`font-mono`）

"Verify Another" 行为改为：调用 `backToPeriods()` 回到结算列表，而非直接重选持仓；同行追加次按钮 "Change Position" 触发 `openSelector()`。

## 3. 不改动

- `useFundingHistory.ts`、`position_funding_ledger` 表结构、RLS：当前已能满足需求。
- 其他 transparency 模块、settings 路由、share/poster 流程。

## 4. QA / 自检

- 持仓列表点入 → 进入 periods 页，列表与 `useFundingHistory` 返回一致（按持仓过滤、按时间倒序、跳过 `amount = 0`）。
- 点任意结算条目 → fetching → comparing → result，详情页 rate / amount / window / settledAt 与所选 ledger 行一致。
- result 上 "Verify Another" 回到 periods 而不是 select；"Change Position" 回到 select。
- 空 ledger 持仓显示空态，不报错。
- 桌面 1021×777 与移动窄屏均无横向滚动。

## 5. 文档与索引

完成后追加交付文档 `docs/changelog/2026-05-21-funding-rate-periods-step.md`，并按既定规则同步更新 `docs/changelog/INDEX.md`（新增一行摘要）与 `docs/changelog/STATUS.md`（新批次 ⬜ 项：Hook step 扩展 / Periods 列表页 / Result 详情页字段扩展 / 回退路径）。
