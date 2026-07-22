## 移动端 Deposit 顶部 campaign 提示下线

### 改动

1. **`src/pages/Deposit.tsx`**：删除 L89 `<DepositActivationHint />` 挂载点及 L11 import。
2. **`src/components/activation/DepositActivationHint.tsx`**：删除文件（无其他引用）。

### 说明

- `/deposit` 是移动端专用页（桌面走 `DepositDialog`），删除后仅剩 `To: Spot Account ›` 选账户行，与 mainnet launch 上线后 rebate 活动已收尾的口径一致。
- `useActivationState` 里的 `"Track launch campaign progress"` 步骤文案与 `ActivationChecklist` 保持不动（那是 checklist 的独立展示，不属于 deposit 顶栏）。

### 涉及文件

- `src/pages/Deposit.tsx`（改）
- `src/components/activation/DepositActivationHint.tsx`（删）