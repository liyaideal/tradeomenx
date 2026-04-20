
用户反馈：DesktopOrderBook 顶部的 Buy/Sell 切换 tab 多了一行很奇怪，希望去掉手动切换，改成跟随右侧交易面板的 side 联动。

## 方案

让 DesktopOrderBook 的 `bookSide` 由父组件 `DesktopTrading` 的 `side` state 驱动，移除 OrderBook 内部的 tab UI。

## 改动清单

### 1. `src/components/DesktopOrderBook.tsx`
- 移除内部 `bookSide` useState 和顶部 Buy/Sell 切换 tab UI
- 改为通过 props 接收 `side: "buy" | "sell"`，直接用它来决定 `transformPrice` 和 asks/bids 互换逻辑
- 保留所有价格转换逻辑（Sell 时 price → 1 - price，asks/bids 对调）

### 2. `src/pages/DesktopTrading.tsx`
- 把现有的 `side` state 作为 prop 传给 `<DesktopOrderBook side={side} />`
- 用户在右侧交易面板切 Buy/Sell tab 时，左侧 OrderBook 自动跟着切换视角

## 不改动
- 移动端（OrderBook.tsx 本来就没加 tab）
- 价格转换逻辑本身
- TradeForm / 其他面板

## 效果
用户切 Buy → 看到 long 价格深度；切 Sell → 看到 short 价格深度（asks/bids 对调 + 价格 1−p）。无额外 UI，零学习成本。
