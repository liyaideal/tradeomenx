## 收尾任务

承接上一轮 voucher 改造（granted → claimed → redeemed → settled + 4 档 earnings claim），把残留收尾完成。

### 1. Style Guide playground 对齐新状态机
`src/pages/StyleGuide/sections/VouchersSection.tsx`
- `VoucherCard` 演示新增 **Granted (To claim)** 状态，CTA `Tap to claim`，配 7-day 倒计时说明。
- 现有 `Compact · fresh` / `Compact · expiring <24h` 改名为 **Claimed · fresh** / **Claimed · expiring <24h**，体现 claimed_at + 7d 窗口。
- `VoucherEarningsCard` 演示穷尽 4 档：
  - T0 volume = 0（locked，按钮 disabled）
  - T1 已解锁 $25（lifetime 0）
  - T2 已解锁 $100、pending < cap
  - T3 已解锁 $500、pending > 剩余 cap（演示 `min(pending, cap−lifetime)`）
  - T4 Unlimited（pending 任意）
- PresetRail 横滑切换以上状态，遵循 `playground-state-coverage` memory。

### 2. Copy dictionary 锁定
`docs/copy-dictionary.md` 增补：
- `Granted` / `To claim` / `Tap to claim` / `Claim window 7 days`
- 4 档名称：`Tier 1–4` + 阈值 `$5,000 / $15,000 / $50,000 / $150,000`
- `Claim $X to wallet` 按钮文案
- 列出已废弃旧写法：`Available vouchers` 不再涵盖 granted。

### 3. Memory 更新
- 更新 `mem://features/voucher-earnings-pool`：把单一 50k 门槛改成 4 档阶梯表，引用 `src/lib/voucherTiers.ts`。
- 新增 `mem://features/voucher-claim-window`：granted→claimed 需用户主动领取，claimed 后 7 天内必须 redeem，否则 expired。
- 更新 `mem://index.md` Core 区一行说明 + Memories 引用。

### 4. 自检
- `/vouchers` 桌面 + 移动端：To claim 区有 granted 卡、Available 区只剩 claimed 卡、Earnings 卡按 tier 显示按钮金额。
- `/style-guide` Vouchers section 所有 PresetRail 状态可见、无 console 报错。
- 不动 DB / edge function（上一轮已交付）。

### 不在范围
- 不改 `ClosePositionDialog` / `Drawer`。
- 不改 `profiles.balance` 流程。
- 不动 settle / liquidation 逻辑。