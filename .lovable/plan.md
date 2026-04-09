

## H2E Airdrop 完整流程补全

### 缺失功能分析
根据 PRD 和截图，当前实现缺少以下关键功能：

1. **Pending Activation 按钮应跳转到对应 event 的交易页**（当前跳转到 `/events`）
2. **交易页的 Positions 面板需要展示 airdrop 仓位**（带 pending activation 提示 banner）
3. **Airdrop 通知系统**（新 airdrop 到达时的 toast 通知 + 通知入口）

### 计划

#### 1. Mock 数据添加 `counterEventId` 字段
**文件**: `src/hooks/useAirdropPositions.ts`

- 给 `AirdropPosition` 接口添加 `counterEventId: string`
- Mock 数据中映射到真实 event ID（如 `mock-airdrop-1` 的 BTC 对应 event `"2"`，Fed 对应 event `"4"`，ETH 对应 event `"3"`）
- 这样 "Activate" 按钮可以跳转到 `/trade?event={counterEventId}`

#### 2. AirdropPositionCard 按钮跳转到对应 event
**文件**: `src/components/AirdropPositionCard.tsx`

- 将 `navigate("/events")` 改为 `navigate(`/trade?event=${airdrop.counterEventId}`)`
- 移动端改为 `/trade/order?event=${airdrop.counterEventId}`

#### 3. 交易页 Positions 面板展示 airdrop 仓位
**文件**: `src/components/DesktopPositionsPanel.tsx`（桌面端）

- 引入 `useAirdropPositions`
- 在 Positions tab 的仓位列表上方，如果有 `pendingAirdrops`，显示一个黄色提示 banner：
  - `🎁 You have {n} airdrop(s) pending activation — make a trade to claim`
- 已激活的 airdrop 仓位作为特殊行显示在 positions 列表末尾（带 AIRDROP badge）

**文件**: `src/pages/TradeOrder.tsx`（移动端，已有部分实现）

- 当前 `pendingAirdrops` 在 Positions tab 之外渲染。需要移到 Positions tab 内部
- 同样在 Positions 列表上方添加 pending activation banner

#### 4. Airdrop 到达通知
**文件**: 新建 `src/components/AirdropNotificationToast.tsx`

- 创建一个组件，使用 `useAirdropPositions` 监听 `pendingAirdrops` 变化
- 当 demo 扫描完成（从 0 到 N 个 pending airdrops）时，触发 sonner toast：
  - `🎁 New Airdrop Received! You have a $10 counter-position on "BTC End of Q1 2026 Price". Activate it by making a trade.`
  - toast 带 action 按钮 "View" 跳转到 `/portfolio` 的 airdrops tab

**文件**: `src/App.tsx` 或相关布局

- 在全局布局中挂载 `AirdropNotificationToast` 组件

#### 5. 文件变更汇总

| 文件 | 变更 |
|------|------|
| `src/hooks/useAirdropPositions.ts` | 添加 `counterEventId` 字段到接口和 mock 数据 |
| `src/components/AirdropPositionCard.tsx` | 跳转到对应 event 交易页 |
| `src/components/DesktopPositionsPanel.tsx` | Positions tab 展示 airdrop 仓位 + pending banner |
| `src/pages/TradeOrder.tsx` | 移动端 Positions tab 内展示 airdrop 仓位 + pending banner |
| `src/components/AirdropNotificationToast.tsx` | 新建：全局 airdrop 到达通知 |
| `src/App.tsx` | 挂载通知组件 |

