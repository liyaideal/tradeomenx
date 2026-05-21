# Resolved 详情页结算价口径统一

## 背景

数据库里 `event_options.final_price` 的口径完全乱：

| event | label | price (0–1) | final_price | is_winner |
|---|---|---|---|---|
| BTC > 100K | YES | 0.6234 | **83.29** | t |
| BTC > 100K | NO | 0.3766 | **17.32** | f |
| Oscar Best Picture | Oppenheimer | 0.80 | **1.00** | t |
| Oscar Best Picture | Poor Things | 0.12 | **0.00** | f |
| Gov shutdown | November 4-7 | 0.0534 | **1.4** | f |
| Apple Fall Event | September 12 | 0.3567 | **45.44** | t |

详情页 `ResolvedEventDetail` 把它直接 `$ … toFixed(4)` 渲染，所以才出现 `$83.2900`、`$1.4000`、`$45.4400` 这种"奇怪的价格"。

平台一直没有百分比/概率显示。事件交易期内的价格本来就是 0–1 的二元合约价（YES/NO 合约的美元价），结算时收敛到 winner = $1.00 / loser = $0.00。需要 UI 反映这个事实，而不是去渲染乱七八糟的 `final_price`。

## 目标

- **Final Results**（详情页结算结果卡片）：winner 显示 `$1.00`，loser 显示 `$0.00`。
- **Price History**（详情页价格曲线）：保留中间价格走势，但 y 轴单位是 0–1 美元合约价；终点对齐到 winner=$1 / loser=$0。
- 全程不引入百分比（既不显示 `83%`，也不显示 `Closing X%`）。

## 改动

### 1. `src/pages/ResolvedEventDetail.tsx`

- 移动端 Final Results（约 146–170 行）和桌面端 Final Results（约 393–419 行）中：
  - 把右侧
    ```tsx
    ${(option.final_price ?? option.price).toFixed(4)}
    ```
    改为：
    ```tsx
    ${option.is_winner ? "1.00" : "0.00"}
    ```
  - 单位字号、颜色、`font-mono` 保持现状。

### 2. `src/components/resolved/PriceHistoryChart.tsx`

数据归一化层（不动 SVG 绘图代码，只动 `chartData` 计算）：

- 现在 mock 生成用 `option.final_price ?? option.price * 100`，导致 y 轴跑到 ~$83；需要改成：
  - **目标终点价**：`is_winner ? 1.0 : 0.0`（始终是二元合约的结算价）。
  - **起点价**：用 `option.price`（已经是 0–1 概率/合约价）做随机扰动起点。
  - **中间点**：仍然随机游走，但 clamp 到 `[0, 1]`，并在最后 30% 区间逐步收敛到 1.0 或 0.0。
- 如果 `priceHistory` 里已有真实数据：把 `points[i].price` 一律 clamp/缩放到 0–1（如果当前值看起来在 0–100 区间，则 `÷ 100`；如果 >1 就 ÷100），保证 y 轴一致。
- 显示文案：
  - 折线末端价格标签 `$lastPoint.price.toFixed(2)` 保留，但因为现在 0–1，会显示 `$0.83`、`$1.00`、`$0.00`，符合合约价口径。
  - Tooltip 主价格 `$tooltip.price.toFixed(2)` 同理。
  - Tooltip 里的"涨跌幅"行 `+12.3%` 是**变化率**，不是概率，平台一直可以接受这种 %CHG（参考 `/events` 列表 MarketCardB 的 chg 列），保留。
- y 轴上下界、网格线如有硬编码 100 上限，改成 1.0；如果是 dynamic min/max，无需改动。

### 3. 其他模块完全不动

- `useResolvedEventDetail` hook、数据库字段、`event_options.final_price` 本身。
- `EventStatisticsCard` / `SettlementEvidenceCard` / `EventRulesCard` / `RelatedEventCard` / `SettlementTimeline`。
- 列表卡片 `ResolvedMarketCard`、首页、`/portfolio/settlement/*`。

## 验收

- 任意 `/resolved/:id`（含 `resolved-5`、BTC>100K、Apple Fall Event 等）：
  - Final Results：winner 行右侧 `$1.00`（绿）；其余行 `$0.00`（灰）。
  - Price History：曲线在 0–1 区间运行，winner 收敛到 $1.00、loser 收敛到 $0.00；终点标签和 tooltip 显示 `$0.xx` / `$1.00` / `$0.00`。
- 页面任何位置不再出现 `$83.2900`、`$45.4400`、`$1.4000` 这种异常数字。
- 不出现"%"作为概率/赔率（只有 tooltip 的"涨跌幅 %CHG"保留）。
- 桌面 + 移动表现一致。
