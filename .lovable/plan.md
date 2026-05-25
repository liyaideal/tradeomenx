
# 修复 Positions 模块对单 market binary 事件的展示

## 现象

`/trade` 截图里出现 5 条 binary 单 market 持仓（NBA Finals / Wimbledon / UFC 316 / Shanghai Derby），但渲染明显跟最新模型脱节：

- "No · NBA Finals" 这一行的 Side 列显示绿色 "Boston Celtics"（应该是红色 "Oklahoma City Thunder"）
- "Yes · Shanghai Derby" 的 Contracts 列只显示 `Yes`，没用上 sideLabels（应直接显示 "Shanghai Shenhua"）
- Yes 选项旁边还挂着旧提示 "All positions on a binary event are displayed under the Yes outcome"

## 根因

`mem://features/binary-event-no-as-native-position` 已经把模型从"统一归到 Yes 轴"换成"Yes/No 独立持仓"：
- `option_label` 现在直接代表 Yes 或 No
- `side: long` = Buy（开多 Yes 或开多 No），`side: short` = Sell（平/反向减）

但 Positions 表的几个渲染点仍按旧模型，用 `position.type === "long" ? "Yes" : "No"` 推 Yes/No；对 "Buy No" 这种 `option=No, side=long` 的持仓就会反向：

| 持仓 | 正确显示 | 当前显示 |
|---|---|---|
| Buy No · NBA Finals (option=No, side=long) | 红色 "Thunder" / "No" | 绿色 "Celtics" / "Yes" |
| Buy Yes · Wimbledon (option=Yes, side=long) | 绿色 "Alcaraz" / "Yes" | 绿色 "Alcaraz" / "Yes"（恰好对） |
| Sell Yes（减仓产生的 short） | 红色 "Yes（Sell）" | 红色 "No" |

## 改造原则

引入一个统一 helper：**Yes/No 看 `option_label`，颜色看 outcome（Yes=绿/No=红），方向词（Buy/Sell）才看 `side`**。多 outcome 事件维持现状。

## 改动清单（仅前端展示层）

### 1. `src/lib/eventUtils.ts`
新增小工具：
- `getBinaryOutcome(optionLabel)` → `"yes" | "no" | null`（null = 非 Yes/No 选项）
- `getOutcomeDisplay(optionLabel, sideLabels)` → 拼出展示文案：有 sideLabels 用队名，否则回退 "Yes"/"No"
- `getOutcomeColorClass(optionLabel)` → 返回 `"trading-green" | "trading-red" | null`

### 2. `src/pages/DesktopTrading.tsx`（/trade 持仓表）
- Contracts 列：`position.option` 改为 `position.displayOption ?? position.option`，让 Shanghai Shenhua / Boston Celtics 直接出现在主标签上
- 删除 1229-1240 行那段 stale Yes-axis tooltip
- Side 列：从 `position.type === "long" ? "yes" : "no"` 改成基于 `getBinaryOutcome(position.option)`；颜色用 outcome 决定。如果不是 binary 选项（多 outcome 事件），保留原 Buy/Sell 语义

### 3. `src/pages/Portfolio.tsx`
- 桌面表的 Side 单元格（622-645）、移动卡片头部 Yes/No badge（474-490）：同样改成根据 `option_label`（binary）或 `side`（其他）决定 Yes/No 与配色
- `isAlias` 检查保留：当 Contracts 已经显示 team 别名时，Side 列只渲染颜色 chip（Yes/No 不重复出现）

### 4. `src/components/PositionCard.tsx`
- 213 行 header chip 与 345 行 Edit Dialog 摘要：同样 outcome-driven，移除"`type === long ? Yes : No`"

### 5. `src/components/DesktopPositionsPanel.tsx`
- 268-273（Contracts 行内 chip）+ 509-510（TPSL Dialog 内 side 描述）：outcome-driven

### 6. `src/components/positions/ClosePositionDrawer.tsx`
- description 里的 `side === "long" ? "Yes" : "No"`：改为按 option_label 推 Yes/No 文案

### 7. `src/components/OrderCard.tsx` 顺手检查
- 如果 Open Orders 也有同模式 chip 渲染，按同一规则修；多 outcome 行为不动

## 不动的部分

- DB schema、`option_label`、`side`、`option_id`、`positions` 字段都不变
- `usePositions` / `useSupabasePositions` 数据层不动（仅展示层 helper）
- PnL/notional/margin 公式不变
- 多 outcome 事件（>2 markets 或非 Yes/No）现有渲染完全保留
- Settlements / Insights / Resolved 这些已经在前几轮接 sideLabels 的页面不动
- Style Guide / Playground demo 这一轮不展开，留到下一次按 playground-state-coverage 补 outcome×side 全状态

## QA 重点

- Buy Yes（option=Yes, side=long）→ Contracts 显示 yes 队名 / Side 绿色 yes 队名
- Buy No（option=No, side=long）→ Contracts 显示 no 队名 / Side 红色 no 队名
- Sell Yes/No 减仓产生 short → Yes/No 跟着 option_label 走、颜色不再被 side 反转
- 多 outcome（"Up >5%" / "Above $4,000"）继续显示原 Buy(Yes)/Sell(No) 配色
- /trade 顶部 chip、Trade 面板、Portfolio 桌面表、Portfolio 移动卡片、Edit/Close 弹窗描述里的 Yes/No 全部一致
- 旧的 "displayed under the Yes outcome" tooltip 完全消失

## 记忆同步（实施时一并做）

- 不新增 memory；现有 `mem://features/binary-event-no-as-native-position` 与 `mem://design/single-market-binary-ui` 已经覆盖，改动只是补齐 UI 层执行
