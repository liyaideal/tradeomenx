
## 1. Order preview — 单 market binary 的 Option / Side 顺序颠倒

文件：`src/pages/OrderPreview.tsx`

现状（image-921）：
- Option = "No"
- Side = "Oklahoma City Thunder"（别名）

期望：
- 单 market binary：Option 行展示别名（或在没有别名时展示 Yes/No），并按 outcome 上 green/red 颜色；Side 行整行隐藏（不渲染那一项）。
- 多 outcome 事件：Option 行保持原 option label，Side 行展示 Yes/No（保留现状）。

实现：
- `orderDetails` 构建处对 `isBinaryOption` 分支：
  - `Option` 的 `value` 改为 `sideLabels ? (previewOutcome === 'yes' ? sideLabels.yes : sideLabels.no) : (previewOutcome === 'yes' ? 'Yes' : 'No')`，加 `highlight: sideHighlight`。
  - 不 push `Side` 这一行。
- 多 outcome：保持原有 Option + Side(Yes/No) 行为不变。

## 2. Position detail 弹窗 — 多 outcome chip 文案错误

文件：`src/components/positions/PositionDetailContent.tsx`

现状（image-920，SOL Weekly Performance / Up >5%）：多 outcome short 仓位的 header chip 直接显示 `Up >5% 10x`（红色），把 option 名硬塞到了 Yes/No 的位置。

期望（与列表/卡片一致）：
- 多 outcome：chip 文案 = `Yes`/`No`（按 long/short），option 名作为 secondary 文案接在 chip 右边；颜色规则保持 long=green / short=red。
- 单 market binary：保持现有 outcome 着色 + 别名 label（无 chip）逻辑，不动。

实现（仅改 lines 122-139 的多 outcome 分支）：
- chip 文案改为 `position.type === 'long' ? 'Yes' : 'No'`，杠杆放回 chip 内：`Yes 10x` / `No 10x`。
- secondary 文案使用 `position.displayOption ?? position.option`，与 chip 不同时才渲染。

## 3. Settlement detail 移动端展示问题

文件：`src/components/settlement/SettlementPriceChart.tsx`、`src/pages/SettlementDetail.tsx`

现状（image-919）：移动端 Price History 卡片中，y-axis 价格 tick（`$1.04` 等）与右侧绝对定位的 `Entry`/`Exit` 徽标在同一水平线上互相覆盖；右边距太窄导致 Exit pill 贴边/被裁。

实现：
- `SettlementPriceChart.tsx`：
  - 增大 mobile 右内边距 `padding.right` 35 → 56，给徽标和价格 tick 留出独立栏位。
  - Entry/Exit pill 用 `right` 微调到紧贴 chart 右边缘外侧（基于新 padding 计算），并加 `whitespace-nowrap` 防换行。
  - tick `text` 的 `x` 仍保留 `chartWidth - padding.right + 6`，与徽标错开。
- `SettlementDetail.tsx` 中 `Position Info: Side / Leverage / Option` 这一行（lines 215-250）在 mobile 下 `flex-wrap` 时分隔符 `|` 会孤立或重复 — 把分隔符改为只在同一 flex 行内显示（`hidden sm:inline` 已有但 mobile flex-wrap 时仍可能出现孤立竖线），统一用 `gap-x-3` + 移除中间分隔符在 mobile 下的渲染。

不动：
- 多 outcome 事件的 SettlementDetail / Position chip 颜色逻辑。
- `getBinaryOutcome` / `parseSideLabels` / `useEventSideLabelsLookup` 等已有 helper。
- Order preview 的 cost / intent / TP-SL 等逻辑。

## 验证

- 桌面 build 通过、preview 在 mobile (390x777) 下：
  - 切到 `/order-preview` 单 binary 用例：Option = Oklahoma City Thunder（红），无 Side 行。
  - 切到 position detail 多 outcome (Up >5% short)：header = `No 10x` 红 chip + 灰色 `Up >5%` secondary。
  - settlement detail mobile：Price History 中 Entry/Exit 徽标不再压住价格 tick，徽标完整可见。
