## 目标

让用户在 Position 列表里能直接做 **部分平仓**，不必再去右侧交易面板用反向单凑数量。Desktop 表格行的 Close 按钮和 mobile `PositionCard` 的 Close 按钮都改为先弹出一个 Close Popover，让用户选择平仓比例 / 数量，并预览释放保证金与已实现 PnL。

---

## 交互设计（Popover 内容）

```text
┌──────────────────────────────────────────┐
│ Close position                            │
│ Above $100,000 · Long · 100 contracts     │
├──────────────────────────────────────────┤
│ [ 25% ] [ 50% ] [ 75% ] [ 100% ]          │
│ ────●─────────────────  50%               │ ← 滑块
│ Quantity   50 contracts                   │ ← 输入 / 显示
├──────────────────────────────────────────┤
│ Close price (mark)     $0.5800            │
│ Realized PnL           +$3.00 (+6.0%)     │
│ Released margin        $5.00              │
│ Remaining size         50 contracts       │
├──────────────────────────────────────────┤
│            [ Close 50 contracts ]          │ ← 主按钮，文案随比例变
└──────────────────────────────────────────┘
```

要点：
- 默认选中 100%（保留"一键全平"的肌肉记忆，只多一步确认）
- 主按钮文案：`Close N contracts` / 100% 时显示 `Close all`
- 颜色沿用 `trading-red`
- 数字均 `font-mono`；标签 sentence case，标题 Title Case（符合 Core 规范）

---

## 涉及文件

| 文件 | 改动 |
|---|---|
| `src/components/positions/ClosePositionPopover.tsx` | 新增。可复用组件，接收 `position` + `onConfirm(closeQty)` |
| `src/components/DesktopPositionsPanel.tsx` | Action 列 Close 按钮包到 `<Popover>` 里 |
| `src/components/PositionCard.tsx` | 把现有 `AlertDialog`（已是全平确认弹窗）替换为这个 Popover（mobile 用 Sheet/Drawer 形式更合手指） |
| `src/hooks/usePositions.ts` | 新增 `partialClosePosition(positionId, index, closeQty)`；若 `closeQty == size` 走原 `closePosition` 路径 |
| `src/hooks/useSupabasePositions.ts` | 新增 `partialClosePositionInDb`：更新 `positions.size = size - closeQty`、`margin = margin * remainRatio`，写一条 `trades` 平仓记录（reduce），把按比例的 realized PnL + 释放保证金加回 user balance |
| `src/stores/usePositionsStore.ts` | 新增 guest 版 `partialClosePosition(index, closeQty)` 等价逻辑 |

---

## 业务逻辑

设 `size` 为当前持仓数量，`closeQty` 为本次平仓数量，`ratio = closeQty / size`：

- `realizedPnl = (markPrice - entryPrice) * closeQty * (side === "long" ? 1 : -1)`
- `releasedMargin = margin * ratio`
- `balanceDelta = releasedMargin + realizedPnl`（已含手续费可后续加）
- 更新仓位：`size -= closeQty`，`margin -= releasedMargin`
- `closeQty === size` → 直接走现有 close 流程（status=Closed）
- 异步执行期间禁用按钮（沿用 `isClosing`）

复用 `src/lib/positionIntent.ts` 里 `classifyOrderIntent` 已经存在的 reduce 计算逻辑做预览数字，保证与下单流程口径一致。

---

## 边界 & 约束

- Airdrop 仓位（`positionId.startsWith("airdrop-")`）和锁定仓位（`leverage = 1x` 的 H2E）**禁用部分平仓**：Popover 只显示 `Close all`，比例选择器隐藏
- 最小平仓单位 1 contract；滑块 step = 1
- 二元事件（Yes/No）走同一逻辑，无需特殊分支
- 不改 close 按钮在表格中的视觉位置和颜色，避免影响表格密度
- 桌面端用 shadcn `<Popover>`，移动端用 `<Sheet side="bottom">`（更适合大拇指操作；与 TradeForm 的 partial fill 体验一致，符合 mem: trading-partial-fill-ux）

---

## 验收

1. Desktop /trade 点 Close → 弹出 popover，选 50% → 仓位 size 减半、margin 减半、余额按预览数字增加
2. Mobile /trade Positions tab 同上，从底部弹出 Sheet
3. 选 100% → 仓位从列表消失（status=Closed），与旧行为一致
4. Airdrop / locked 仓位的 Close 只显示全平选项
5. 数字与右侧 TradeForm 走反向单的口径一致（同 entry/mark/PnL）
