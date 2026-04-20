

# Long/Short 双价 TradeForm 改造（Desktop + Mobile）

## 改动范围
同时修改移动端和桌面端的交易面板，只改 TradeForm 区域。

## 文件清单
1. `src/components/TradeForm.tsx` — 移动端交易面板
2. `src/components/DesktopTradeForm.tsx` — 桌面端交易面板

## 具体改动

### 1. Buy/Sell 切换按钮下方新增双价提示
在现有的 buy/sell 切换按钮下方增加一行小字：
```
Buy at 0.62  ·  Sell at 0.38
```
- 当前选中的 side 高亮显示，对侧灰色
- 让用户在切换前就能看到两边价格差异

### 2. Price 输入框动态填价
- Buy 选中时，price 输入框自动填入 longPrice
- Sell 选中时，price 输入框自动填入 shortPrice (1 - longPrice)
- 保留用户手动修改的能力

### 3. 计算逻辑更新
- `potentialWin` 公式根据 side 使用对应价格：
  - Buy: `(1 - longPrice) * qty`
  - Sell: `(1 - shortPrice) * qty` (即 `longPrice * qty`)
- `liqPrice` 公式 sell 方向取反

### 4. 教育提示（可选）
side 切换区域旁边加一个 `Info` 图标，hover 显示：
> Long 和 Short 价格不再相等。Short = 1 − Long。

## 不改动
- OrderPreview.tsx — 已有 Side 字段，足够表达
- 任何其他页面或卡片

