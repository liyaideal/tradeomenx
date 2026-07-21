# Changelog Index

> **总览**：[交付实施对照表 STATUS.md](./STATUS.md) — 跨文档汇总，看实施进度从这里开始。

按时间倒序排列。每条 = 日期 + 标题 + 一句话摘要 + 链接。

| 日期 | 文档 | 摘要 |
|---|---|---|
| 2026-07-21 | [Pro 现货全站渗透 · 轮次 1](./2026-07-21-spot-dataline-hardening.md) | 共享数据链路把现货当合约的地方全部堵死：`DesktopTrading` / `TradingCharts` / `TradeOrder` 三个 /trade 挂载点在 hook 边界过滤 `productLine !== 'spot'`（orders 用 `?? 'futures'` 兜底），/trade 面板 Positions/Current Orders 两个 Tab 只见 futures；`useSupabaseOrders.fillOrder/cancelOrder` 按 `product_line` 分流（spot 走 `fillSpotLimitOrder`/`cancelSpotLimitOrder`，spot sell 放行由服务层拒绝净 short）；`PositionDetailContent` spot 分支隐藏 leverage/liq/funding，改用 Shares/Avg cost/Current value；Portfolio `handlePositionAction` 改读 `sortedPositions[index]` 并按 id 重算目标页 highlight index；仓位券排除现货（`EventPickerList` 过滤 + `redeem-position-voucher` 服务端返回 409）；`backend-boundary.md` 追加 2026-07-21 章节；`/style-guide` Spot 新增 Position detail 双端对照 |
| 2026-07-20 | [Open API v1 门户 + Key 管理页 双端定稿 v2](./2026-07-20-api-surface-v2.md) | 取代 07-15 版：`/developers` 新增独立 mobile 版（`DevelopersPageMobile` + `TiersStepperMobile` 01/02/03 badge，TSLA mock 改 BTC ≥ $150k Yes，全局 `overflow-x: clip` 修 sticky header）；`/settings/api` 骨架重构（`PageHeader` + hairline 分区 + `TierTrack` 横向解锁轨道 + `TierQuickAnswer` + ≤180px 空态 + KeysTable 移动卡片列表）；创建向导升级为 4 步（+2FA），双端分叉 Dialog / MobileDrawer；入口 IA 收敛为 profile 菜单 "API" → /developers → Manage API Keys → /settings/api；DESIGN.md 落 §7 两层结构 + Overlays 移动零 Dialog + §16.1.1 Style-Guide Truth Rule；schema 不变 |
| 2026-07-15 | [Open API v1 用户侧 Key 管理页](./2026-07-15-api-key-management.md)（已被 v2 取代） | 新页 `/settings/api`：三层准入 checklist（Read-only / Trading / Pro-MM，判定读 profile/user_security/transactions/trades）+ Key 列表 + 创建向导（label → scope 多选 → IP whitelist → 一次性 secret 展示）；scope 枚举对齐 FD-API-04 七项，`trade_*` / `ws_private` 强制 IP；secret 由前端 `omx_live_<48hex>` 仿真生成、`api_keys` 只落 prefix（DEMO-STATE）；桌面下拉 + 移动抽屉入口同步；`/style-guide` 新增 API section |

