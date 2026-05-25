## 问题定位

上一轮我把单 market binary 的 Side 列折叠成 `—` 时，**错误地把多 outcome 事件的"非 binary 分支"也一并改了** —— 从原本的 `Yes/No` (long/short) 改成了 `Buy/Sell` chip，并且在 Positions 表里改成了直接渲染 `{position.option}`（例如 "Up >5%"、"Boston Celtics"），导致截图里的怪异多 chip 折行（其实是单个 chip 在窄列里被强制 word-wrap，背景按行重复）。

按 `2026-05-25-single-market-binary-round3.md` 既定规则：
- **单 market binary** → Side 列 `—`（option label 已在 Contracts 列以绿/红显示）
- **多 outcome（其他所有事件）** → Side 列 **Yes / No** chip（long/buy → 绿色 Yes；short/sell → 红色 No），通过 `resolveBinarySideLabel(...)` 渲染，自动支持 sideLabels 别名回退到 Yes/No

我之前提案里"Buy/Sell chip"的方向就是错的，需要回退到 Yes/No。

## 受影响的文件与改动

### 1. `src/pages/DesktopTrading.tsx`
- **Positions 表 Side 单元格（~1271-1285）**：非 binary 分支当前渲染 `{position.option}`，改为
  ```tsx
  {resolveBinarySideLabel(
    position.type === "long" ? "yes" : "no",
    lookupSideLabels(position.event).labels
  )}
  ```
  颜色按 `position.type === "long"` 取 `trading-green`/`trading-red`。binary 分支保留 `—`。

- **Orders 表 Side 单元格（~1104-1111）**：非 binary 分支当前渲染 `Buy`/`Sell`，改为
  ```tsx
  {resolveBinarySideLabel(
    order.type === "buy" ? "yes" : "no",
    lookupSideLabels(order.event).labels
  )}
  ```
  颜色按 `order.type === "buy"` 取绿/红。binary 分支保留 `—`。

- **Cancel Order 对话框（~2089-2108）**："Order Type" 行非 binary 分支当前文案是 `Buy/Sell + orderType`，改为 `resolveBinarySideLabel(...) + orderType`（绿/红同上规则）。binary 分支保留现在的 `displayOption + orderType` 写法不变。

### 2. `src/components/OrderCard.tsx`（mobile）
- header 顶部 chip（~92-103）：非 binary 当前显示 `Buy`/`Sell`，改为根据 `type` 取 `Yes`/`No`（无 event 上下文，直接用字面量；mobile 路径下别名已通过 `displayOption` 传入，chip 仅承担方向语义）。绿/红规则保持。
- Fill / Cancel drawer 里的 `sideText` 同样从 `Buy/Sell` 改为 `Yes/No`（binary 分支保留 `displayOption` 不变）。

### 3. `src/components/DesktopPositionsPanel.tsx`（虽然当前未被任何路由引用，但保持一致避免下次回滚踩坑）
- Orders 表 Side 单元格（~438-449）：同 DesktopTrading Orders 表，非 binary 改为 Yes/No chip via `resolveBinarySideLabel`（需引入 `useEventSideLabelsLookup`），binary 保留 `—`。
- Positions 表 Contracts 单元格里残留的 `{position.option}` 多 outcome chip（~277-287）：恢复为原 `position.type === "long" ? "Yes" : "No"` chip 文案（不再放 option 名，避免再次复现这次的折行 bug）。

## 不动 / 保留语义

- 所有 binary 单 market 事件相关收敛（顶部 chip 折叠、Trade 面板别名按钮、Contracts 列 yes/no 绿红着色 + `—` Side、海报/列表别名贯穿）**全部保持**，本次只回退多 outcome 分支。
- `getBinaryOutcome` / `resolveBinarySideLabel` / `useEventSideLabelsLookup` / `displayOption` 数据层不变。
- DB schema、useOrders / useSupabaseOrders / useSupabasePositions 不动。
- 多 outcome 事件本身的展示（Contracts 列 option 名 + event 副标）不变。

## QA 用例

| 事件类型 | 例子 | Contracts | Side |
|---|---|---|---|
| binary Yes | NBA Finals 2026 Game 7: Celtics（Buy Yes） | 绿色 "Boston Celtics"（别名） | `—` |
| binary No | NBA Finals 2026 Game 7: Celtics（Buy No） | 红色 "Oklahoma City Thunder" | `—` |
| 多 outcome（long） | SOL Weekly Performance · "Up >5%" | "Up >5%" | 绿色 `Yes` chip |
| 多 outcome（short） | UFC 316 Headliner · "Magomed Ankalaev"（sell） | "Magomed Ankalaev" | 红色 `No` chip |
| 多 outcome（buy 限价单） | Ethereum price · "$3,000 - $4,000" | "$3,000 - $4,000" | 绿色 `Yes` chip |

无需新建/删除文件，无 DB 迁移，无新依赖。