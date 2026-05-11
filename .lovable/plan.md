## Withdraw 最低金额提示前置 + 实时校验

最低金额（USDC/USDT 20）目前只藏在 Summary 行的 `Minimum: 20 USDC`，且只有点 Submit 才会触发 `validateWithdrawal` 报错。要把信息前置并加实时校验。

### 改动文件

1. `src/components/withdraw/WalletWithdraw.tsx`
2. `src/components/withdraw/WithdrawForm.tsx`

### 三处一致改动

**A. 输入框 placeholder** 由 `0.00` 改为 `Min ${minAmount}`，让用户在输入前就看到下限。

**B. 输入框下方 Available 行右侧并列展示 Min**
```
Available: 12.50 USDC          Min 20 USDC
```
（与 Available 同一行，`flex justify-between`，统一 `text-xs` / `text-sm` 灰）

**C. 实时校验 inline 错误**
在 `handleAmountChange` 内（或派生 `amountError`）：
- amount 非空且 `parseFloat(amount) > 0` 且 `< minAmount` → 设 `error = "Minimum withdrawal is 20 USDC"`
- 输入合法或为空 → 清空 error
继续沿用现有红框样式 `error && border-trading-red`。

**D. Submit 按钮 disabled 增加条件**
```
disabled={isSubmitting || !amount || !selectedAddress || parseFloat(amount) < minAmount}
```

### 不动

- `WITHDRAW_MINIMUMS` 数值（保持 USDT/USDC = 20）
- Summary 内 `Minimum` 行（保留作为最终复核展示）
- 后端 / `useWithdraw` 校验逻辑（仅前端 UX 优化）
- 其他 token 的最低额展示