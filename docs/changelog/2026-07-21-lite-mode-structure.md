# Lite Mode Structure (Round A) — Skeleton + Stocks Quick Buy

> 本轮交付：Pro/Lite 双 surface 骨架 + Stocks 现货 Lite 交易链路。首次消费 `profiles.preferred_surface`（此前为沉睡字段）。**无 schema 变更**。Crypto Boost 芯片、Sports 表单对齐属后续轮次。

## 1. 功能目标

平台拆分 Pro / Lite 双 surface，参考 Coinbase Simple / Pro 双站模式。同一账号 / 同一资产 / 同一持仓 —— 切换只是展示层选择，不做任何数据迁移。

Round A 覆盖：
- SurfaceContext（读写 `profiles.preferred_surface`，guest → localStorage）
- 顶栏 / 移动 drawer 加「Switch to Pro / Lite」入口
- Home / Events / Stocks 交易页三处 fork（其余共享）
- Lite 板块 rail（Sports 外链常驻 + Stocks/Crypto/Macro/Entertainment 按活跃事件动态生成）
- Lite Stocks 快速买入面板（marketable limit 封装 + 滑点上限）

## 2. Surface 模型

| 维度 | 说明 |
|---|---|
| 字段 | `profiles.preferred_surface`（'lite' \| 'pro'，默认 'lite'）|
| 读取时机 | 登录 / profile 加载时，写入 `SurfaceContext` |
| 切换入口 | 桌面 `EventsDesktopHeader` 头像菜单、移动 `BottomNav` Profile drawer；文案：`Switch to Pro` / `Switch to Lite` |
| 写入 | Optimistic：UI 立即切；后台写库 fire-and-forget |
| Guest | 无 profile，读写 `localStorage["omenx.surface"]`（`// DEMO-STATE`：guest 持久化是演示便利，正式版应仅按账号维度） |
| 数据迁移 | **无**。同一账号、同一钱包、同一持仓 |

## 3. 分叉范围（D6，严格遵守）

| 页面 | 是否 fork | 说明 |
|---|---|---|
| `/` Home | ✅ | Lite → `LiteHome`；Pro → 现有 `MobileHome` / `EventsPage` |
| `/events` | ✅ | Lite → `LiteEvents`；Pro → `EventsPage`（含 Futures\|Spot 切换）|
| `/spot` | ✅ | Lite → `LiteSpotTrade`；Pro → 现有 `SpotTrading` |
| `/trade` | ❌ | 本轮仍统一走 Pro `DesktopTrading` / `TradingCharts`（Boost 面板下一轮）|
| Portfolio / Wallet / Vouchers / Rewards / Settings / Insights / Leaderboard | ❌ | 全部共享，一行不动 |

实现层：App.tsx 顶层挂 `SurfaceProvider`；`/`、`/events`、`/spot` 三处新增 surface-aware picker 组件；Pro 版页面**原样保留**。

## 4. Lite 事件卡规范

- 结构：事件问题 + Up/Not Up（或 `side_labels`）双价按钮 + 概率 %
- Stocks 事件加 `Settles today · {HH:MM AM/PM} ET` 徽标（读 `events.freeze_time`，fallback `end_date`，直接格式化 —— 勿硬编码 16:00）
- **禁用词**（全 Lite surface）：`Margin` / `Liquidation` / `Funding` / `Leverage` / `Long` / `Short` / `Spot` / `Futures` / `现货` / `合约`
- 复用 `MarketCardB` 骨架精神，但**不带走**：杠杆、Funding、Long/Short、Futures/Spot 标签

## 5. Lite Home（板块优先导航）

第一层 = 横向板块 rail（形态借自 Home v3 Tournaments rail —— 只借布局，不带任何 Tournaments / 世界杯残留文案）：

| 板块 | 触发 | 副标题钩子 |
|---|---|---|
| Sports | 常驻外链 → `SPORTS_LINK`（`omenx-sports`，new tab）| "World-class matches, simple YES / NO"（不显示事件数）|
| Stocks | 有活跃 spot 事件时显示 | "New events every trading day · settles at market close" |
| Crypto | 有活跃 crypto 事件时显示 | "24/7 price events across BTC, ETH, SOL, and more" |
| Macro | 有活跃 finance/politics/market/social 事件时显示 | "Central-bank calls, elections, macro data prints" |
| Entertainment | 有活跃 entertainment 事件时显示 | "Box office, awards, culture-moment markets" |

