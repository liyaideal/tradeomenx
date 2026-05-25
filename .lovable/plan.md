## 背景

`/trade` 页面已经把单 market binary 事件的两端 Yes/No 替换为 `sideLabels` 别名（如 Carlos Alcaraz / Jannik Sinner），但事件列表卡片（MarketCardB）、市场列表行（MarketListView 的 child row）、Portfolio 持仓/订单、Resolved 详情、Insights、Share Poster 等地方仍然显示原始 `option.label` = "Yes" / "No"。截图里的"NBA Finals 2026 Game 7"卡片就是这种情况：标题是队名 vs 队名，但下面 outcome mini-table 还是 Yes / No。

## 目标

只要事件是 single-market binary 且 `event.side_labels` 有值，平台上一切渲染 option label 的地方都应显示对应的别名；多 outcome 事件、底层数据（`option.label`/`positions.option_id`/PnL 公式）完全不变。

## 设计原则

1. 在 `src/lib/eventUtils.ts` 新增一个统一 helper：
   ```ts
   getDisplayOptionLabel(event, option | optionLabel): string
   ```
   - 多 outcome 事件 → 原 `option.label`
   - 单 market binary + 无 sideLabels → 仍是 "Yes" / "No"
   - 单 market binary + 有 sideLabels → 返回 `sideLabels.yes` / `sideLabels.no`
2. 数据 hook（`useMarketListData`、Portfolio/positions/orders 等已经从 DB 取 `events.side_labels`）顺手把 `sideLabels` 透传给下游 row 类型；UI 层直接调 helper，不再硬编码字符串。
3. 不动 DB schema，不动 `option.label` 真值，不动 `side: 'long' | 'short'`，不动 PnL/持仓存储。

## 受影响范围

按业务模块归类，括号里是要做的最小改动。

### 1. Events 列表 / 首页发现

- `src/hooks/useMarketListData.ts` — `MarketChildRow` 增 `displayLabel?: string`，构造时调用 helper；`EventRow.topMarket.label` 同样替换。
- `src/components/events/MarketCardB.tsx` — outcome mini-table 用 `child.displayLabel ?? child.optionLabel`（screenshot 2 直接受影响）。
- `src/components/events/MarketListView.tsx` — `ChildRowContent` 的 `● {child.optionLabel}` 改为 displayLabel。
- `src/components/home/HomeDiscover.tsx` — 列出的 Yes/No 文案同步走 displayLabel。
- `src/components/home/HomeTournamentsRail.tsx` — 同 MarketCardB 路径。
- `src/components/EventCard.tsx` — Quick Trade 区块的硬编码 Yes/No 按钮、Buy Yes/Buy No、确认弹窗"Side: Yes/No"全部走 sideLabels（落到一个组件内本地变量即可）。

### 2. Portfolio / 订单 / 持仓

- `src/components/PositionCard.tsx`、`src/components/OrderCard.tsx`、`src/pages/Portfolio.tsx`、`src/pages/PortfolioSettlements.tsx`、`src/pages/PortfolioAirdrops.tsx` — 这些地方按 `option_id` 显示 option label；改成查出 event 后调 helper（这些页面已经能拿到 event/options 数据，只需在 render label 时换一行）。

### 3. Resolved（已结算）

- `src/pages/ResolvedEventDetail.tsx`、`src/components/resolved/RelatedEventCard.tsx`、`src/components/resolved/EventShareCard.tsx`、`src/components/resolved/PriceHistoryChart.tsx`、`src/components/resolved/ResolvedMarketCard.tsx`、`src/components/ResolvedFilters.tsx` — 同样把 `option.label` 包成 helper 调用；Resolved 的 share/海报别名要正确。

### 4. Insights / 自动 feed

- `src/components/insights/InsightsFeed.tsx`、`src/components/insights/BiggestMovers.tsx`、`src/components/insights/TrendingMarkets.tsx` — 自动生成的描述句子里 `${opt.label}` 替换。

### 5. Share / 海报

- `src/components/ShareModal.tsx`、`src/components/share/SettlementPoster.tsx`、`src/components/settlement/SettlementShareCard.tsx` — 分享海报里"Bought Yes / Bought No"按 sideLabels 显示队名（PNG/截图都受影响）。

### 6. Trade 页面查漏

- `src/components/OptionChips.tsx` — 多 outcome 路径用不到，但二级保护：组件内若收到 binary options 时也按 helper 渲染（防 regression）。
- `src/components/EventSelectorSheet.tsx`、`src/components/EventInfoContent.tsx` — 若展示 option 列表，同样替换。

### 7. Transparency（数据透明）

- `src/components/transparency/SettlementAudit.tsx`、`src/components/transparency/TradeVerification.tsx` — 审计页是链上证据，**保留原始 Yes/No** 真值（写一行 `// 不走 sideLabels：这是链上原始字段`），并在 plan 里说明这个例外。

### 8. 不动

- DB schema、`option.label`、`positions.option_id`、`orders.side`、PnL 公式。
- 多 outcome chip 行（>2 markets）。
- Style Guide / Playground 仅追加 sideLabels 演示数据（per playground-state-coverage），但本轮先聚焦正式产品页面，Playground 留到下一轮。

## 实施顺序

1. eventUtils 加 helper + 类型
2. 数据层（`useMarketListData`、Portfolio/positions/orders hook）透传 sideLabels
3. 列表/卡片层批量替换（MarketCardB、MarketListView、HomeDiscover、EventCard、HomeTournamentsRail）
4. Portfolio / Resolved / Share / Insights 批量替换
5. 走查 Transparency 是否需要例外注释
6. 浏览器肉眼验证：/events 卡片、Hot rail、市场列表展开、单个 sports binary 事件的 trade/portfolio/resolved/share 流转

## 文档

- `docs/changelog/2026-05-25-sidelabels-platform-wide.md` 记录这次跨页面统一
- `mem://design/single-market-binary-ui.md` 补一句"sideLabels 必须贯穿所有渲染 option label 的页面，Transparency 审计模块是唯一例外（保留链上原值）"
