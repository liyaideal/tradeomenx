# 2026-07-15 — Pro 现货（Spot）产品线上线：美股当日涨跌事件试点

> 本轮迭代把平台从"纯合约（futures）"扩为**多产品线引擎**。本轮试点仅上线现货一条子线——**美股当日涨跌**（US_STOCK_DAILY_UPDOWN_SPOT），共 3 个事件（NVDA / TSLA / AAPL）。合约端行为完全不变。这是 Pro/Lite 分层的第 2 步；第 1 步 schema 扩容已直接在数据库完成，本文只交付前端与规范。

## 1. 产品线模型

- `events.product_lines text[]`（默认 `{futures}`）：允许一个事件同时挂多个产品线（本轮试点事件为纯 spot）
- `events.event_subtype`：事件子类型标签；本轮值 `US_STOCK_DAILY_UPDOWN_SPOT`
- `events.lifecycle_status`：状态机（下方），默认 `TRADING`
- `events.base_price numeric`：结算基准价（前收），"平收 = Not Up" 规则以此为锚
- `trades.product_line` / `positions.product_line`：`futures` | `spot`，CHECK 已加
- `profiles.preferred_surface`：`lite` | `pro`（本轮不启用，占位 schema）
- `category_boost_configs`：本轮不用；后续 Boost 板块开关容器

## 2. 现货语义

- 每份 Yes/No 是 $0–1 之间的**份额**，价格即概率
- 结算：Yes 获胜每份付 $1；输方每份 $0
- 最大亏损 = 已付金额；无杠杆、无 TP/SL、无资金费、无强平价
- Sell = 减仓/平仓已持有的 Yes/No 份额；**禁止空头**（前端 + service 双校验）
- 落库契约：`leverage=1`、`fee=0`、`side='long'`（Buy）、`order_type='Limit'`、`status='Filled'`、`product_line='spot'`；Trial 优先扣（复用 `useUserProfile.deductBalance` 口径）

## 3. 状态机与时刻表

`events.lifecycle_status` 五态（badge 配色见 `src/lib/usStockSessions.ts` 的 `LIFECYCLE_BADGE`）：

| 状态 | 含义 | 允许下单 |
|---|---|---|
| `TRADING` | 常规交易时段 | ✅ |
| `EXTENDED_TRADING` | 盘前/盘后延长 | ✅ |
| `PRE_FREEZE` | 收盘前 15 分钟起（LP 报价可切 WIDE） | ❌ |
| `FROZEN` | 收盘前 5 分钟起 + 结算窗口 | ❌ |
| `CANCELED` | 停牌/取消 | ❌ |

**时刻表（4 值 PLACEHOLDER: pending confirmation，见 `src/lib/usStockSessions.ts`）**：

| 常量 | 值 | 状态 |
|---|---|---|
| `PRE_FREEZE_MINUTES_BEFORE_CLOSE` | 15 min | ⚠️ 占位待确认 |
| `FREEZE_MINUTES_BEFORE_CLOSE` | 5 min（15:55 ET） | ⚠️ 占位待确认 |
| `OPEN_COOLDOWN` | 09:30–09:35 ET | ⚠️ 占位待确认 |
| `SETTLEMENT_CREDIT_BY_ET` | ≤ 16:30 ET | ⚠️ 占位待确认 |

**倒计时同时展示 ET + 北京时间**（`formatDualTimezone`）。

## 4. /events 产品线一级切换

- 顶部新增 `Futures | Spot` 切换，默认 Futures；URL 参数 `?pl=spot` 深链
- Spot tab 下小字提示："Spot = buy outcome shares ($0–1). Winning shares pay $1. Max loss is what you pay."
- 分类 tab 与筛选自动跟随当前产品线的可用事件

## 5. 现货交易页 `/spot?event=xxx`

新页面 `src/pages/SpotTrading.tsx`：

- 头部：事件名 + 一句话规则（"Settles vs prior official close $X · flat close = Not Up"）+ 状态徽标 + 双时区倒计时
- 订单簿：前端模拟（10 档 / spread 0.02 / size 衰减 0.82 / 首档 ~200），左上角 `NORMAL` quote-mode 徽标
- 下单表单：Up/Not Up（渲染 `side_labels`）+ Buy/Sell + Limit price + Amount + 三行汇总（Cost / Max loss / Payout if right = qty × $1）
- **不渲染** 杠杆滑杆 / TP/SL / 资金费 / 强平价
- 状态非 TRADING/EXTENDED_TRADING 时按钮禁用并显示 "Market frozen"

## 6. Portfolio 条件渲染

- `positions.product_line='spot'` 行显示 `SPOT` 徽标；杠杆/Liq./Funding 相关列在该行留空或折叠
- 不拆分页面——同一个 /portfolio 按 `product_line` 条件渲染

## 7. 种子数据（3 个试点事件）

`category='stocks'`, `product_lines='{spot}'`, `event_subtype='US_STOCK_DAILY_UPDOWN_SPOT'`, `lifecycle_status='TRADING'`, `side_labels={yes:"Up", no:"Not Up"}`:

| 事件 id | base_price | Yes 初值 |
|---|---|---|
| `us-nvda-updown-20260715` | 182.45 | 0.58 |
| `us-tsla-updown-20260715` | 268.30 | 0.47 |
| `us-aapl-updown-20260715` | 231.10 | 0.52 |

## 8. Style Guide

`/style-guide` 新增 Spot section，覆盖：Lifecycle badges（5 态）/ 模拟订单簿 / Buy+Sell 两态下单表单 / SPOT 持仓行

## 9. 涉及文件

- 前端：`src/lib/usStockSessions.ts`（新）、`src/pages/SpotTrading.tsx`（新）、`src/pages/StyleGuide/sections/SpotSection.tsx`（新）、`src/hooks/useActiveEvents.ts` / `useMarketListData.ts` / `src/pages/EventsPage.tsx` / `src/components/events/MarketCardB.tsx` / `MarketListView.tsx` / `src/services/tradingService.ts`（`executeSpotTrade`）/ `src/App.tsx`
- 文档：本文 + `docs/backend-boundary.md`（append 一节）+ INDEX / STATUS 更新

## 10. 对研发的红线（引 backend-boundary）

- 新字段全部 🟡：语义（多产品线、状态机、结算基准价）是需求；`text[] + text` 的 schema 与 DB 硬编码的 lifecycle 值都是演示便利，正式版应有专门的产品线/状态表
- `category_boost_configs` 🟢：Boost 板块开关是运营规则，必须做成后台可配置
- 现货下单不入 orders 表（本仓库没有真实订单账本，见 backend-boundary 红线 §4）
