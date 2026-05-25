## 计划

1. **修复 desktop Order Preview 头部展示**
   - 在 `src/pages/DesktopTrading.tsx` 中，为单 market binary 计算一个 `previewOptionLabel`：
     - 单 market binary：`Option` 显示队名/别名（例如 `Oklahoma City Thunder`），不再显示原始 `Yes/No`。
     - 多选项事件：`Option` 继续显示 market/option 名称。
   - 头部右侧 chip：
     - 单 market binary：移除 Yes/No/队名 Side chip，只保留 intent chip（例如 `increase`）。
     - 多选项事件：保留 `Yes/No` Side chip。

2. **修复 desktop Order Details 数据源**
   - 同步更新 `orderDetails`：
     - 单 market binary：只渲染 `Option = 队名/别名`，不渲染 `Side` 行。
     - 多选项事件：仍渲染 `Option = option 名称` + `Side = Yes/No`。
   - 这样避免隐藏字段或后续复用时再次出现 `Option: No / Side: Oklahoma City Thunder`。

3. **小范围检查其他 Order Preview 入口**
   - 我会复查 `src/pages/OrderPreview.tsx`（移动端独立页面）和 `src/components/EventCard.tsx`（卡片弹窗预览）是否还有同类展示错位。
   - 如果只涉及同一展示规则，会一并做最小修复；不改交易执行、PnL、margin 或持仓业务逻辑。