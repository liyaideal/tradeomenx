---
name: Pro / Spot US stocks pilot
description: Multi-product-line engine — first Spot pilot (US stock daily up/down). 3 seed events, no-leverage semantics, 11-state PRD lifecycle, LP quote-mode badge, 4 placeholder timing constants, front-end simulated limit-order Pending flow + session-aware LP book
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

## 事件状态机（11 态，对齐 PRD）

`events.lifecycle_status` 枚举：
`CREATED → EXTENDED_TRADING → OPEN_COOLDOWN → TRADING → CLOSE_MODE → FROZEN → SETTLING → SETTLED`，分支 `SUSPENDED / REVIEW / CANCELED`。

- **允许下单**只有 `TRADING` / `EXTENDED_TRADING` / `OPEN_COOLDOWN`；其余（含未知）一律禁单。停牌只允许撤单。
- **PRE_FREEZE 不是事件状态**，它是 LP 报价的 session 概念（收盘前 15min 展示层提示"Closing soon"），不要写进 `lifecycle_status`。
- 未知状态徽标 fallback 为灰色 `Unknown` + 禁单，绝不 fallback 成 `Trading`。
- 帮助函数：`getLifecycleBadge(status)` / `isOrderingBlocked(status)` / `getBlockedReason(status)`，禁单文案："Market suspended" / "Under review" / "Closing — no new orders" / "Market frozen" / "Settling" / "Settled" / "Canceled" / "Not yet open" / "Market unavailable"（未知）。

## LP 报价模式徽标

订单簿标题右侧渲染 `lp_quote_mode` 徽标：`NORMAL`（默认，muted）/ `CONSERVATIVE`（黄）/ `HEDGE_ONLY`（primary）/ `CANCEL_ONLY`（红），tooltip 一句话解释。`DesktopOrderBook` 接受可选 `quoteMode` prop；spot 默认传 `NORMAL`，合约页不传即不渲染。

## 4 个时刻表常量

在 `src/lib/usStockSessions.ts`：

1. `PRE_FREEZE_MINUTES_BEFORE_CLOSE = 15` ⚠️ PLACEHOLDER — 仅驱动 UI "Closing soon" 徽标（黄色 chip 挂在倒计时旁），**不禁单**
2. `FREEZE_MINUTES_BEFORE_CLOSE = 5`（15:55 ET） ✅ **CONFIRMED per PRD §4.1** — TRADING 全程至 close−5min，此时进入 FROZEN；改动必须先改 PRD
3. `OPEN_COOLDOWN` = 09:30–09:35 ET ⚠️ PLACEHOLDER
4. `SETTLEMENT_CREDIT_BY_ET = "16:30"` ET ⚠️ PLACEHOLDER — 下单区与 Event Info 都要展示 "Settles & credits by ~16:30 ET"

倒计时同时展示 ET + 北京时间（`formatDualTimezone`）。


## 盘口模拟参数（LP PRD §6.1）

`buildBook()`：`min_half_spread=0.02` / `quote_level_spread_step=0.01` / 每侧 8–12 档（默认 10）/ 首档 ~200 shares、每档 ×0.82 衰减、±15% 抖动 / 价格 clamp `(0.01, 0.99)` / 保持 `bid < mid < ask` 单调。

## 规则文案

Event Info 的 Rules 区必须读 `events.rules` 字段（按换行切分为 bullet），禁止在前端再写死一份 JSX 规则副本——防止双源漂移。数据库缺字段时降级为"Rules not yet published for this market."。

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
- Style Guide 新增 Spot section（11 态 lifecycle 徽标 / LP quote-mode 徽标 / 模拟订单簿 / Buy+Sell 表单 / SPOT 持仓行 / SpotStatsHeader 三态）

## /spot 页面骨架

**定位原则**：/spot 是交易终端，不是简化落地页。以 `DesktopTrading` / `MobileTradingLayout` 为基底做**减法**。

