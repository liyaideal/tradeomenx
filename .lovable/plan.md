## 背景
Mobile 端已完成 sideLabels 别名传播（"Buy Yes" → "Buy Carlos Alcaraz"），但 `src/pages/DesktopTrading.tsx` 仍有多处硬编码 `"Yes" / "No"`。截图显示 Trade 面板提交按钮仍写"Buy No - to win $0"，应显示"Buy Carlos Alcaraz - to win $..."。

## 修复范围（仅 DesktopTrading.tsx）

仅当 `isBinarySingleMarket && binaryLabels` 同时存在时，用 `binaryLabels.yes / binaryLabels.no` 替换；否则保持现状 "Yes/No"。

### A. 当前事件作用域（直接用顶层 `binaryLabels` / `isBinarySingleMarket`）

1. **L1762 主 Trade 面板提交按钮**：`getIntentLabel(orderIntent, side)` → `getIntentLabel(orderIntent, side, isBinarySingleMarket ? binaryLabels : undefined)`。
2. **L1874 Order Preview Dialog 确认按钮**：同上。
3. **L1793 Order Preview Dialog 顶部 side chip**：`side === "buy" ? "Yes" : "No"` → 二元时显示别名。
4. **L499 `orderDetails` Side 字段**：同上替换。

### B. 跨事件聚合表（需按行 lookup 各自事件的 sideLabels）

这些表行属于不同事件，需要从行的 `eventId`（或 `event` 名）映射到 `TradingEvent`，再通过 `getBinarySideLabels` 获取别名。若行所属事件非 single-market binary 或 lookup 失败，保留 "Yes/No"。

5. **L1095 Open Orders 表 — side 列**。
6. **L1260 Positions 表 — side 列**。
7. **L1348 Airdrop counter side 列**。
8. **L1930 Close Position Dialog — "Position" 行**。
9. **L2070 Cancel Order AlertDialog — "Order Type" 行**。

实现思路：在 DesktopTrading 顶层用现有事件源（`mockEvents` / context）构建 `Map<eventId, { isBinary, sideLabels }>` 或行内 `useMemo` 单次查找的 helper（如 `resolveBinaryLabels(eventName | eventId)`）。所属事件不可用时回退到 "Yes/No"。

### C. 文档同步

- `DESIGN.md` §Single-Market Binary Trade Toggle 的 sideLabels propagation 小节追加"Desktop /trade 同样适用：Trade 提交按钮、Order Preview、Side chip、Open Orders/Positions/Airdrops 表 side 列、Close/Cancel 弹窗均须用 sideLabels 替换 Yes/No"。
- `mem://design/single-market-binary-ui` 追加相同条款。

## 不改动
- `TradingCharts.tsx`、`TradeForm.tsx`、`OrderPreview.tsx`、`positionIntent.ts` 已在上一轮完成。
- 多 outcome 事件、Portfolio、Settlement、glossary、StyleGuide 内容均不变。

## 技术细节
- `getBinarySideLabels` 接受 `TradingEvent`；`isSingleMarketBinary` 接受 options 数组。
- B 类表格中的 row.eventId 在当前实现里映射到 `mockEvents` / `selectedEvent` context，需复用 DesktopTrading 已有的事件列表（避免新增数据流）。
