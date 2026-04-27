我建议按下面方式改 Deposit 组件的 Address tab，desktop 和 mobile 共用同一套逻辑。

## 目标
1. 去掉最小入金金额相关展示与 pending claim 交互。
2. 首次进入 Address tab 时，先只展示 Base USDC 风险告警；用户点击确认按钮后，才展示 QR、地址和复制按钮。
3. 确认状态在本机持久化，用户确认过一次后，后续进入 Address tab 直接看到地址，避免每次都阻断。

## UI 调整

### 首次未确认状态
Address tab 只显示一个更醒目的告警确认卡：

```text
Only send USDC on Base network.
Contract: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
Sending other tokens or using a different network may result in permanent loss of funds.

[ I understand, show deposit address ]
```

说明：按钮文案不建议叫 `Claim`，因为这里不是领取资金，容易和之前 pending claim 混淆；建议用 `I understand, show deposit address` 或 `I understand`。如果你坚持用 `Claim`，实现时也可以改成 `Claim`。

### 已确认状态
展示当前地址内容，但精简掉不再需要的字段：
- 保留：告警卡、QR Code、USDC deposit address (Base)、复制地址、Generate new address、Network、Token、Fee、Confirmations、Processing time。
- 移除：Minimum deposit。
- 移除：Pending Deposits / Claim 区块。

## 两端覆盖
- `src/components/deposit/WalletDeposit.tsx`：这是当前 Deposit Address tab 实际使用的共享组件，desktop dialog 和 mobile page 都会受益。
- `src/pages/Deposit.tsx`：mobile Address tab 已经引用 `WalletDeposit`，无需单独重写布局。
- `src/components/deposit/DepositDialog.tsx`：desktop Deposit dialog 也引用 `WalletDeposit`，只需要确认容器滚动/高度仍然正常。

## 数据和逻辑调整
- `src/hooks/useDeposit.ts`：移除或停用 Address tab 里使用的 mock pending claims 逻辑，避免 UI 继续显示低于最低金额的 claim 示例。
- `WalletDeposit.tsx`：删除 `pendingClaims / claimDeposit / isClaiming / formatTimeAgo` 相关依赖和渲染。
- 用 `localStorage` 保存用户是否确认过 Base-USDC 入金风险，例如：
  - key: `omenx:deposit:base-usdc-warning-ack`
  - value: `true`

## 验证
- desktop `/wallet` 打开 Deposit -> Address：首次只看到告警和确认按钮；点击后地址出现。
- mobile `/deposit` -> Address：同样首次确认后才显示地址。
- 刷新页面后：已确认用户直接显示地址。
- 检查 TypeScript 编译，确保删除 claim 逻辑后没有未使用 import 或类型错误。