- **终端 chrome**：不渲染全站导航 header；顶部只有 back + 事件名 + 红色脉冲倒计时（ET + 北京） + 右侧 stat 群 + 收藏星标
- **保留**：CandlestickChart、DesktopOrderBook（含 quoteMode 徽标）、Chart|Event Info tabs、Yes/No 双层切换器、Limit/Market tabs、Amount + 0–100% Slider、Available 余额行、底部 Positions|Orders tabs（filter product_line='spot'）、右下 Account 面板
- **删除**：Margin Mode、Leverage、TP/SL、Funding / Next Funding / OI / Index Price、强平价、Margin req.；费用明细区改 `Cost / Max loss / Payout if right / Fee`
- **CTA**：`Buy Up · To win $X →` 格式；Up→`trading-green`，Not Up→`trading-red`；**禁止 primary/紫色**；禁单时按 `getBlockedReason` 显示原因
- **右侧 stats**：`24h Volume` · `Prior Close $X` · `Last (indicative) $X ±X.XX%` · `Yes Price $X`（DEMO-STATE 前端漂移）
- Market 单 = marketable limit + 滑点上限（10 / 25 / 50 / 100 bps）

DESIGN.md §14 已把"交易页禁止渲染全站导航 header"和"spot=合约终端减法"固化为 Don't。

## 限价挂单演示态（v1.1）

`src/services/tradingService.ts` 三个新函数：`placeSpotLimitOrder` / `cancelSpotLimitOrder` / `fillSpotLimitOrder`（均 DEMO-STATE）。

- 可成交判定：Buy 限价 ≥ 模拟盘最优 ask → 即时；否则落 Pending，前端 `deductBalance(notional)` 预扣。Sell 用最优 bid 判定。
- Pending 落 `trades.status='Pending' + product_line='spot'`；触价成交（`SpotTrading` 内 useEffect 订阅 yesLive/noLive）走 `fillSpotLimitOrder`；Cancel 走 `cancelSpotLimitOrder` 全额退回 Buy 的预扣。
- **数据链路修复**：`SupabaseOrder` / `UnifiedOrder` 补 `product_line` 字段；SpotTrading 的 `spotOrders` 由 `(o as any).product_line` 改为 `o.productLine`。
- 红线：正式版由撮合引擎替换。

## Session 感知盘口（v1.1，LP PRD §4.2/§6.1）

`usStockSessions.ts` 新增 `SessionType` / `SESSION_PROFILES` / `getCurrentSession()`：

| Session | ET | Levels | Spread × | Size × | Quote mode |
|---|---|---|---|---|---|
| REGULAR | 09:30–15:45 | 8..12 | 1.0 | 1.0 | NORMAL |
| EXTENDED_AFTER_HOURS | 15:45–20:00 | 3..7 | 2.0 | 0.4 | CONSERVATIVE |
| OVERNIGHT | 20:00–04:00 | 3 | 3.0 | 0.25 | CONSERVATIVE |
| PRE_MARKET | 04:00–09:30 | 3..7 | 2.0 | 0.4 | CONSERVATIVE |

SpotTrading 每分钟重算 profile；`buildBook(mid, seed, profile)` 用 profile 的 spread/size/depth；`DesktopOrderBook.quoteMode` 由 `sessionProfile.quoteMode` 驱动。窗口沿用原 4 个 PLACEHOLDER 常量待 PM 确认。

## FROZEN 自动撤单退款（v1.2，DEMO-STATE）

- 触发条件：`lifecycle_status='FROZEN'` **或** 倒计时剩余 ≤ `FREEZE_MINUTES_BEFORE_CLOSE`（= 5 min）。
- 行为：`SpotTrading.tsx` 遍历当前用户该事件下全部 `Pending` 现货挂单，调 `cancelSpotLimitOrder` + `addBalance(refund)`，id 记入本地 `frozenCancelledIds` 集合。
- Orders 列表对这些 id 渲染 `"Cancelled · market frozen"`；其它撤单渲染 `Cancelled`。
- Event Info 规则区自动追加行 "All open orders are automatically cancelled and refunded at freeze (5 min before close)."（数据库有 rules 时才拼接）。
- 红线：仅撤销当前会话内可见 Pending 挂单，refund 直接进 `addBalance`；正式版由撮合/结算服务在 `freeze_time` 批量撤销并按会计口径退款，前端只订阅事件流。

