
# Mainnet 用户激活体系 (Activation System v1)

## 1. 设计目标

把"我们上 mainnet 了"从一个**告知动作**升级成一个**转化漏斗**。

**北极星指标**：登录用户中完成首次 Deposit 的比例。

**漏斗**：
```text
注册/登录 → 看到激活引导 → 进入 Deposit → 完成 Deposit → 完成首笔真实交易 → 进入 Mainnet Campaign 主漏斗
   (已有)     (本次新增)      (已有)         (已有)          (已有，新增奖励)      (已有)
```

激活体系一次性解决三件事：告知 mainnet、引导 deposit、奖励 first trade。Logo 上的 MAINNET 标只是品牌信号，不承担转化任务。

---

## 2. 用户分层与状态机

每个登录用户在 4 个状态之一，UI 根据状态展示不同引导：

| 状态 | 判定条件 | 期望下一步 |
|---|---|---|
| `S0_NEW` | 登录但 `transactions` 中无 `deposit/completed` | Deposit |
| `S1_DEPOSITED` | 有 completed deposit，但 mainnet 期间无 `trades.status='Filled'` | First Trade |
| `S2_TRADED` | 有 mainnet 期间 filled trade，但 volume < $5k | 冲击 Campaign Tier 1 |
| `S3_ACTIVE` | volume ≥ $5k（已是 Campaign 合格用户） | 隐藏所有激活引导 |

新增 hook `useActivationState()`：复用 `useUserProfile`、`useRealtimeTransactions`、`useMainnetLaunchProgress`，输出 `{ state, hasDeposited, hasTraded, volume, nextStepHref, nextStepLabel }`。

---

## 3. 三个承载层（互不冲突）

### 3.1 Onboarding Checklist（持久骨架）

新组件 `ActivationChecklist`，3 步：

```text
☐ 1. Verify your account       (注册即勾，开场就有"已完成 1/3"的成就感)
☐ 2. Deposit USDC on Base      → /deposit
☐ 3. Place your first trade    → /events
```

- 完成的步骤显示绿色 ✓ + `text-success`，未完成显示步骤号 + 高亮 CTA。
- 每步有副标题说明价值（"Real on-chain custody"、"Unlock $5/$10/$20… rebates"）。
- 完成 3/3 后整块在 24h 内淡出，之后不再出现（`localStorage('activation_checklist_dismissed_v1')` + 状态判断）。
- **位置**：
  - Mobile: `MobileHome.tsx` 顶部、Banner 之下、市场列表之上。
  - Desktop: `Wallet.tsx` 右栏 / `EventsPage.tsx` 左侧首屏（仅 S0/S1）。
- **不弹窗**：用户在场景内自己看到，零打扰。

### 3.2 Wallet Activation Hub（转化主战场）

改造 `Wallet.tsx` 和 `pages/Deposit.tsx` 顶部，针对 S0 用户：

- 当 `state === 'S0_NEW'`：Wallet 页顶部把现有 Equity 卡降级到第二屏，首屏显示一张大的 `ActivationHero` 卡片：
  - Headline：`Start trading on mainnet in 3 steps`
  - 1) Deposit USDC on Base · 2) Place first trade · 3) Earn launch rebates
  - 主 CTA：`Deposit now` → `/deposit`
  - 副 CTA：`Why mainnet?` → `/mainnet-launch`
  - 视觉：`border-success/40`、`bg-gradient-to-br from-success/8 to-transparent`、Lucide `ArrowDownToLine` icon。
- S1 用户：Hero 切成 `Make your first real trade` + `Browse markets` CTA。
- S2/S3 用户：Hero 完全隐藏，恢复正常 Wallet UI。
- Deposit 页面顶部加一条 thin success bar："This is your first deposit — campaign rebates unlock at $5,000 volume" + 倒计时（仅 S0）。

### 3.3 First Trade 奖励（钩子）

