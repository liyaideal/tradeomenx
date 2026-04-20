

## 回退 MarketListView 的 Buy/Sell 双价 → 单价 + ⓘ 说明

### 背景
上次改动让子市场行显示 Buy/Sell 双价，但单一的 24H CHG% 和双价在逻辑上矛盾（Buy 涨 = Sell 跌，% 数值还不同）。回退到单价更符合行业惯例和扫读场景。

### 改动文件
`src/components/events/MarketListView.tsx`

### 具体改动

**1. 子市场展开行 sub-header**
- 把 "Buy / Sell" 列改回单列 **"Price"**
- 在 "Price" 文字旁加 ⓘ Tooltip：
  > "Showing Long price. Short price = 1 − Long. Learn more in Glossary."
  
  （tooltip 内文案精简版即可，不强行做成可点击链接，保持轻量；想了解的用户自然会去 /glossary 查 "Long vs Short Pricing"）

**2. ChildRowContent 价格单元格**
- 删除 `<span class="text-trading-green">Buy</span> / <span class="text-trading-red">Sell</span>` 双价
- 改回单一价格显示 `${child.markPrice.toFixed(2)}`，颜色用 `text-foreground`（中性，不带方向暗示）
- 保持 `font-mono` 和右对齐

**3. 列宽调整**
- 双价列原本宽度 `w-[120px]`，单价可以缩回 `w-[90px]` 或 `w-[100px]`，给其他列腾点空间

### 不改动
- 父事件行（本来就是单价/单 CHG，没问题）
- 其他所有页面（OrderBook 联动、TradeForm 双价按钮、Glossary 词条等都保留）
- CHG% 和 Vol 列（保持基于 Long 视角，语义自洽）

### 一句话总结
**列表场景用单价 + ⓘ 提示；只有下单场景（OrderBook + TradeForm）才需要双价联动。** 这样信息密度、视觉一致性、语义正确性三者兼顾。

