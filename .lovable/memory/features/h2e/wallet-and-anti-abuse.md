---
name: H2E wallet integration
description: Three-tier balance display, withdrawal limits, and H2E reward tier unlock rules
type: feature
---
钱包页面采用三档余额显示：Available for Trading（总余额）、Available for Withdraw（扣除仍锁定的 H2E 奖励）和 Hedge Airdrop Locked（未解锁的空投结算收益）。Hedge Airdrop Rewards 卡片用于追踪 $100 的账户累计收益上限，以及阶梯式交易量提现解锁进度：$10,000 解锁 10%，$50,000 解锁 25%，$100,000 解锁 50%，$200,000 解锁 75%，$400,000 解锁 100%。可提现 H2E 金额 = frozenBalance * unlockedPercent；未解锁部分继续锁定提现，但仍可用于交易。
