
# Current Orders 移除 Buy/Sell 字面（统一到 option/outcome 语义）

## 问题

上一轮修复时，我对多 outcome 行保留了 `Buy`/`Sell` chip。但项目早已把 buy/sell 与 long/short 一同退役、改用 option/outcome 语义（Positions 多 outcome 行 Side 直接渲染 `option` 名而非 Buy/Sell）。Current Orders 没跟上，仍露出 "Buy"/"Sell" 字面，与持仓表割裂。

## 目标

Current Orders 全部去掉 "Buy"/"Sell" 字面，按 option 语义渲染，颜色仍由 `type`（buy=绿、sell=红）驱动。

| 场景 | Contracts 主标签 | Side 列 |
|---|---|---|
| binary（option = Yes/No） | `displayOption ?? option`，outcome 色（green/red） | `—`（不变） |
| 多 outcome（"Up >5%" 等） | option 名，无颜色 | option 名 chip，颜色按 `type`（buy=green/sell=red），与 Positions 多 outcome 一致 |

## 文件改动

### 1. `src/components/DesktopPositionsPanel.tsx`（Orders tab Side 列）

把多 outcome 分支里的 `{order.type === "buy" ? "Buy" : "Sell"}` 改成 `{order.displayOption ?? order.option}`，颜色逻辑不变。

### 2. `src/pages/DesktopTrading.tsx`

- Orders 表 Side 单元格多 outcome 分支同上：chip 内文案 `{orderDisplay}` 而非 Buy/Sell。
- Cancel Order Dialog "Order Type" 行多 outcome 分支：`${orderDisplay} ${orderType}`（与 binary 分支统一）。binary 分支保持。

### 3. `src/components/OrderCard.tsx`（mobile）

- `sideText` 多 outcome 分支：`optionDisplay` 而非 "Buy"/"Sell"。
- 顶部 chip 多 outcome 分支：文案改 `optionDisplay`。
- Fill/Cancel drawer "Order Type" 行：通过 `sideText` 复用，自动跟随。

## 不动

- 颜色逻辑（buy=green / sell=red）保持；只去字面。
- 数据层、binary 行、其它 Tab、Positions 不动。
- 不新增 memory；已被 `mem://design/single-market-binary-ui` + 现存 Positions 多 outcome 渲染模式覆盖。

## QA

- Limit Buy "$3,000 - $4,000" → Side 列绿色 chip 显示 "$3,000 - $4,000"；Cancel drawer "Order Type: $3,000 - $4,000 Limit"
- Limit Sell "25bp Cut" → Side 列红色 chip 显示 "25bp Cut"
- Buy Yes Celtics / Buy No Thunder → 不变（Side `—`，Contracts 主标签彩色）
- 桌面 + 移动一致
