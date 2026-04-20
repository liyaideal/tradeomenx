

## 删除 "Why two prices?" 提示

### 改动文件
1. `src/components/TradeForm.tsx`（移动端）
2. `src/pages/DesktopTrading.tsx`（桌面端）

### 具体改动
- 移除两个文件中 Buy/Sell 切换下方的 "Why two prices?" 行（包含 Info 图标 + Tooltip）
- 顺便清理不再使用的 import（`Info` icon、`Tooltip` 相关组件，如果别处没用到）

### 不改动
- Buy/Sell 按钮内嵌的 Long/Short 价格保留（这是核心信息）
- OrderBook 联动逻辑保留
- Limit 价格自动填充逻辑保留

### 后续可选（不在本次范围）
- 在 `/glossary` 加一条 "Long vs Short Pricing" 词条，作为有需要时的查询入口