第二层 = 选中板块的事件流（`LiteEventCard` grid）。

## 6. Lite Events 列表

- 顶部 = 板块 tab（Sports 除外，list 页不放外链 tab）
- **无** Futures\|Spot 产品线切换
- 事件卡同 §4

## 7. Lite Stocks 快速买入（`LiteBuyPanel`）

自上而下结构：
1. 事件名 + 状态徽标
2. 简化价格展示：`Up 57%` + Available balance
3. 选边按钮：Up / Not Up（渲染 `side_labels`）+ 概率美元价
4. 金额输入（USDC）+ 快捷 $10 / $25 / $50 / $100
5. 汇总三行（**payout language contract，逐字**）：
   - `Max loss: $X`（副注 "what you pay"）
   - `You get if right: $Y`（= 份额 × $1，份额 = 金额 ÷ 成交价）
   - `Potential profit: +$Z`
6. 大按钮：`Buy Up ~$0.57`（tone 跟 side）

### 下单契约

- **Marketable limit 封装**：limit = best ask + $0.02 滑点上限；调 `executeSpotTrade`（`// DEMO-STATE`：正式版由撮合引擎执行滑点保护）
- 点击到提交之间若 mid 漂移 > $0.02 → 弹 `Price moved, try again`，不下单
- **仅买入**：无 Sell / 无限价 / 无订单簿 / 无深度（平仓走共享 Portfolio）
- 状态照搬 Pro 现货：`isOrderingBlocked` 判断可下单；`FROZEN` / `SETTLED` 等禁用按钮并显示 `getBlockedReason` 文案
- 落库契约：`product_line='spot'`、`leverage=1`、`side='long'`；Trial 余额优先扣（由 `executeSpotTrade` 内部逻辑保证）

### 状态穷举（Style Guide 已交付双端）

| # | 状态 | 触发 |
|---|---|---|
| 1 | Tradeable | `TRADING`，金额有效 |
| 2 | Closing soon | 距 freeze < 5min |
| 3 | Frozen | `FROZEN` lifecycle |
| 4 | Settled | `SETTLED` lifecycle |
| 5 | Amount = 0 error | 空输入或 ≤ 0 |
| 6 | Insufficient balance | 金额 > 可用权益 |
| 7 | Slippage failed | 点击到提交 mid 漂移 > $0.02 |

## 8. Style Guide

`/style-guide` 新增 `Lite Mode` tab（`LiteSection`），desktop + mobile 双端穷举：
- Surface 切换菜单项（Lite / Pro 两态）
- 板块 rail（含 Sports 外链卡、active 态）
- Lite 事件卡（Stocks 当日开奖徽标 / 标准款）
- 快速买入面板 7 态

## 9. 涉及文件

**新增**
- `src/contexts/SurfaceContext.tsx`
- `src/components/lite/SectorRail.tsx`
- `src/components/lite/LiteEventCard.tsx`
- `src/components/lite/LiteBuyPanel.tsx`
- `src/pages/lite/LiteHome.tsx`
- `src/pages/lite/LiteEvents.tsx`
- `src/pages/lite/LiteSpotTrade.tsx`
- `src/pages/StyleGuide/sections/LiteSection.tsx`

**修改**
- `src/App.tsx`：挂 `SurfaceProvider`；`/`、`/events`、`/spot` 走 surface picker
- `src/components/EventsDesktopHeader.tsx`：头像菜单加 `Switch to Pro/Lite`
- `src/components/BottomNav.tsx`：Profile drawer 加 `Switch to Pro/Lite`
- `src/pages/StyleGuide/{index.tsx, sections/index.ts}`：注册 `LiteSection`

**数据库**：无变更。仅消费既有 `profiles.preferred_surface` 字段。

## 10. 未变更项

- Portfolio / Wallet / Vouchers / Rewards / Settings / Insights / Leaderboard 全部共享单份
- Pro Home / Events / Spot / Trade 全部原样，一行未改
- 数据库 schema、RLS、Edge Functions、种子数据全部不动
- Crypto Boost 芯片本轮**不做**；Sports 表单对齐本轮**不做**
- Lite surface 下 crypto/macro 合约事件本轮沿用 Pro `/trade`（下一轮切 Boost 面板）
