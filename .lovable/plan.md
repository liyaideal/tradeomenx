## Goal
美股产品还没上线，把 `/developers` 里所有把 TSLA/US_STOCK 当示例的地方换成一个**已上线形态**的二元预测事件，避免误导读者以为可以下美股单。功能/布局零改动，只改示例文案与 mock 数据。

## Chosen example
统一用一个 crypto 二元事件（已是站内主力形态）：
- `market_id`: `BTC_ABOVE:150000:2026-12-31`
- `outcome_side`: `YES`（改自原来的 `UP`）
- 面板标题：`BTC ≥ $150k · Yes`
- 定价保留 0.5x 区间，正好贴合二元合约概率语义（不用改数字，视觉更契合）。

> 如果更想用政治/体育/AI 事件（例：`ELECTION_2028_WIN:DEM`、`FED_CUT:2026-09` 等），说一声我改成那个 market_id 即可，其他改动一样。

## Changes

### 1. `src/components/developers/MiniOrderBook.tsx`
- Header 里 `TSLA · Up` → `BTC ≥ $150k · Yes`。其他（seq、行数据、动画）不动。

### 2. `src/pages/DevelopersPage.tsx`（desktop 三 tab 终端）
在 `heroTabs`（cURL / Python / TypeScript）和 `signTabs`（sign.sh）里，把 5 处出现的：
- `"US_STOCK_UPDOWN:TSLA:2026-07-17"` → `"BTC_ABOVE:150000:2026-12-31"`
- `"outcome_side": "UP"` / `outcome_side="UP"` / `outcome_side: "UP"` → 对应语法的 `"YES"`
- 顶部 caption `POST /v1/orders/preview · 200 OK` 保持不变。
- 右上角浮标 `market.book · seq 48,516` 保持不变（不含 TSLA）。
- 响应体字段 (`pricing_snapshot_id`, `estimated_margin_u`, `fee_preview_u`) 数值全部保持不变。

### 3. `src/pages/DevelopersPageMobile.tsx`（移动端 request preview 卡）
在 hero 下那张 mock 请求卡的 JSON body 里：
- `"market_id": "TSLA:2026-07-17"` → `"market_id": "BTC_ABOVE:150000:2026-12-31"`
- `"outcome_side": "UP"` → `"outcome_side": "YES"`
- 其他字段不动。

## Not touched
- 组件结构、断点、桌面/移动布局、CTA 行为、tier / quickstart / endpoints / accordion 文案。
- `MiniOrderBook` 的价格、size、depth、动画节奏——直接沿用，只换 header 标题。
- 路由、样式、图标。

## Verification
- 全仓 `rg "TSLA|US_STOCK|UPDOWN"` 应为空。
- typecheck。
- 桌面 + 移动 `/developers` 目视，示例统一显示 BTC 二元事件。
