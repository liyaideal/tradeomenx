# 现货结算演示流 + 种子日常化 — 交付说明

> 本轮补齐 Pro 现货链路的最后一块：事件到期自动结算 + 每日自动播种下一交易日事件；配套 Transparency 现货口径与 funding 显式排除。**不含**页面改版（Settlements/Resolved/搜索的 UI 属下一轮 4B）。

## 1. 功能目标

- 现货 US 股票每日 up/down 事件到期后自动变现金：胜方每股 $1、负方 $0，直接入 `spot_balance`
- 每日 21:05 UTC（美股收盘后，跳过周末）先结算过期事件，再播种下一交易日 10 只标的
- Transparency 「Is My Trade Real?」在现货记录上正确显示 `BUY / REDUCE` + SPOT 徽标
- funding 累算不再依赖 `funding_rate=0` 侥幸，显式过滤 `product_line='futures'`
- 占位常量转正、`sim-` 前缀契约保持

## 2. sim-settle-spot（新 Edge Function）

**触发**：可手动 POST 调用 + 由 sim-daily-seed cron 调用。

**扫描条件**：`events.product_lines` 含 `'spot'` AND `expected_settlement_time < now()` AND `lifecycle_status != 'SETTLED'`。

**判定规则（DEMO-STATE）**：结算时 YES 期权的 mark price ≥ 0.5 判 YES（Up）胜，否则 NO 胜。正式版由结算服务按 databento 官方收盘价 vs `base_price` 判定。

**每事件执行**：

| 步骤 | 动作 |
|---|---|
| 1 | `event_options` 胜方 `final_price=1 is_winner=true`，负方 `final_price=0` |
| 2 | 遍历该事件所有 `product_line='spot' status='Open'` 持仓：胜方 `spot_balance += size`，负方 `+=0`；持仓 `status='Closed' + closed_at + mark_price=1/0 + pnl` |
| 3 | 每个仓位落 `transactions`：type = `trade_profit` / `trade_loss`，`account='spot'`，`amount=|pnl|` |
| 4 | 该事件全部 `Pending` 现货挂单撤销：Buy 单退款到 `spot_balance` + 落一条 `trade_profit` 描述 "Refund cancelled order"；Sell 单直接置 Cancelled |
| 5 | 事件置 `lifecycle_status='SETTLED'` + `is_resolved=true`（**硬契约同步**） + `settled_at` + `winning_option_id` + `settlement_description` |

**幂等**：已 SETTLED 事件跳过；单事件失败不阻塞其他事件；返回 `{scanned, settled, skipped, errors[]}`。

## 3. sim-daily-seed（新 Edge Function + cron）

**调度**：`pg_cron` 任务 `sim-daily-seed-2105utc`，`5 21 * * *`（21:05 UTC = 17:05 ET）。

**周末跳过**：`getUTCDay() ∈ {0,6}` 直接 return。**美国假日忽略**（DEMO 简化）。

**执行顺序**：

1. 内部 fetch `sim-settle-spot`（用 service role token）先结算到期事件
2. 计算下一交易日（跳过周六周日）
3. 为下一交易日 upsert 10 只事件（`AAPL / NVDA / TSLA / MSFT / AMZN / META / GOOGL / AMD / COIN / HOOD`）

**事件模板**（对齐 2026-07-15-pro-spot-us-stocks §7）：

| 字段 | 值 |
|---|---|
| `id` | `us-{symbol小写}-updown-{yyyymmdd}` |
| `side_labels` | `{yes:"Up", no:"Not Up"}` |
| `event_subtype` | `US_STOCK_DAILY_UPDOWN_SPOT` |
| `product_lines` | `['spot']` |
| `lifecycle_status` | `EXTENDED_TRADING`（T-1 收盘后即开盘前盘后交易） |
| `end_date`（close） | 固定 20:00Z（= 16:00 ET，DEMO 简化，忽略提前收盘日） |
| `freeze_time` | close − 5min |
| `expected_settlement_time` | close + 15min |
| `start_date` | close − 24h（T-1 cash close） |
| `base_price` | 该标的最新 SETTLED 事件的 `base_price`；无则用预置初始价 |
| Yes 初值 | `0.45 + hash01(event_id) * 0.13`（可复现） |

