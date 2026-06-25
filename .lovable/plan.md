## 调整 BuyWithFiat 的两处展示

### 1. Payment method 卡片简化
- 去掉每张卡片右侧的 `20 - 5,000 USD` 范围文案。
- 选中态保留紫色边框 + 右侧 `Check` 图标；未选中卡片只保留图标 + 名称。
- 限额信息已在 `You pay` 标签右侧（`Min 20 / Max 5,000 USD`）和超限红字里完整表达，无需在方法卡上重复。

### 2. 底部说明加 Banxa 规则链接
- 当前底部文案：`Powered by Banxa • Limits and fees vary by region and payment method`
- 改为：`Powered by Banxa • Limits and fees vary by region and payment method.` 后追加 `View Banxa limits` 链接
- 链接：`https://support.banxa.com/en/support/solutions/articles/44002625875-transaction-limits-for-individuals`
- 样式：`text-muted-foreground` 默认，hover 转 `text-foreground`，`underline-offset-2 hover:underline`，`target="_blank" rel="noopener noreferrer"`。

### 不变
- `You pay` 上方的 Min/Max 提示、超限红字校验、动态手续费拆解、currency/method 切换逻辑全部保留。
- 只改 `src/components/deposit/BuyWithFiat.tsx`，不动 hooks / edge functions / Supabase。
