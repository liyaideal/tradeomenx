
# Current Orders 适配单 market binary（desktop + mobile）

## 问题

Current Orders 仍然用「`order.type === 'buy' ? Yes : No`」推导 Yes/No，这套是旧的 Yes 轴归一化逻辑，与新规则 `binary-event-no-as-native-position` 冲突：

- 用户挂一笔「Buy No Thunder」的 Limit 单，`type='buy'` + `option='No'` → 旧逻辑把 Side 渲染成 **Yes**（绿色） + Contracts 显示 "No / Oklahoma City Thunder"，方向与持仓表完全相反，会严重误导
- 同时违反 `single-market-binary-ui` 规则：binary 行 Side 应留空、outcome 颜色挂在 Contracts 主标签上

## 修复策略

复用 Positions 的相同规则（`getBinaryOutcome(option)`）：

| 场景 | Contracts 主标签 | Side / 顶部 chip |
|---|---|---|
| binary Yes (option="Yes") | `text-trading-green` + `displayOption ?? option`（队名或 Yes） | 空（桌面 `—`，移动隐藏 chip） |
| binary No (option="No") | `text-trading-red` + 同上 | 空 |
| 多 outcome（"Up >5%" 等） | 现有 `<span>{option}</span>` 不变 | 保留 Buy/Sell 颜色 chip（用 `type` 推 Buy=绿、Sell=红，文案 "Buy"/"Sell" 而非 Yes/No；今天文案是 Yes/No 也是错的，顺手统一） |

**注意**：彻底不再用 `order.type → Yes/No` 这条映射。`type` 表示 Buy/Sell 动作；只在多 outcome 行显示 Buy/Sell。

## 文件改动

### 1. `src/pages/DesktopTrading.tsx`

**Orders 表（line 1068-1100）**：
- Contracts 单元格（line 1071）：主标签 `{order.option}` 加 outcome 色 class（binary 时 green/red，多 outcome 时 `text-foreground`）。若 `displayOption` 与 option 不同，作为副标题列在事件名之前。
- Side 单元格（line 1096-1100）：binary 行渲染 `<span className="text-muted-foreground/40">—</span>`；多 outcome 行渲染 Buy/Sell chip（绿/红 + 文案 "Buy"/"Sell"）。

**Cancel Order Dialog（line 2076-2118）**：
- "Order Type" 行：binary → `<outcomeColor>{displayOption ?? option} {orderType}</outcomeColor>`；多 outcome → `<typeColor>{type} {orderType}</typeColor>`，去掉 `resolveBinarySideLabel`。

### 2. `src/components/DesktopPositionsPanel.tsx`（Orders tab，line 422-475）

- Contracts 列（line 425-430）：主行 `{displayOption ?? option}` 加 outcome 色（binary）；事件名保持灰色副标题。
- Side 列（line 431-439）：binary 行 → `—`；多 outcome 行 → Buy/Sell chip。

### 3. `src/components/OrderCard.tsx`（mobile）

- 顶部 chip（line 80-93）：当前用 `isBinaryAlias`（仅当 displayOption 是别名时）跳过 Yes/No chip 渲染。改用 `getBinaryOutcome(option)` 判定，binary（含无别名的纯 Yes/No）都不再渲染 chip。
- Event Info（line 100-105）：binary 行的 `optionDisplay` 加 outcome 色（绿/红），多 outcome 不变。
- Fill / Cancel Drawer 内的 "Order Type" 行（line 141-145、188-191）：binary → outcome 色 + `{displayOption ?? option} {orderType}`；多 outcome → 现有 type 色 + `{type} {orderType}`，去掉 Yes/No 字面。

## 不动

- `useOrders` / `useSupabaseOrders` / `useOrdersStore` 数据层不动
- 多 outcome 事件的行整体保持
- `eventUtils.getBinaryOutcome` / `sideLabels` 不动
- Positions / Filled / 其它 Tab 不动

## QA

- Buy Yes Celtics（binary）→ Contracts "Boston Celtics" 绿；Side `—`；Cancel drawer "Order Type: Boston Celtics Limit"（绿）
- Buy No Thunder（binary，关键回归）→ Contracts "Oklahoma City Thunder" 红；Side `—`；Cancel drawer "Order Type: Oklahoma City Thunder Limit"（红）
- Buy "$3,000 - $4,000"（多 outcome）→ Contracts 白色；Side "Buy" 绿色 chip
- Sell "25bp Cut"（多 outcome）→ Side "Sell" 红色 chip
- 移动端三处（卡片、Fill drawer、Cancel drawer）表现一致

## 记忆

不新增 memory；现有 `mem://design/single-market-binary-ui` 已覆盖。
