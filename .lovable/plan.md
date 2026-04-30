建议做成阶梯解锁。单一 $400,000 门槛对用户心理压力太大，尤其是奖励上限只有 $100 时，会显得“投入门槛过高”。阶梯式解锁可以让用户在早期更快看到回报，降低放弃率，同时保留后段交易量目标来驱动主网活跃。

推荐产品规则：

```text
H2E reward withdrawal unlock tiers

$10,000 volume    -> unlock 10% of H2E rewards
$50,000 volume    -> unlock 25% of H2E rewards
$100,000 volume   -> unlock 50% of H2E rewards
$200,000 volume   -> unlock 75% of H2E rewards
$400,000 volume   -> unlock 100% of H2E rewards
```

这样用户看到的不是“还差 $397,550 才能提 $100”，而是：
- 再交易 $7,550 就能先解锁 10%
- 后续继续交易可以逐步解锁更多
- $400,000 仍然是完全解锁目标，但不再是唯一目标

Implementation plan:

1. Update H2E unlock calculation
   - 将当前单一 `H2E_VOLUME_UNLOCK = 400000` 改为 tier 配置。
   - 新增字段：
     - `unlockedPercent`
     - `unlockedAmount`
     - `lockedAmount`
     - `nextTierVolume`
     - `nextTierPercent`
     - `volumeToNextTier`
     - `isFullyUnlocked`
   - 保留 $400,000 作为最终 100% 解锁门槛。

2. Update Wallet `Hedge Airdrop Rewards` card
   - 把 `Volume to unlock withdrawals` 改成更柔和的文案，例如：
     - `Withdrawal unlock progress`
   - 右侧显示：
     - `$2,450 / $10,000` 作为下一档目标，而不是直接显示 `$2,450 / $400,000`。
   - 下方文案改为：
     - `Trade $7,550 more to unlock 10%`
   - 增加一个小型 tier summary：
     - `Current unlocked: 0% · Full unlock at $400,000`
   - 当达到某档时显示：
     - `25% unlocked — next tier at $100,000`
   - 完全解锁时显示：
     - `Fully unlocked — rewards are withdrawable`

3. Update withdrawal lock copy
   - 当前提现弹窗里显示：
     - `trade $397,550 more to unlock`
   - 改为下一档导向：
     - `$6.50 H2E locked — trade $7,550 more to unlock 10%`
   - 如果已部分解锁，则只锁住未解锁部分，例如：
     - `$4.88 H2E locked — 25% already withdrawable`

4. Keep withdrawal logic aligned with tiers
   - 可提现 H2E 金额 = `frozenBalance * unlockedPercent`。
   - 未解锁部分继续计入 locked balance。
   - 到 $400,000 后全部 H2E reward 可提现。

5. Update product memory / documentation
   - 更新 H2E wallet anti-abuse 规则记忆：从单一 $400,000 解锁改成阶梯解锁。
   - 保证后续改动都沿用这个规则。

Technical details:

- Files likely to update:
  - `src/hooks/useH2eRewardsSummary.ts`
  - `src/pages/Wallet.tsx`
  - `src/components/withdraw/WalletWithdraw.tsx`
  - `src/components/withdraw/WithdrawForm.tsx`
  - `mem://features/h2e/wallet-and-anti-abuse`
- No database changes needed for this UI/demo logic update.
- No backend changes needed unless later要把真实主网交易量写入后端统计。