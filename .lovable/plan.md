# 把验证流程接到真正的 Withdraw 入口

## 问题

`/withdraw` 路由渲染的是 `Withdraw.tsx → WalletWithdraw.tsx`，而我上一轮把 `WithdrawVerifyDialog` 接到了另一个组件 `WithdrawForm.tsx`（目前未在主流程使用），所以钱包页提交时绕过了验证，直接进 Processing。

## 修复方案（仅前端，无后端改动）

### 1. `src/components/withdraw/WalletWithdraw.tsx`
- 引入 `WithdrawVerifyDialog`
- 新增 `verifyOpen` state
- 拆分 `handleSubmit`：
  - 旧 `handleSubmit` 只做 `validateWithdrawal`，校验通过后 `setVerifyOpen(true)`
  - 新增 `doSubmit`：真正执行 `submitWithdrawal({ token, amount, toAddress, network: selectedWallet?.network })`，并 toast 成功/失败
- 在 JSX 末尾挂 `<WithdrawVerifyDialog open onOpenChange onVerified={doSubmit} />`
- 同时把现有 `submitWithdrawal` 调用补上 `network: selectedWallet?.network`（与 WithdrawForm 一致，避免 Solana/Tron 地址被 EVM 校验拦下）

### 2. （可选清理）`src/components/withdraw/WithdrawForm.tsx`
- 该组件目前未被任何路由使用。本轮不删，保留其验证逻辑作为备用；如需删除可在下一轮处理。

## 验证

- 在 `/withdraw` 输入金额 + 选地址 → 点 Withdraw
- 应弹出 `WithdrawVerifyDialog`（移动端 MobileDrawer / 桌面 Dialog）
- 根据 Settings 里的 `withdraw_2fa_mode` 走对应步骤（demo OTP 全部 `111111`）
- 未绑邮箱时走 `bind_email` 子流程；未启用 TOTP 时走 `bind_totp` 子流程
- 验证通过后才进入 Processing
