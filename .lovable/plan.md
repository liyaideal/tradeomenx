## 移动端 Home 页重构方案

### 一、当前混乱点诊断

读完 `src/pages/MobileHome.tsx`（515 行），问题不是单个组件丑，而是**模块编排没有状态机**，每加一个功能就在 `<main>` 里新塞一段 JSX：

```text
当前渲染顺序（登录用户）：
1. UserStatsCard              ← 余额 + 7D PnL + Redeem Points
2. CampaignBannerCarousel     ← 营销轮播
3. ActivationChecklist        ← "Start trading in 3 steps" (S0/S1 才显示)
4. My Positions               ← 有持仓才显示
5. Hot Markets
6. Settlement Soon
7. Quick Actions              ← Learning / Invite (两个按钮，孤儿)
8. Pending Airdrop Banner     ← ⚠️ 写在 <BottomNav/> 之后，事实上脱离主流，且位置最末
```

用户指出的核心矛盾是对的：**`UserStatsCard` 和 `ActivationChecklist` 在逻辑上互斥但视觉上并列**。
- S0（未充值）：显示余额 = $0 + 显示 3 步引导 → **重复且自相矛盾**（"你的余额"和"开始交易"讲的是同一件事的两面）
- S1（已充值未交易）：余额有数 + 还在催首笔交易 → 余额卡和引导卡争夺注意力
- S2/S3（已交易）：引导消失，但 `Quick Actions` / `Pending Airdrop` 等贴膏药模块仍散落

另外 `Pending Airdrop Banner` 写在 `<BottomNav/>` **之后**是个明显 bug 级布局错误，它当前在底部导航下面，几乎看不到。

---

### 二、重构后的信息架构

把首页分成 **4 个语义层**，每层职责单一、按用户状态切换内容，而不是叠加：

```text
┌─────────────────────────────────────────────┐
│ Header  (Logo + Mainnet badge + 工具按钮)    │  不变
├─────────────────────────────────────────────┤
│ ① Account Hub  —— 账户主卡（状态机）          │
│   GUEST       → GuestWelcomeCard             │
│   S0_NEW      → ActivationCard (合并 3 步)   │
│   S1_DEPOSITED→ ActivationCard (含余额条)    │
│   S2 / S3     → UserStatsCard (含余额+PnL)   │
├─────────────────────────────────────────────┤
│ ② Action Alerts  —— 待处理事项（仅在有时显示） │
│   - Pending Airdrops 横幅（移到这里）         │
│   - 其他将来的提醒（订单成交、结算等）          │
├─────────────────────────────────────────────┤
│ ③ Discover  —— 行情/活动                     │
│   - CampaignBannerCarousel                  │
│   - My Positions（有则显示）                  │
│   - Hot Markets                              │
│   - Settlement Soon                          │
├─────────────────────────────────────────────┤
│ ④ More  —— 次级入口                          │
│   - Quick Actions (Learning / Invite)       │
│   - 以后新功能进 More 区，不再贴到顶部         │
└─────────────────────────────────────────────┘
```

关键点：**Account Hub 永远只渲染一张卡**，按 `useActivationState()` 的 5 个状态分支选择内容。从此以后，新增"用户身份相关"的提示一律进 Account Hub 内部，不再外挂。

---

### 三、具体实现方案

#### 1. 新建 `src/components/home/HomeAccountHub.tsx`
单一入口组件，内部按状态切分支：

| 状态 | 渲染内容 |
|------|---------|
| `GUEST` | 现有 `GuestWelcomeCard`（保留不变） |
| `S0_NEW` | `<ActivationCard variant="onboarding">` —— 大标题 "Start trading in 3 steps" + 3 步进度 + 主 CTA "Deposit USDC"，**不显示 $0 余额**（避免误导） |
| `S1_DEPOSITED` | `<ActivationCard variant="funded">` —— 顶部一行小余额 "Available $X.XX"，下方仍显示剩余 2 步进度，主 CTA "Place first trade" |
| `S2_TRADED` / `S3_ACTIVE` | 现有 `UserStatsCard`（保留），**移除底部 "Redeem Points" 按钮**（已是 toast 假按钮，按 mainnet pause memory 该入口已暂停） |

`ActivationCard` 由现有 `ActivationChecklist` 改造而来，复用 `useActivationState()`，不新建状态来源。

#### 2. 新建 `src/components/home/HomeActionAlerts.tsx`
聚合所有"待用户处理"的横幅。当前只有 1 个：
- 把 `Pending Airdrop Banner`（当前行 477–504，错误地写在 `<BottomNav/>` 之后）**剪切**到这里。
- 没有任何 alert 时整个 section 不渲染（return null）。

#### 3. 新建 `src/components/home/HomeDiscover.tsx`
把 `CampaignBannerCarousel` + `My Positions` + `Hot Markets` + `Settlement Soon` 4 个 section 搬进来，仅做组合，不动各 section 内部样式。

#### 4. 新建 `src/components/home/HomeMore.tsx`
把 `Quick Actions`（Learning Center / Invite Friends）搬进来，加一个小 section 标题 "More"，明确这是次级入口区。后续新增二级功能（如 Leaderboard 入口、Help 等）都进这里。

#### 5. 改写 `src/pages/MobileHome.tsx`
变成纯编排页：
```tsx
<MobileHeader ... />
<main className="px-4 py-4 space-y-6">
  <HomeAccountHub onLogin={() => setAuthOpen(true)} />
  <HomeActionAlerts />
  <HomeDiscover />
  <HomeMore />
</main>
<BottomNav />
<RewardsWelcomeModal />
<AuthSheet ... />
<AirdropHomepageModal />
```
所有数据 hooks（`usePositions` / `useUserProfile` / `useActiveEvents` / `useAirdropPositions`）下沉到各自的子组件，`MobileHome` 不再持有业务状态。

#### 6. 删除 / 清理
- `ActivationChecklist` 在 `MobileHome` 的独立渲染移除（其能力被 `HomeAccountHub` 吸收）。组件本身保留备用，或在确认其他页面没有引用后删除。
- `Pending Airdrop Banner` 从 `<BottomNav/>` 之后的错误位置移除。
- `UserStatsCard` 内的 "Redeem Points" 假按钮移除。

---

### 四、不在本次改动范围内

- 不改 `MobileHeader`、`BottomNav`、`CampaignBannerCarousel`、`Hot Markets / Settlement Soon` 卡片本身的视觉
- 不改任何业务逻辑、API、数据结构
- 不改桌面端 `Index.tsx` / `EventsPage.tsx`
- 不动 `useActivationState` 的状态机定义

---

### 五、验收

- 未登录：只看到 Account Hub（GuestWelcomeCard）+ Discover + More
- 登录但 S0：Account Hub 显示 3 步引导卡（**无 $0 余额冲突**），Discover 正常
- S1（已充值未交易）：Account Hub 一张卡里同时显示余额条 + 剩余 2 步
- S2/S3：Account Hub 显示余额 + PnL，无引导
- 有待领空投：Action Alerts 区出现横幅（**位置在 Account Hub 下方而非屏幕外**）
- 后续新增提醒类模块 → 进 Action Alerts；新增次级入口 → 进 More
