## 目标

让 pending airdrop 的 Activate 按钮旁/下方显示"距离作废还有多久"的倒计时,避免用户错过 72 小时的激活窗口。

## 当前现状

- `expiresAt` 字段已经存在于 `AirdropPosition` 类型上(72h),只是没有在所有入口展示。
- 移动端 `AirdropPositionCard.tsx` 顶部右侧已有 `Clock + timeLeft`(`useCountdown`),但**与 Activate 按钮距离较远**,且只在卡片内部生效。
- 三个 desktop 入口都**没有任何倒计时**:
  - `PortfolioAirdrops.tsx` 桌面表格 Action 列的 Activate 按钮
  - `DesktopTrading.tsx` 交易页 Positions 表里的 PENDING 行 Activate 按钮
  - `TradingCharts.tsx` / `TradeOrder.tsx` 顶部 banner 文案

## 改动方案(纯 UI)

### 1. 抽出可复用倒计时

把 `AirdropPositionCard.tsx` 内的 `useCountdown` 抽到 `src/hooks/useCountdown.ts`,导出:
- `useCountdown(expiresAt)` → `{ timeLeft, isExpired, urgent }`
  - `urgent = diff < 1h`,< 1h 时显示分钟级精度 `Xm Ys`,否则 `Xh Ym`。
  - 内部根据剩余时间动态调整刷新间隔(≥1h 每分钟,<1h 每 10 秒,<1m 每秒)。

### 2. 在 Activate 按钮旁补倒计时

统一样式:小号 `text-[10px]`,默认 `text-trading-yellow`,< 1h 时 `text-trading-red` 并轻微加粗;前缀 `Expires in `,后缀直接是 `2h 14m`。

- **`AirdropPositionCard.tsx`(移动卡片)**:在 Activate 按钮下面追加一行 `Expires in Xh Ym`,与按钮居中对齐;保留顶部 header 的 Clock 标签不变(双重提示,顶部偏宏观,按钮下偏行动)。
- **`PortfolioAirdrops.tsx` 桌面表格**:Action 列的 `Activate` 按钮下面追加一个 `<div>` 显示倒计时;为不挤压列宽,只显示 `Xh Ym`,无前缀。同时把 Status 列的 "Pending" 徽章 hover tooltip 里也写"72h 自动作废"(`HeaderWithInfo` 已经有了,无需改)。
- **`DesktopTrading.tsx`(交易页 PENDING 行)**:Activate 按钮所在 `<td>` 改为按钮 + 下方小字 `Expires Xh Ym`。

### 3. Banner 文案微调(可选,顺手做)

`DesktopTrading.tsx`、`TradingCharts.tsx`、`TradeOrder.tsx`、`DesktopPositionsPanel.tsx` 顶部那条 "🎁 You have N airdrop(s) pending activation — click Activate to claim":
- 当至少有一条 pending 距离作废 < 6h 时,在末尾追加 `· Next expires in Xh Ym`(取最早过期的那条),提醒紧迫性。
- 不改变图标 / 文案主体。

## 不做的事

- 不改后端、数据库、`useAirdropPositions` 数据形状。
- 不改作废逻辑(72h)和过期后处理。
- 不动 Welcome Gift 文案。
- 不加新的通知/弹窗。

## 受影响文件

- 新增:`src/hooks/useCountdown.ts`
- 修改:
  - `src/components/AirdropPositionCard.tsx`(替换本地 hook 引用 + 按钮下补一行)
  - `src/pages/PortfolioAirdrops.tsx`(Action 列 Activate 下补倒计时)
  - `src/pages/DesktopTrading.tsx`(PENDING 行 Action `<td>` 补倒计时;banner 文案紧迫性后缀)
  - `src/pages/TradingCharts.tsx`、`src/pages/TradeOrder.tsx`、`src/components/DesktopPositionsPanel.tsx`(banner 紧迫性后缀)

## 验收

- pending airdrop 在所有入口的 Activate 按钮附近都能看到倒计时,自动每分钟刷新。
- 剩余 < 1h 时颜色变红、显示分钟精度。
- 过期后倒计时消失或显示 Expired,按钮按既有逻辑被移除。