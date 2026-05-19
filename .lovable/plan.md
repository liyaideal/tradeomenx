在 `src/components/deposit/WalletDeposit.tsx` 做两处精简：

## 1. 删掉 checklist 卡里的 contract 地址展示

警告卡顶部那段：
```
Contract: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```
整行删除。保留 "Only send USDC on Base network." 主标语和"Sending other tokens or using a different network may result in permanent loss of funds." 后果说明。

第三条 checklist 文案同步调整：
- 旧："I have verified the USDC contract address shown below"
- 新："I have double-checked the deposit address below before sending"

理由：contract address 不是 deposit address，放在这里会混淆；用户真正要核对的是下方的 custody address。

## 2. 删掉 checklist 卡底部的 recovery 入口

整段移除：
```
Sent to the wrong chain by mistake? Request recovery (10% fee applies).
```
连同上面那个 AlertTriangle icon 一起删。

Recovery 入口只保留在 `PendingConfirmations.tsx`（用户真正发现没到账时才看到），不在充值前提示。

## 不动的部分

- `PendingConfirmations.tsx` 的 recovery 入口保留
- `/wallet/recovery` 页面、表单、hook、表都保留
- 3 条 checklist 结构保留（只改第三条文案）
- `WARNING_ACK_KEY` 保持 v2 不动