| 2026-07-15 | [/spot 与技术对接 v1.0 对齐](./2026-07-15-spot-tech-alignment.md) | event_status 收敛为 9 态（删 OPEN_COOLDOWN / CLOSE_MODE，SUSPENDED = cancel-only）；freeze_time / expected_settlement_time 转为数据驱动（前端只消费字段，删除 16:30 占位）；现货持仓改为 SIGNED_YES_SHARE 单净仓（`executeSpotTrade` / `fillSpotLimitOrder` 反向买入自动冲减对面）；下单面板补 Max win 行 + tick 0.01 校验；卖出回款加 event_pending_cash demo 简化标注；event_id 规范 `US_STOCK_UPDOWN:{symbol}:{trade_date}` 为研发蓝图不回改；`/style-guide` 补 9 态 + 净仓冲减演示 |
| 2026-07-15 | [Pro 现货产品线上线：美股当日涨跌试点](./2026-07-15-pro-spot-us-stocks.md) | 平台扩为多产品线引擎：events / trades / positions 加 `product_line` 维度；新增 `/events` Futures\|Spot 一级切换 + `/spot` 现货交易页（无杠杆/无 TP/SL/无资金费/无强平价，Sell 校验持有）；种子 3 个美股日涨跌事件（NVDA/TSLA/AAPL），11 态 lifecycle + 4 个时刻表常量占位待确认；Portfolio 按 product_line 条件渲染 SPOT 徽标；**v1.1 增补**：限价挂单 Pending/Cancel/触价成交前端模拟（`placeSpotLimitOrder`/`cancelSpotLimitOrder`/`fillSpotLimitOrder`）+ Session 感知盘口（REGULAR/EXTENDED_AFTER_HOURS/OVERNIGHT/PRE_MARKET，profile 驱动 depth/spread/size + LP quote-mode 徽标） |

