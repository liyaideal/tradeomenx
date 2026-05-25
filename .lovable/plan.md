## 背景

刷新没问题，是漏改：桌面 `/trade` 不走 `TradeForm`，而是用 `DesktopTrading.tsx` 内联的 Trade 面板。上一轮只更新了 `TradeForm.tsx`（移动端 `/trade/order` 在用），所以桌面看到的还是旧样式（队名 + 价格挤在同一色块里）。

## 改动

仅 1 个文件：`src/pages/DesktopTrading.tsx`，1396–1435 行 Yes/No 切换 block。

替换为 v3 双层结构，与 `TradeForm.tsx` 完全一致：

- 容器：`grid grid-cols-2 gap-2 p-1 bg-background rounded-lg`
- 每个按钮：`relative flex flex-col h-14 rounded-md overflow-hidden transition-all`
- 上层（label 区，flex-1，居中）
  - Yes 选中 `bg-trading-green text-trading-green-foreground`
  - No 选中 `bg-trading-red text-foreground`
  - 未选中 `bg-muted text-muted-foreground hover:bg-muted/80`
  - 文案 `text-[11px] font-semibold leading-tight line-clamp-2 text-center px-2`（用 `binaryLabels.yes/no`）
  - 选中态右上角加 `absolute top-1 right-1 w-1 h-1 rounded-full bg-current shadow-[0_0_4px_currentColor]`
- 下层（price 区，固定 `h-5`，居中）
  - 选中 `bg-black/15`，未选中 `bg-black/20 text-muted-foreground`
  - `text-[10px] font-mono`，4 位小数

onClick 行为完全保留：Yes 按钮 → `setSide('buy')` + `setSelectedOption(yesNoOptions.yes.id)`；No 按钮 binary 下 `setSide('buy')` + `setSelectedOption(yesNoOptions.no.id)`，非 binary 下 `setSide('sell')`。

## 不动

- 业务逻辑、`binaryMode` / `selectedOption` 状态、PnL/订单链路
- `TradeForm.tsx`（移动端已是 v3）
- DESIGN.md / 内存（这是组件内部细节）
- `src/components/DesktopTradeForm.tsx`（实际未被使用，留待清理）

## 验证

- 桌面 `/trade?event=nba-finals-2026-g7`：两按钮等高、Boston Celtics / Oklahoma City Thunder 两行不溢出、底部独立价格条
- 切到普通 binary（BTC 100k）：上层显示 "Yes"/"No"，行为一致
- 选中态切换时下方 K 线/订单簿仍跟随
