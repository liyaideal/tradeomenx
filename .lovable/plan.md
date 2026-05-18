问题定位：

- desktop table 调用 `calculateRealtimePnL(position)`，即使 `position.optionId` 为空，也会用 `event + option` 做 fallback 匹配到 `event_options`，所以能拿到实时 mark price。
- mobile `PositionCard` 先判断 `if (optionId)`，只有存在直接 `optionId` 才调用 `calculateRealtimePnL`；如果旧仓位/本地仓位没有 `optionId`，mobile 会直接回退到仓位创建时的 `markPrice` 和旧 `pnl`。
- 详情抽屉也有同类问题：`PositionDetailContent` 只用直接 `position.optionId` 查实时价，parent 传入的 `liveMarkPrice` 又来自 mobile card 的同一个受限逻辑，所以同样会显示 stale mark price。

这就是截图里同一个 S&P 500 仓位：desktop mark price 是 `$0.2000`、P&L 是负数；mobile mark price 仍是 `$0.2300`、P&L 是 `+$0.00` 的原因。

修复计划：

1. 修复 mobile card 实时 P&L 数据源
   - 修改 `src/components/PositionCard.tsx`
   - 移除 `if (optionId)` 的提前限制
   - 始终调用 `calculateRealtimePnL({ event, option, optionId, type, entryPrice, size, margin })`
   - 这样 mobile 与 desktop 共用同一个 fallback matching 逻辑

2. 修复详情弹窗/抽屉的实时价格 fallback
   - 修改 `src/hooks/useRealtimePositionsPnL.ts`
   - 暴露一个统一的 `getRealtimePositionPrice(position)` 或等价 helper，让详情也能复用直接 `optionId` + fallback matching
   - 修改 `src/components/positions/PositionDetailContent.tsx`
   - mark price 优先级改为：统一 realtime lookup → parent `liveMarkPrice` → stored `position.markPriceNum`

3. 保持 P&L 公式不变
   - `pricePnl = (mark − entry) × size × sideSign`
   - `pnlPercent = netPnl / margin × 100`
   - 不把 leverage 乘进 P&L / notional

4. 校验点
   - 同一仓位在 mobile card、mobile detail、desktop table、desktop detail 中应显示相同 mark price 与 Unrealized P&L
   - 对没有 `optionId` 的旧仓位也应能实时更新
   - 对有 `optionId` 的新仓位行为不变