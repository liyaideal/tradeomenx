## 移除 Withdraw 的 Fiat 通道

Banxa 支持国家有限，Withdraw 仅保留 Address（链上）通道。

### 改动
1. **`src/components/withdraw/WithdrawDialog.tsx`**
   - 删除 Fiat Tab 与 `SellToFiat` 引入，去掉 Tabs 容器，直接渲染 `<WalletWithdraw onDone={handleClose} />`。
   - 移除 `activeTab` state 与相关 reset 逻辑。
2. **`src/pages/Withdraw.tsx`**
   - 同上：移除 Tabs / Fiat Tab / `SellToFiat`，main 内直接渲染 `<WalletWithdraw />`。
   - 移除 `activeTab` state。
3. **`src/components/withdraw/SellToFiat.tsx`** — 删除文件（不再被引用）。
4. **`src/components/withdraw/index.ts`** — 移除 `SellToFiat` 导出。

### 不动
- Deposit 的 Fiat（`BuyWithFiat`）保持不变 —— 入金渠道仍可用 Banxa。
- TransactionHistory 中 `fiat_sell` 标签保留，历史记录仍可显示。
- `WalletWithdraw` 内部逻辑、地址簿、手续费展示全部保留。
