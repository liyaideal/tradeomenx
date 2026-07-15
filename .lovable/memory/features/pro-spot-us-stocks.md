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
- Style Guide 新增 Spot section（lifecycle 徽标 / 模拟订单簿 / Buy+Sell 表单 / SPOT 持仓行）

## 边界（引 backend-boundary）

- 新 schema 字段均为 🟡：语义是需求，`text[]+text` 硬编码状态机是演示便利
- `category_boost_configs` 🟢：Boost 板块开关必须做成后台可配置
- 现货不入 orders 表（本仓库无真实订单账本，见红线 §4）
