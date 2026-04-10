

## Plan: PRD v5.0 前端对齐改动

根据用户反馈，精简为以下改动范围：

### 1. 空投仓禁用 TP/SL 和 Close（P0）

**问题**：当前空投仓（`isAirdrop=true`）在 PositionCard 和 DesktopTrading 表格中仍可编辑 TP/SL 和平仓。

**改动**：
- **`PositionCard.tsx`**：当 `isAirdrop` 为 true 时，隐藏 TP/SL 行和底部的 "Edit TP/SL" + "Close" 按钮，替换为一行小字提示（用 tooltip/icon 而非长文本）：锁图标 + "Auto-settles on event resolution"
- **`DesktopTrading.tsx`**：当 `position.isAirdrop` 为 true 时，TP/SL 列显示锁图标（hover 显示 tooltip 说明），Close 列显示灰色 "—" 而非按钮

### 2. 新增 `settled` 状态支持（P1）

**改动**：
- **`useAirdropPositions.ts`**：`AirdropPosition` 接口新增 `settlementTrigger?: 'event_resolved' | 'source_closed'`、`settledPnl?: number`、`settledAt?: string`；新增 `settledAirdrops` 过滤；mock 数据加一条 settled 示例
- **`AirdropPositionCard.tsx`**：新增 `settled` 状态配置（蓝色主题），显示结算 PnL 和触发原因的简洁 badge（如 "Event Resolved" 或 "Source Closed"），不加长文本说明

### 3. Wallet 页面新增冻结余额展示（P1）

**改动**：
- **`Wallet.tsx`**：余额区域从单一 balance 改为三行展示：
  - Available for Trading（= cash_balance）
  - Available for Withdraw（= cash_balance - h2e_frozen）
  - Hedge Airdrop Locked（h2e_frozen_balance，带锁图标和 tooltip）
- 新增 "Hedge Rewards" 卡片：earned/cap 进度（$X / $100）、$10K volume 解锁进度条、简洁的结算历史列表
- **新建 `useH2eRewardsSummary.ts`**：读取 h2e_frozen_balance、volume_completed、h2e_unlocked 等字段（demo 模式用 mock 数据）

### 4. Withdraw 冻结余额检查（P1）

**改动**：
- **`WithdrawForm.tsx`**：`availableBalance` 减去 `h2e_frozen_balance`（未解锁时），超额时显示提示

### 5. 文案优化（P2）

**改动**：
- **`AirdropHomepageModal.tsx`**：倒计时文案从 "Activate within" 改为 "⏰ Expires in {countdown} — tap Activate to claim"；新增 "$100 max earnings per account" 小字提示
- **`AirdropNotificationToast.tsx`**：toast description 改为 `You received a FREE $${value} hedge on "${name}". Activate before it expires!`（去掉 "by making a trade"）；保持简洁
- **`AirdropPositionCard.tsx`**：pending 状态加 "$100 max per account" 小字

### 6. 不改动的部分

- 模拟仓概念不在前端暴露，仓位展示保持原样
- 保留手动 Activate 按钮
- Gate 逻辑（$200/3天/72h）纯后端，前端不处理
- 3 个空投上限纯后端控制

---

### 文件清单

| 文件 | 操作 |
|---|---|
| `src/components/PositionCard.tsx` | 编辑：isAirdrop 时隐藏 TP/SL + Close |
| `src/pages/DesktopTrading.tsx` | 编辑：isAirdrop 行禁用 TP/SL + Close |
| `src/hooks/useAirdropPositions.ts` | 编辑：扩展接口 + settled 过滤 + mock |
| `src/components/AirdropPositionCard.tsx` | 编辑：settled 状态 + $100 cap 提示 |
| `src/components/AirdropHomepageModal.tsx` | 编辑：文案优化 |
| `src/components/AirdropNotificationToast.tsx` | 编辑：文案优化 |
| `src/hooks/useH2eRewardsSummary.ts` | 新建：冻结余额 & 解锁进度 hook |
| `src/pages/Wallet.tsx` | 编辑：三档余额 + Hedge Rewards 卡片 |
| `src/components/withdraw/WithdrawForm.tsx` | 编辑：冻结余额检查 |

