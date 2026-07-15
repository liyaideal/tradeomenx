---
name: Pro / Spot US stocks pilot
description: Multi-product-line engine — first Spot pilot (US stock daily up/down). 3 seed events, no-leverage semantics, 5-state lifecycle, 4 placeholder timing constants
type: feature
---

# Pro 现货（Spot）产品线 — 美股当日涨跌试点

## 上线范围（2026-07-15）

平台首次拆分产品线：`events.product_lines` / `trades.product_line` / `positions.product_line` = `futures` | `spot`（CHECK 已加）。合约端行为不变；本轮仅上线 3 个现货试点事件。

## 现货语义（与合约的关键差异）

- 每份 Yes/No = $0–1 之间的份额，价格即概率
- Yes 获胜每份付 $1；输方 $0；**最大亏损 = 已付金额**
- **无杠杆 / 无 TP/SL / 无资金费 / 无强平价**（UI 不渲染，service 强制 `leverage=1, fee=0`）
- Buy = 建/加 long；Sell = 减/平已持有 long；**禁止空头**（前端 + `executeSpotTrade` 双校验）
- Trial Bonus 优先扣（复用 `useUserProfile.deductBalance` 口径）

## 状态机 5 态

`events.lifecycle_status`：`TRADING` / `EXTENDED_TRADING` / `PRE_FREEZE` / `FROZEN` / `CANCELED`。徽标配色与 `isOrderingBlocked` 判定见 `src/lib/usStockSessions.ts`。

## 4 个时刻表常量（PLACEHOLDER: pending confirmation）

在 `src/lib/usStockSessions.ts`，每个都带 `// PLACEHOLDER: pending confirmation` 注释：

1. `PRE_FREEZE_MINUTES_BEFORE_CLOSE = 15`
2. `FREEZE_MINUTES_BEFORE_CLOSE = 5`（15:55 ET）
3. `OPEN_COOLDOWN` = 09:30–09:35 ET
4. `SETTLEMENT_CREDIT_BY_ET` = 16:30 ET

倒计时同时展示 ET + 北京时间（`formatDualTimezone`）。

## 3 个种子事件（category='stocks'）

| id | base_price | Yes |
|---|---|---|
| us-nvda-updown-20260715 | 182.45 | 0.58 |
| us-tsla-updown-20260715 | 268.30 | 0.47 |
| us-aapl-updown-20260715 | 231.10 | 0.52 |

`side_labels = {yes:"Up", no:"Not Up"}` · `event_subtype='US_STOCK_DAILY_UPDOWN_SPOT'`。

## UI 入口

- `/events` 顶部 `Futures | Spot` 一级切换（默认 Futures），URL 参数 `?pl=spot`
- Spot 卡片路由到 `/spot?event=xxx`（不进 `/trade`）
- Style Guide 新增 Spot section（lifecycle 徽标 / 模拟订单簿 / Buy+Sell 表单 / SPOT 持仓行 / SpotStatsHeader 三态）

## /spot 页面骨架（2026-07-15 v2）

**定位原则**：/spot 是交易终端，不是简化落地页。以 `DesktopTrading` / `MobileTradingLayout` 为基底做**减法**。

- **终端 chrome**：不渲染全站导航 header（`EventsDesktopHeader` / `MobileHeader` w/ Logo 全部禁用）；顶部只有 back + 事件名 + 红色脉冲倒计时（ET + 北京） + 右侧 stat 群 + 收藏星标
- **保留**（与合约一致，尽量复用组件）：CandlestickChart、DesktopOrderBook（精度分组 / 深度色条 / Recent Trades / Y/N 比例条）、Chart|Event Info tabs、Yes/No 双层切换器、Limit/Market tabs、Amount + 0–100% Slider、Available 余额行、底部 Positions|Orders tabs（filter product_line='spot'）、右下 Account 面板
- **删除**（合约专属）：Margin Mode、Leverage、TP/SL、Funding / Next Funding / OI / Index Price、强平价、Margin req.；费用明细区改 `Cost / Max loss / Payout if right / Fee`
- **CTA**：`Buy Up · To win $X →` 格式；Up→`trading-green`，Not Up→`trading-red`；**禁止 primary/紫色**
- **右侧 stats**：`24h Volume` · `Prior Close $X` · `Last (indicative) $X ±X.XX%` · `Yes Price $X`（DEMO-STATE 前端漂移）
- Market 单 = marketable limit + 滑点上限（10 / 25 / 50 / 100 bps）

DESIGN.md §14 已把"交易页禁止渲染全站导航 header"和"spot=合约终端减法"固化为 Don't。