- `event_options` upsert 两行（Up / Not Up），id = `{event_id}-up` / `-not`
- 一条 `price_history` 种子；后续由 `update-prices` cron 接管漂移
- 全部走 `upsert(..., ignoreDuplicates: true)` → 重复触发无副作用

## 4. Transparency 口径调整

`useTradeVerification`：

- `TradeRecord` 新增 `product_line` 字段（select 一并拉取）
- 新增 `SIDE_ENUM_SPOT`：`buy → Open (raw=0)`、`sell → Reduce (raw=1)`；不再复用合约 `Close No / SHORT`
- 组装 DB Side 显示：现货 `BUY / REDUCE`，合约 `LONG / SHORT`

`TradeVerification.tsx`：

- 选择列表 & 结果头部对现货行渲染 SPOT 胶囊（`text-[10px] rounded-full border border-primary/40 text-primary`，复用流水徽标同款）
- 现货 side 文字改 `BUY / REDUCE` 颜色不变

## 5. funding 显式排除现货

`supabase/functions/accrue-funding/index.ts`：

- Positions 查询增加 `.eq("product_line", "futures")` 硬过滤
- 不再依赖"现货 option `funding_rate=0` 所以自然会 skip"的侥幸口径
- backend-boundary 标注 🟡（规则明确，实现自选）

## 6. 占位常量转正

`src/lib/usStockSessions.ts`：

- `PRE_FREEZE_MINUTES_BEFORE_CLOSE = 15` 注释由 PLACEHOLDER 改 CONFIRMED（product decision 2026-07-22）
- 新增 `SETTLEMENT_CREDIT_BY_ET = "16:30"` 常量，注释同样 CONFIRMED；仅供 /spot ⓘ tooltip 复用文案

## 7. 涉及文件

**新增**：
- `supabase/functions/sim-settle-spot/index.ts`
- `supabase/functions/sim-daily-seed/index.ts`
- pg_cron job `sim-daily-seed-2105utc`（通过 `net.http_post` 触发）

**修改**：
- `supabase/functions/accrue-funding/index.ts`
- `supabase/config.toml`（两个新函数 `verify_jwt = false`）
- `src/hooks/useTradeVerification.ts`
- `src/components/transparency/TradeVerification.tsx`
- `src/lib/usStockSessions.ts`

**未变更项**：
- 券体系（Position Voucher / 体验仓 / voucher_earnings）
- 双账户 2a / 2b 已交付实现
- Settlements / Resolved / 搜索 / 收藏页面 UI（4B 处理）
- 2026-07-21 存量三只事件（`us-nvda/tsla/aapl-updown-20260721`）由 sim-settle-spot 首跑自然结算，不特判

## 8. Backend Boundary（append）

| 项 | 边界 | 说明 |
|---|---|---|
| `sim-settle-spot` | 🔴 仅演示 | 判定规则（YES mark ≥ 0.5）为 DEMO，正式版按官方收盘价 |
| `SETTLED ↔ is_resolved` | 🟢 契约 | 硬同步：设 SETTLED 时必写 `is_resolved=true` |
| `sim-daily-seed` | 🔴 仅演示 | 每日 10 只种子模板；正式版由行情/清结算服务按交易日历生成 |
| `accrue-funding` product_line guard | 🟡 | 现货显式排除，规则明确、实现自选 |

## 9. QA 要点

- 手动 POST `sim-settle-spot`，7-21 三只到期事件应全部 SETTLED，胜方用户 spot_balance 增加、持仓关闭、Resolved 页可看
- 手动 POST `sim-daily-seed`（非周末），下一交易日应看到 10 只新 `us-{sym}-updown-{yyyymmdd}` 事件（`lifecycle_status='EXTENDED_TRADING'`）
- Transparency「Is My Trade Real?」选择一条现货 Filled 记录：列表 & 结果头出现 SPOT 徽标、Side 显示 BUY 或 REDUCE
- funding cron 跑完，仅 `product_line='futures'` 的仓位有新 `position_funding_ledger` 记录
