## H2E 解锁阶梯：5 档 → 6 档调整

将 H2E 奖励交易量解锁从 5 档扩展为 6 档（新增 $0 / 0% 起点档），并在 UI 中明确展示「$5 starter unlock」（来自现有 `trialBalance`，与 H2E frozen 独立）。

### 1. 解锁档位调整（`src/hooks/useH2eRewardsSummary.ts`）

`H2E_UNLOCK_TIERS` 由 5 项扩展为 6 项：

```ts
const H2E_UNLOCK_TIERS = [
  { volume: 0,      percent: 0   },
  { volume: 10000,  percent: 10  },
  { volume: 50000,  percent: 25  },
  { volume: 100000, percent: 50  },
  { volume: 200000, percent: 75  },
  { volume: 400000, percent: 100 },
];
```

口径维持不变：
- `unlockedAmount = frozenBalance × unlockedPercent / 100`
- `lockedAmount   = frozenBalance − unlockedAmount`
- 累计解锁，无插值
- $100 单账号上限不变

新增导出字段（供 UI 展示 starter 行）：
- `starterUnlock = 5`（常量）
- 不与 frozenBalance 相加，仅用于展示

### 2. Wallet 卡片 UI（`src/pages/Wallet.tsx`）

桌面端阶梯节点：
- 由 `grid-cols-5` 改为 `grid-cols-6`
- 第 0 档显示 `0%` / `$0`，未达到时也置灰
- 进度条分母仍是 `volumeRequired = $400K`，第 0 档 dot 永远视为「已到达」（`volumeCompleted >= 0`），需要在样式上避免误导（可让 0 档 dot 用 `border-primary/60`，不显示外发光环）

移动端时间线：
- `unlockTiers.map` 自然变 6 行，无需结构改动
- 0% 档行文案：`Starter` 而不是 `0% unlock`，副文案 `$0 volume`，右侧标签固定 `included`

新增「Starter unlock」展示块（位于 Earnings cap 上方或 Withdrawal unlock progress 下方）：
- 标签：`Starter Unlock`
- 数值：`$5.00`（来自 `trialBalance`）
- 说明：`Free starter balance, withdrawable anytime. Independent of H2E rewards.`
- 视觉与现有 Trial Bonus 区块同源（绿色 chip），桌面/移动两套布局都加

底部说明文案：
- 保持 `Current unlocked: X% · Full unlock at $400,000`
- 末档已解锁文案不变

### 3. StyleGuide 同步（`src/pages/StyleGuide/sections/WalletSection.tsx`）

- 同步 `H2E_UNLOCK_TIERS` 为 6 档
- `grid-cols-5` → `grid-cols-6`
- 加入 starter unlock 演示块

### 4. 文案/Memory 更新

更新 `mem://features/h2e/wallet-and-anti-abuse`：
- 阶梯改为 6 档（含 0% 起点档）
- 明确：starter unlock $5 来自 `trialBalance`，与 H2E frozenBalance 完全独立，登录即赠
- 公式不变：可提现 H2E 金额 = frozenBalance × unlockedPercent

### Out of scope

- 不改后端/edge function（所有计算均在前端 hook）
- 不改 trialBalance 来源逻辑（已存在）
- 不动 $100 cap、不改 settlement 流程