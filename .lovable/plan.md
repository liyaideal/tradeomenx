
# Mainnet 用户激活体系

## 1. 思路转变

不再做"挂个 MAINNET 标"，而是把"用户从注册到产生真实价值"建模成一条 **激活漏斗**，平台在每一步都"轻推"用户走到下一步。Mainnet 标只是这条体系的副产品（在某些步骤上自然出现）。

无效用户的定义：注册 → 没充值 → 没下单 → 流失。我们要做的是把每一层的转化率拉起来。

## 2. 用户激活状态机（Activation Stages）

每个登录用户在任意时刻处于以下 5 个状态之一，由 `useActivationStage()` hook 推导（纯前端，基于已有的 profile/positions/trades/airdrop 数据）：

```text
S0 Visitor         未登录
S1 Registered      登录了，balance=0，没有 H2E welcome gift，没成交
S2 Funded          已 deposit ≥ $1 OR 已激活 H2E welcome gift（有真钱在账上）
S3 Activated       已完成第 1 笔真实成交（real trade，非 demo）
S4 Engaged         成交量 ≥ FIRST_TRADE_VOLUME ($5k) 或 7 天内有 ≥3 次交易
```

数据来源全部已存在：`useUserProfile`（balance/trial_balance）、`useAirdropPositions`、`useMainnetLaunchProgress`（volume/tradeCount）、`useSupabasePositions`。

## 3. 各阶段的"下一步推力"（Next-Best-Action）

| 阶段 | 用户当前痛点 | 平台轻推 | 用户拿到什么 |
|---|---|---|---|
| S1 Registered | 不知道为什么要充钱 | "Deposit $10 → 解锁 mainnet 真实交易 + 拿 launch campaign 排名" | 明确的下一步 + 收益预期 |
| S2 Funded | 不敢下第一单 | "Place your first trade（含 1 张推荐 market 卡 + 一键 $1 试单）" | 摩擦最小化 |
| S3 Activated | 不知道为啥要继续 | "再交易 $X 解锁 $5 rebate（tier 1）" | 下一个里程碑 |
| S4 Engaged | 已激活 | 不打扰 → 只显示 launch campaign 排名 | 留存归留存系统管 |

## 4. 落地组件（4 件 + 1 个 store）

### A. `useActivationStage()` hook
返回 `{ stage, hasDeposited, hasTraded, volume, nextAction }`。所有 UI 组件订阅这一个 hook，避免逻辑散落。

### B. `ActivationCard.tsx` —— 用户的"主入口卡"（核心）
放在两个地方：
- 移动端 `MobileHome` 顶部（CampaignBannerCarousel **下方**，不替代它）
- 桌面 `EventsPage` 右侧栏顶部 / Wallet 页顶部

卡片随 stage 切换内容（**不是弹窗**，是常驻信息），举例 S1：
```
You're on Mainnet — but your account is empty
Deposit any USDC on Base to start trading real markets.
Min $1. Funds arrive in ~30s.
[ Deposit ]   [ Skip → use $10 welcome gift ]
```
S3 完成后整个卡片消失，给老用户零打扰。

### C. `ActivationProgressDots` —— 4 步进度条
极简，3px 圆点 × 4，放在 `Logo` 旁或 Header 右侧。鼠标 hover 展开"Deposit ✓ · First trade ◌ · Reach $5k ◌"。让用户始终知道自己在哪一格。

### D. 触发式 toast（不是弹窗）
- S1 → S2 完成 deposit 到账 → toast: "Funded. Place your first trade →"（CTA 跳到 hot market）
- S2 → S3 完成第一单 → 复用现有 confetti / share poster
- S3 → 跨过 tier → 复用现有 mainnet launch tier 提示

### E. `useHomeModalQueueStore` （仍然需要，但用法变了）
**没有"Mainnet Welcome Modal"**。队列只协调已有的 H2E gift / Airdrop modal。Welcome 信息全部用上面的常驻 ActivationCard 承载。

## 5. Mainnet 标识在这套体系里的位置

不再是独立目标，而是 **激活语境的一部分**：
- Logo 旁加一颗 2px `bg-success` pulse 点（无文字，极简） — 全站常驻"我们在 mainnet"信号
- ActivationCard 的副标题里出现 "You're on Mainnet"
- Deposit 弹窗顶部一行 reassurance："Real USDC on Base · On-chain custody"
不再做顶部公告条、不做欢迎弹窗、不动 favicon/title。

## 6. 衡量（埋点先留口子，不实现后端）

`trackActivation('stage_change', { from, to })` 函数 stub 在 `src/lib/activation.ts`，console.debug 打印即可，方便研发后续接入。这样我们能看出漏斗在哪一层漏。

## 7. 文件清单

新建：
- `src/hooks/useActivationStage.ts`
- `src/components/activation/ActivationCard.tsx`
- `src/components/activation/ActivationProgressDots.tsx`
- `src/lib/activation.ts`（stage 推导 + 埋点 stub）
- `src/stores/useHomeModalQueueStore.ts`（仅协调现有弹窗）

修改：
- `src/components/Logo.tsx`（加 pulse 点）
- `src/pages/MobileHome.tsx`（插入 ActivationCard）
- `src/pages/EventsPage.tsx`（桌面侧栏 ActivationCard）
- `src/pages/Wallet.tsx`（顶部 ActivationCard）
- `src/components/deposit/DepositDialog.tsx`（顶部加一行 mainnet reassurance）
- `src/components/AirdropHomepageModal.tsx` / H2E Welcome Gift（接入 modal queue）

不动：CampaignBannerCarousel、MainnetLaunch 页、Beta points toast、RewardsWelcomeModal。

## 8. 实施顺序建议

P0（这一轮做完）：A + B + C + Logo pulse 点
P1：D（toast）+ DepositDialog reassurance
P2：modal queue + 埋点

P0 落地后，新老用户都能看到一张"该干啥"的卡片，这就解决了"无效用户"的核心问题；mainnet 信号自然在卡片和 logo 上传达，不需要任何弹窗骚扰。

请确认这个方向，或告诉我哪一层要砍/加。
