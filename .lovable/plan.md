## 问题

持仓详情弹窗里 funding 完全失真：
1. **顶部 Funding 区块永远显示 +0.0000%** —— `PositionCard` 没有把真实的 `funding_rate` 传给 `PositionDetailDrawer`，组件用了默认值 0。
2. **Funding history 表格几乎全是 0** —— 后端 cron 给所有开放仓位都写一条 ledger，哪怕该 option 的 `funding_rate = 0`，导致 99% 的行 amount=0，看起来像"没数据"。

数据库已经验证：最新一批 20 条 ledger 中只有 1 条非零（rate=0.000101, amount=-0.098487），其余全是 0。

## 改动

### 1. 后端：edge function 跳过零费率，不写空记录

`supabase/functions/accrue-funding/index.ts`

在 per-position 循环里：
- 如果 `ratePerHour === 0`，直接 `continue`，**不更新 position，不写 ledger**
- 同时把 `0/0` 这种"金额可能精度归零"的也跳过（`amountR === 0`）

这样 funding ledger 只保留真正发生扣款/收款的记录。已存在的零值老数据不动（保留审计意义；前端会过滤掉）。

### 2. 前端：让真实 funding rate 流到弹窗

新建轻量 hook `src/hooks/useOptionFundingRate.ts`：
- 入参：`optionId: string | null`
- 用 React Query 查询 `event_options.funding_rate`，缓存 30s
- 订阅 `event_options` 表的 realtime 更新，rate 变化自动刷新
- 返回 `{ fundingRatePerHour: number, nextFundingAt: string | null }`

在三处调用方拿到 rate 后传入：
- `src/components/PositionCard.tsx`（移动端，line 471 PositionDetailDrawer）
- `src/components/DesktopPositionsPanel.tsx`（line 275 PositionDetailDialog）
- `src/pages/DesktopTrading.tsx`（line 1198 PositionDetailDialog）

也把 `nextFundingAt` 传下去，替换 `PositionDetailContent` 里基于 `lastFundingAt + 5min` 的估算（更准确）。

### 3. 前端：funding history 过滤零值 + 兜底 limit

`src/hooks/useFundingHistory.ts`
- 查询里加 `.neq('amount', 0)`
- 加 `.limit(200)` 防止极端长度

`src/components/positions/PositionDetailContent.tsx`
- 折叠标题改为 `View funding charges ({history.length})`（语义更准：只包含实际有金额的记录）

## 不改的部分

- ledger 表结构、RLS 不变
- `funding_accrued` / `pnl` 字段累计逻辑不变（只是 0 费率不再触发更新）
- Net PnL 区块的 "Funding paid" 行保持不变（这是 #1 弹窗里唯一的累计资金费展示位）

## 验证

- 改完后 funding rate 非 0 的仓位：弹窗顶部应显示真实费率（如 -0.0100%）和每小时金额
- funding history：只显示真正扣款/收款的行，每行 amount 都不为 0
- 下一次 cron 跑完，零费率 option 不会再产生新的零值 ledger 行
