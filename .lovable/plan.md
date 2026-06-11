## 背景修正

上一轮我说"桌面也没有"是错的。实际情况：
- `DesktopTrading.tsx` positions 表 **有 Liq. Price 列头**（line 1202），但每行 `<td>` 硬编码 `--`（line 1310），从未接过计算。
- `PositionCard.tsx`（移动持仓卡）四宫格 Qty/Entry/Mark/Margin，**完全没有 Liq. Price**。
- `PositionDetailContent.tsx`（Dialog + Drawer 共用）**也没有**。
- 只有下单预览（`DesktopTrading.tsx:414`、`TradeForm.tsx:154`、`EventCard.tsx:354`）用过近似公式算出 `liqPrice`。

所以这是历史欠账，不是回归。

## 范围

把持仓级 Liq. Price 在三处补齐：桌面表格、移动卡、Position Detail（Dialog + Drawer）。仅前端表现层改动，无后端/数据库变更。

## 计算口径

沿用现有下单预览的近似公式（已在 `TradeForm.tsx` / `EventCard.tsx` / `DesktopTrading.tsx` 中重复出现，三处一致）：

```
liqPrice = side === "long"
  ? entryPrice * (1 - 0.9 / leverage)
  : entryPrice * (1 + 0.9 / leverage)
clamp 到 [0, 1]（binary 0–1 价格区间）
若 entryPrice 或 leverage 不可解析 → 显示 "--"
```

在 `src/lib/tradingUtils.ts`（已有 `parsePrice` 等工具）新增 `calcLiqPrice(entryPrice, leverage, side)`，三处共用，避免再次出现"公式散落"。

注意：这是与下单预览一致的**简化估算**，不计入 funding 和 MM 缓冲；账户级真实清算阈值仍由 `useRealtimeRiskMetrics` / `AccountRiskIndicator` 负责。卡片上对该值加 hover/tap 提示 "Estimated, ignores funding and MM buffer."。

## 改动清单

1. **`src/lib/tradingUtils.ts`** — 新增 `calcLiqPrice(entry, leverage, side)`，返回 `string`（4 位小数）或 `"--"`。
2. **`src/pages/DesktopTrading.tsx`** — 把那行硬编码 `<td …>--</td>`（~line 1310）换成 `calcLiqPrice(position.entryPrice, position.leverage, position.type)`。给 `<th>` 加 tooltip 说明口径。
3. **`src/components/PositionCard.tsx`** — Qty/Entry/Mark/Margin 现在是 4 列；扩成 5 列在窄屏可能挤，改成 2 行布局（行1 Qty/Entry/Mark；行2 Margin/Liq/留空），或在 Margin 同行右侧加 `Liq.` 小字段。优先沿用现有 4 格 grid，把 Margin 拆成 `Margin / Liq.` 两个数值上下叠（label 共用一格），以避免列数变化破坏卡片节奏。最终样式以 `/style-guide` 4 种 LIVE preset 验证为准。
4. **`src/components/positions/PositionDetailContent.tsx`** — 在 Entry/Mark/Margin 那组明细里加一行 `Liq. Price`，桌面 Dialog 和移动 Drawer 自动同步。
5. **`docs/copy-dictionary.md`** — 登记字段名 `Liq. Price`（按 Core 规则：新增可见标签前需对齐字典）。
6. **`/style-guide`** — 移动 `PositionsSection` 的 PresetRail 增加一档"高杠杆 + 接近清算"用例，确保穷尽展示状态（按 Playground state coverage 规则）。

## 不做的事

- 不改后端、不写新 RPC、不动 PnL 公式。
- 不改账户级风险指示器口径。
- 不替换为更精确的 MM 公式（funding-aware）——如果你想要精确版我们另开一轮。

## 验证

- `/trade/order` 桌面：3 条 demo position 都应显示有效 liq（不再全 `--`）。
- `/trade/order` 移动：PositionCard 出现新字段，4 格→ 2 行布局节奏不破。
- 打开 Position Detail：Dialog/Drawer 都新增 Liq. Price 一行。
- `/style-guide` PositionsSection 新增 preset 渲染正常。