| 2026-07-13 | [Google 账号选择器仿真（固定身份自然入口）](./2026-07-13-google-account-chooser.md) | 登录 Sign in with Google 由 1.2s 假 OAuth 升级为 Google 风格 `Choose an account` 选择器；两行固定账号 Alex Carter (matched) / Mia Reyes (welcome) 走 `ensure-demo-user`+`signInWithPassword` 直接登录并跳过 onboarding，第 3 行 `Use another account` 保持原匿名 3 步流程；UI 无 demo 字样；红线：仿真 OAuth 与匿名 auth 均为 🔴 仅演示，正式版需替换为真 OAuth/OTP |
| 2026-07-13 | [OmenX Sports 接入演示引擎](./2026-07-13-sports-demo-engine-integration.md) | Sports 子站作为首个外部 surface 接入本仓库 Supabase：共享 auth / profiles 双余额 / events 行情 / trades+positions 下单；新种 2 场 WC26 半决赛（France-Spain、Argentina-England），未做任何 schema 变更 |
| 2026-07-13 | [后端参考边界说明](./2026-07-13-backend-boundary.md) | 本仓库 Supabase 定位为演示引擎，发布《后端参考边界说明》，35 表 + 16 Edge Functions 逐个标注 🟢规则照抄 / 🟡规则在此实现自选 / 🔴仅演示，附 5 条治理规则 |
| 2026-05-25 | [Single-market binary 收敛（第三轮）](./2026-05-25-single-market-binary-round3.md) | `/trade` 本体收敛：彻底删除 `Market:` / `Select Option:` 行；Yes/No 按钮 `grid items-stretch + h-full + flex-1` 等高规范；新增 `useEventSideLabelsLookup` + `resolveBinarySideLabel`，desktop 9 处硬编码 Yes/No 全部替换为按行 lookup 的 sideLabels |
| 2026-05-25 | [sideLabels 平台级贯穿（第二轮）](./2026-05-25-sidelabels-platform-wide-round2.md) | 把别名渗透到 Resolved 详情/列表 / Insights Feed / BiggestMovers / TrendingMarkets / HomeDiscover；`SettlementPoster` 与 `SettlementShareCard` 新增 `sideLabels` prop，`useResolvedEventDetail` / `useResolvedEvents` / `useSettlementDetail` 一并下发 |
| 2026-05-25 | [sideLabels 平台级贯穿（第一轮）](./2026-05-25-sidelabels-platform-wide.md) | 把 single-market binary 的 sideLabels 别名扩展到 MarketCardB / MarketListView / Portfolio 持仓 / 订单 / Settlements / DesktopPositionsPanel；新增 `getDisplayOptionLabel` + `useEventDisplayLookup`；同步移除两处已过时的"Yes 轴归一化"提示 |
| 2026-05-25 | [Single-market binary 事件 UI 收敛](./2026-05-25-single-market-binary-collapse.md) | 单 market binary 事件顶部 chip 行折叠为 `Market: Yes or No` 只读标签；Yes/No 切换归到 Trade 面板按钮（同时切 side + selectedOption，联动 K 线/订单簿）；新增 `TradingEvent.sideLabels` 支持体育类两端别名（"上海申花/山东鲁能"） |
| 2026-05-25 | [二元事件 No 作为独立持仓](./2026-05-25-binary-no-native-positions.md) | 配合 Yes/No 文案改造废弃 No→Yes 翻转归一化：`tradingService` / `positionIntent` / `orderUtils` 三处改为 identity 映射，删除 `BinaryEventHint` 组件；Buy No 直接开 No 仓，Yes/No 可同时持有；底层类型 / schema / PnL 公式 / 历史数据不动 |
| 2026-05-25 | [安全加固：transactions / TOTP / Realtime 三项硬化](./2026-05-25-security-hardening.md) | 关键写入收敛到 Edge Function：新增 `record-transaction` / `totp-manage`，拆出 `user_security` 表并 drop `profiles.totp_secret`，启用 `realtime.messages` RLS，新增多个 field-locking trigger |
| 2026-05-25 | [全站方向文案 Long/Short + Buy/Sell → Yes/No](./2026-05-25-yes-no-terminology.md) | 仅改展示层文案（约 37 文件 + 审计徽章 + 订单簿 Y/N），保留底层 `side: 'long'\|'short'`、`order.side: 'buy'\|'sell'`、PnL 公式与双价结构；Hedge 落地页 / Glossary / ToS 明确保留 |
| 2026-05-21 | [/resolved 列表 + 详情页改版](./2026-05-21-resolved-revamp.md) | /resolved 列表升级为 Event→Markets 两级结构（新增 `ResolvedGroupedGrid` / `ResolvedMarketCard`、删除旧 `ResolvedEventCard`），头部对齐 /events 三段式，详情页 Final Results / Price History 改为 0/1 二元口径，`My Settled` 通过 trigger 回填 4 笔演示数据 |
| 2026-05-21 | [资金费率审计：结算周期列表中间页](./2026-05-21-funding-rate-periods-step.md) | Transparency 资金费率核验新增 periods 步骤，选持仓后先列出该仓位所有结算，再核验单次；详情页补充 window / settlementTs / notional |
| 2026-05-21 | [Style Guide 交付（含 Wallet Transaction History Row）](./2026-05-21-style-guide-tx-row.md) | `/style-guide` 新增 Transaction History Row playground（桌面单行 + 移动两层），WalletSection 增量；`/campaign-style-guide` 入口加到 StyleGuide 顶部 |
| 2026-05-20 | [需求批次 2026-05-20](./2026-05-20-requirements.md) | 当日合并交付的多需求清单（功能目标 / 数据库 / 用户端 / Admin） |
| 2026-05-20 | [错链充值找回 v2](./2026-05-20-recovery-v2.md) | Recovery 找回流程 v2，合并 v1 已上线 + v2 最新改动，含状态机与表结构 |
| 2026-05-11 | [近期已上线需求合集 v2](./2026-05-11-shipped-requirements-v2.md) | 5 月初前一轮已上线需求的整合说明，作为研发对齐基线 |

---

## 使用约定

- **新增交付文档**：与文档同一轮提交，在此表**顶部**插入一行 — `日期 | [标题](./文件名.md) | 一句话摘要`
  - 摘要 ≤80 字，从文档顶部 quote block 提炼，必须包含：覆盖范围 + 关键改动名词
  - 同步在 `STATUS.md` 顶部追加该批次的实施对照节
- **修订旧文档**：原文件保留，新文件命名为 `*-v2.md` / `*-v3.md`，索引表新增一行指向最新版；旧行末尾追加"（已被 vN 取代）"，不删除
- **废弃**：在该行末尾标注"（已废弃）"，文件不删除

> 维护规则同步在 `.lovable/memory/index.md` Core 中，Lovable agent 每次产出交付文档会自动按此约定更新本索引。