复用现有 `useMainnetLaunchProgress`，在 `pages/MainnetLaunch.tsx` 已有的 tier 卡前面加一张"Step 0"卡：

- `Make your first real-USDC trade → unlock launch campaign tracking`
- 完成后该卡变绿勾 + 显示 "Tracking active · $X / $5,000 to Tier 1"。
- **不发额外现金奖励**（运营预算未确认），价值 = 解锁 campaign 资格 + 首单 trade 后 toast 庆祝 + 解锁分享卡。
- 首笔 filled trade 触发一次 `<Toast>`：`First mainnet trade complete · You're in the launch campaign` + 跳到 MainnetLaunch 的链接。toast 通过 `localStorage('first_trade_toast_seen_v1')` 防重。

---

## 4. Logo MAINNET 品牌标（独立于激活）

- `Logo.tsx` 新增 prop `showMainnetBadge`（默认 `true`），显示一个紧凑徽章：
  - `font-mono` uppercase `text-[9px]`（desktop `text-[10px]`），`text-success` + `border-success/40` + `bg-success/10`，`rounded-sm`，左侧绿色 `animate-pulse` 圆点。
- 应用到 `MobileHeader.tsx`、`EventsDesktopHeader.tsx`、`MainnetLaunch` Hero。
- 永久信号，campaign 结束后徽章保留。

---

## 5. 弹窗优先级（避免堆叠）

新建轻量 store `useHomeModalQueueStore`：同一时刻只允许一个高优先级弹窗。

| 优先级 | 来源 | 触发条件 |
|---|---|---|
| 1 | H2E Welcome Gift | 已有逻辑 |
| 2 | Airdrop Homepage Modal | 已有逻辑 |
| — | ~~Mainnet Welcome Modal~~ | **不做**（被 Checklist + Hub 取代） |
| — | RewardsWelcomeModal | 保持禁用 |

激活引导**完全不弹窗**——避开和 H2E 弹窗的冲突。

---

## 6. 不做的事（明确边界）

- ❌ 不做全局顶部 Mainnet 状态条（和首页 banner 重复）。
- ❌ 不做 Mainnet Welcome Modal（前一轮已确认对用户无价值）。
- ❌ 不发任何"首充返现"现金奖励（需运营预算审批，本期不动）。
- ❌ 不改后端 `transactions` / `trades` schema，全部基于现有数据派生。

---

## 7. 文件变更清单

**新增**
- `src/hooks/useActivationState.ts` — 状态机
- `src/components/activation/ActivationChecklist.tsx`
- `src/components/activation/ActivationHero.tsx`
- `src/components/activation/FirstTradeToast.tsx`（订阅 trades 实时变更）
- `src/components/MainnetBadge.tsx`
- `src/stores/useHomeModalQueueStore.ts`

**修改**
- `src/components/Logo.tsx` — 加 `showMainnetBadge`
- `src/components/MobileHeader.tsx` / `EventsDesktopHeader.tsx` — 启用 badge
- `src/pages/MobileHome.tsx` — 顶部插入 `ActivationChecklist`（S0/S1）
- `src/pages/Wallet.tsx` — S0/S1 顶部插入 `ActivationHero`
- `src/pages/Deposit.tsx` — 首充提示条
- `src/pages/MainnetLaunch.tsx` — 加 Step 0 卡
- `src/components/AirdropHomepageModal.tsx` / H2E Welcome Gift — 接入 queue store
- `mem://index.md` + 新 memory `mem://features/activation-system`

---

## 8. 实施顺序（建议分两批 PR）

**PR1（本次）**：状态机 + Checklist + Wallet Hero + Logo Badge + Deposit 提示条。完成"看到 → 引导 → 进入 deposit"闭环。

**PR2（下次）**：First Trade Toast + MainnetLaunch Step 0 + 弹窗 queue。完成"deposit → first trade → campaign"闭环。

确认后我从 PR1 开始实施。
