## 统一规则

1. **多选项 event**
   - Contract/Option 始终显示市场选项名，例如 `Up >5%`、`Boston Celtics`、`Above $4,000`。
   - Side 始终由交易方向映射：`long/buy -> Yes`，`short/sell -> No`。
   - 绝不能把选项名放到 Side chip 里。

2. **单 market binary event**
   - 原始 option 是 `Yes` / `No`；如果 event 有 `sideLabels`，Contract/Option 应显示别名，例如两个队名或选手名。
   - Side 列/Side chip 不重复展示方向，显示 `—` 或不渲染。
   - Contract/Option 用 outcome 着色：Yes 端绿色，No 端红色。

## 目前确认漏掉/改坏的地方

- **移动端 PositionCard**：多选项持仓 header chip 现在显示 `position.option`，截图里的 `Up >5%` 就是这里错了；应改为 Yes/No。
- **Portfolio positions**：移动端和桌面端多选项 Side badge 仍在显示 `position.option`，应改为 Yes/No。
- **Position detail / TP-SL dialogs**：多个弹窗的 Position 行仍把多选项 option 当作 side 展示，应改为 Yes/No；binary 则只显示别名/合约名。
- **DesktopTrading close dialog**：Close position 传入的是 raw `position.option`，binary 别名会丢失，应传 `displayOption`。
- **DesktopTrading order preview**：binary 下 Side 目前按 `side` 推导，选 No 端但 side 仍为 buy 时会显示 Yes 端别名；应按 selected option 的 Yes/No outcome 推导。
- **Mobile OrderPreview page**：同样按 `side` 推导 binary side label，No 端会错成 Yes 端。
- **DesktopPositionsPanel fill/cancel dialogs**：只按 buy/sell 显示 Yes/No，没有对 binary 做隐藏/别名处理。
- **Settlement share cards/posters**：binary 下仍把 sideLabels 当 Side badge 展示，应该避免重复 Side，将别名作为 contract/outcome 展示。
- **Settlements 列表**：部分页面只做了 option 文案转换，但缺少统一的 binary outcome 着色与 Side 处理校验。

## 修复方案

1. **新增/整理统一展示 helper**
   - 在现有 `eventUtils` 或相邻工具中集中提供：
     - `getOutcomeFromOption(option)`：识别 raw `Yes/No`。
     - `getDirectionLabel(side/type)`：多选项方向映射为 Yes/No。
     - `getContractDisplay(option, displayOption, sideLabels)`：binary 显示队名/别名，多选项显示 option。
     - `shouldHideSide(option)`：binary raw `Yes/No` 时 Side 显示 `—` 或不渲染。
   - 目的：避免每个页面自己写一套逻辑，再次误伤多选项 event。

2. **修复移动端交易页**
   - `PositionCard`：
     - 多选项 header chip 改成 Yes/No，不再显示 `Up >5%`。
     - binary 不渲染 Side chip，合约名用 `displayOption` 并按 Yes/No outcome 着色。
     - TP/SL drawer 的 Position 行同步使用同一规则。
   - `OrderCard`：
     - 保持多选项 Order Type 为 Yes/No。
     - binary 的 drawer Order Type 不再显示 `Alex Pereira Limit` 这种把合约名当 side 的格式，改为隐藏 side 或只显示 order type + contract。
   - `OrderPreview.tsx`：
     - binary 下 Side 值改为基于 `optionLabel` 的 outcome，而不是 `side`。

3. **修复桌面交易页**
   - `DesktopTrading.tsx`：
     - Positions/Orders 表格继续保持：binary Side `—`，multi Side Yes/No。
     - Order Preview dialog：binary 下 Side chip 基于 selected option outcome；multi 基于 buy/sell。
     - Close position dialog 使用 `displayOption`，避免 binary 队名/选手名丢失。
     - TP/SL dialog Position 行：multi 显示 Yes/No，binary 显示别名/合约名且不重复 side。
   - `DesktopPositionsPanel.tsx`：
     - Positions table、Orders table、Fill dialog、Cancel dialog、TP/SL dialog 全部套统一规则。

4. **修复 Portfolio / Resolved / Settlement**
   - `Portfolio.tsx`：
     - Positions mobile/desktop：multi Side badge 改 Yes/No；binary Side 显示 `—`，contract 着色。
     - Settlements mobile/desktop：确认 multi Side Yes/No，binary `—`，contract 使用 resolved display label 并按 outcome 着色。
   - `PortfolioSettlements.tsx`：
     - 为 settlement rows 补齐同样的 Side/contract 规则，避免只有 option 没有 side 的页面漏掉。
   - `SettlementDetail.tsx`：
     - Option 显示使用 resolved display label/sideLabels，不再 raw `Yes/No`；binary 隐藏 Side badge。
   - `SettlementShareCard.tsx` / `SettlementPoster.tsx`：
     - binary 不再把队名放进 Side badge；把队名作为 contract/outcome 展示。
     - multi 继续显示 Yes/No side + option。

5. **验证清单**
   - Active trading event：
     - 单 market binary（如 UFC）：顶部/preview/orders/positions/close/TP-SL 都显示队名或 `—` side，不出现重复 Yes/No。
     - 多选项（如 SOL Weekly、ETH Price Prediction）：Side 永远是 Yes/No，Contract 永远是 `Up >5%` / `Above $4,000`。
   - Resolved event + settlement detail + share poster：同上。
   - Portfolio mobile/desktop：Positions 与 Settlements 同上。
   - Transaction history：确认它是资金流水，不展示 trade Side；不做无关改动。
   - 全局搜索验证：不再存在把 `position.option` / `order.option` 直接渲染到 Side chip 的位置。