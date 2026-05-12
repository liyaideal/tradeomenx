## 目标
删除 withdraw 弹窗里 H2E 相关的文案模块，因为 Wallet 页面已经有清晰的 H2E 解锁展示，不需要在提现弹窗里重复。

## 改动范围
仅删除展示文案，**保留** `availableBalance = max(0, rawAvailable - h2e.lockedAmount)` 的余额扣减逻辑（H2E frozen 仍需锁定，不能让用户绕过限额提现）。

### 1. `src/components/withdraw/WalletWithdraw.tsx`
- 删除 line 195-197 的 H2E 锁定提示块：
  ```
  {!h2e.isFullyUnlocked && h2e.lockedAmount > 0 && (
    <div>${h2e.lockedAmount} locked (H2E — ...% already withdrawable; trade $... more to unlock ...%)</div>
  )}
  ```

### 2. `src/components/withdraw/WithdrawForm.tsx`
- 删除 line 193-195 的同类 H2E 锁定提示块（"hedge airdrop — ..."）。

## 不动的部分
- `useH2eRewardsSummary` 的导入与 `availableBalance` 扣减逻辑保留（确保 frozen 部分仍受限制）。
- Wallet 页面的 H2E 模块、解锁阶梯 UI 不动。
- 最低提现金额（20 USDC）相关 UI 不动。

## 同步更新文档
更新 `omenx-recent-shipped-requirements_v2.md`，在 "Withdraw minimum UX" 章节后追加一条说明：withdraw 弹窗内移除 H2E 文案模块，H2E 展示统一由 Wallet 页面承担，但提现额度仍按 `availableBalance - h2e.lockedAmount` 限制。
