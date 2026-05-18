## 排查结论

Mobile 卡片（`PositionCard`）和 Desktop 持仓表（`DesktopTrading.tsx` / `DesktopPositionsPanel.tsx`）确实**用的是同一个数据源**：都是 `useRealtimePositionsPnL.calculateRealtimePnL`。两边算出来的 Unrealized PnL **是一致的**。

不一致的是**列表 vs 详情弹窗**。你截图里的弹窗 PnL = +$24.00 (+300%)，但列表/卡片显示的会是 +$2.40 (+30%)。原因是公式不同：

| 来源 | 公式 | 例（short, entry 0.38, mark 0.35, size 80, margin $8, 10×）|
|---|---|---|
| `useRealtimePositionsPnL`（列表/卡片）| `pnl = priceDiff × size` | **+$2.40 / +30%** |
| `PositionDetailContent`（弹窗）| `pricePnl = priceDiff × size × side × leverage` | **+$24.00 / +300%** ❌ |

详情弹窗把 leverage 又乘了一次，相当于把 PnL 和百分比都放大了 10 倍（截图正好 +300% = 30% × 10）。

行业惯例：永续合约里 `size` 已经是"张数/合约数"，PnL = (mark − entry) × size，杠杆只决定保证金占用，不再二次乘。所以**列表的公式是对的，弹窗错了**。

顺带还有两处受同一个 bug 影响：
- 弹窗里的 `notional = size × mark × leverage` 也多乘了一次，被放大 10×。正确应为 `size × mark`。
- `supabase/functions/accrue-funding/index.ts` 同样用了 `notional = size × mark × leverage`，会导致 funding 费率按 10× notional 收取（demo 数据里因为 funding_rate=0 还没暴露出来，但跑起来就会偏大）。

## 修复方案

只改公式，不动列表/卡片 UI，不改数据库结构。

### 1. `src/components/positions/PositionDetailContent.tsx`
- `pricePnl` 去掉 `× position.leverageNum`，与列表 `calculateRealtimePnL` 对齐：
  - `pricePnl = (mark − entry) × size × sideSign`
- `notional` 去掉 `× leverage`：
  - `notional = size × mark`
- `openFee` / `estCloseFee` 同步去掉 leverage 倍数（按真实名义额收费）。
- "Net unrealized PnL" 仍然 = `pricePnl − fundingPaid`；百分比仍按 `/ marginNum × 100`（这样保留杠杆放大效应的口径，对齐"按保证金看回报率"）。
- 这样卡片 +$2.40 / +30%，弹窗 Net = +$2.40 − funding，且 Price PnL = +$2.40，百分比 ≈ +30%，与列表一致；funding 单独显示一行说明差异。

### 2. `supabase/functions/accrue-funding/index.ts`
- 把 `const notional = Number(p.size) * mark * Number(p.leverage)` 改成 `Number(p.size) * mark`，让历史 ledger 与未来的 funding 一致。已经写入的 ledger 行不动（demo 数据 funding_rate=0，影响为 0）。

### 3. 文档/记忆
- 在 `mem://features/real-time-price-updates` 或新建一条 `mem://technical/pnl-formula-canonical` 记下：
  - "PnL = (mark − entry) × size，杠杆只影响 margin 与 %收益率，禁止在 PnL 公式中二次乘 leverage。"
  - "notional = size × mark。"

## 不做的事
- 不动 mobile/desktop 列表显示（它们本来就对）。
- 不改 `positions.pnl` 数据库字段语义（仍然是"价格 PnL 减 funding"的净额）。
- 不改 funding 的费率方向 / 周期。
