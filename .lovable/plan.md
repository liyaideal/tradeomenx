## 上主网 Rewards Center 改造方案

主网上线后：
1. 积分**暂时**不能再兑换 Trial Funds（保留积分系统本身和任务，但关掉兑换出口）
2. 满 100 积分的随机宝箱空投取消
3. 首页 Reward Center 弹窗改为**每个用户只弹一次**，关闭后变成右下角常驻入口

---

### 一、首页弹窗逻辑改造（核心）

**当前行为：** 登录后只要没领取宝箱，每次会话都会弹一次（关闭后本会话不再弹，但下次访问/刷新还是会弹）。宝箱领取后由右下角浮窗 `FloatingRewardsButton` 接管。

**新行为：** 每个用户**永久只弹一次**，关闭后立刻显示右下角浮窗常驻入口；用户已经登录过且看过的，下次进来不会再弹，直接显示右下角浮窗。

#### 改动点

**1. `src/components/rewards/RewardsWelcomeModal.tsx`**
- 解除对 `useTreasureDrop` 的依赖（宝箱机制要废弃）。
- 改用 `localStorage` 按用户 ID 持久化"已看过"标记，key 例如 `omenx_rewards_welcome_seen_<userId>`。
- 显示条件改为：`!!user && !isAuthFlowOpen && !hasSeen && !dismissed`。
- 关闭（X / 遮罩 / Esc / "Maybe later" / 点 CTA 跳转）时一律写入 localStorage 标记，保证之后再也不弹。
- 文案调整（去掉"Trial Funds"承诺，因为主网会先关闭兑换）：
  - 标题 `Claim Free Trial Funds` → `Welcome to Rewards Center`
  - 副标题 `Do tasks, earn points, trade for free!` → `Complete tasks, earn points, unlock perks.`
  - Step 3 的 `Get Trial Funds` / `Convert points to capital` → `Unlock Perks` / `Redeem soon — stay tuned`（或 `Redemption opening soon`）
  - 主 CTA `Go to Rewards Center` 保持不变
- 删除 JSDoc 里关于"宝箱领取后由 FloatingRewardsButton 接管"的描述，改为"每个用户登录后首次进入首页时弹一次，关闭后由右下角入口接管"。

**2. `src/components/rewards/FloatingRewardsButton.tsx`**
- 解除对 `useTreasureDrop` 的依赖。
- 显示条件改为：用户已登录且 **`hasSeen === true`**（即弹窗已被关闭/确认过）。
- 未登录用户不显示。
- Tooltip 内容保持"Points Balance"，与积分系统其余部分一致。

**3. 新增小工具 `useRewardsWelcomeSeen` Hook（建议放在 `src/hooks/`）**
- 封装 localStorage 读写：`hasSeen: boolean`、`markSeen(): void`。
- 同一份逻辑供 `RewardsWelcomeModal` 和 `FloatingRewardsButton` 共用，确保两者状态完全联动（关闭弹窗 → 浮窗立刻出现）。
- 通过 `window.addEventListener('storage', ...)` 或自定义事件让两个组件实时同步（同一标签页内 setState 即可，跨标签页用 storage 事件）。

---

### 二、宝箱（Treasure Drop）逻辑下线

**当前：** 用户 lifetime points ≥ 100 时随机延迟 1–5s 弹出企鹅礼盒，点击调用 `claim-treasure` edge function 发放随机积分。

**改动：**

**1. `src/components/rewards/TreasureDropButton.tsx`**
- 直接渲染 `null`（或彻底从挂载点移除）。保留文件以便日后开放，但内部短路返回。
- 推荐做法：在 `Rewards.tsx`（mobile + desktop）和任何其他挂载点删除 `<TreasureDropButton />`，只保留组件文件作为"封存"。

**2. `src/hooks/useTreasureDrop.ts`**
- 保留文件，但把 `isEligible` 强制为 `false`、`shouldShowTreasure` 强制为 `false`，跳过 `useQuery` 的网络请求（直接返回 mock 值）。这样既不会再触发触发器，也不会出现 401/数据查询。
- 或者更彻底：把 hook 标记为 deprecated 并清空内部 effect 与 mutation。

**3. Edge Function `supabase/functions/claim-treasure/`**
- 不删除（保留历史）。如果想确保不会被滥用，可以在函数顶部直接返回 `503 Service paused`。**仅当后续完全弃用时才考虑删除。**

**4. 引用清理**
- `src/pages/Rewards.tsx` 第 206、240 行删除两处 `<TreasureDropButton />`。
- `src/pages/MobileHome.tsx` 第 11 行删除 `TreasureDropButton` 导入（如果有挂载也删）。
- `src/components/rewards/index.ts` 保留导出（不破坏其他 import），或同步删除。

---

### 三、Trial Funds 兑换功能下线（暂停）

**当前：** Rewards Center 顶部有 `Get Trial Funds` 按钮，点击打开 `RedeemDialog`，调用 `redeem-points` edge function 把积分换成 `profiles.trial_balance`。

**主网策略：暂停兑换、保留积分余额**，等运营策略明确后再开放。

#### 改动点

**1. `src/pages/Rewards.tsx`（积分卡片头部按钮，第 106–113 行）**
- 把 `Get Trial Funds` 按钮替换为：
  - 文案 `Redemption Coming Soon`
  - `disabled` 永远为 `true`
  - 旁边可以加一个 `InfoTooltip`：`Points redemption is paused for mainnet launch. Stay tuned.`
- 保留积分余额、Lifetime Earned、Frozen Points 显示，让用户依然看到自己累计的积分。
- 第 131 行 `Min. {minRedeemThreshold} pts to redeem` → 改为 `Redemption reopening soon`，或暂时隐藏。

**2. `src/components/rewards/RedeemDialog.tsx`**
- 不再被打开（按钮永久 disabled），可保留组件文件。
- 也可以在内部加一个 fallback：如果意外被触发，显示 "Redemption is currently paused for mainnet launch."。

**3. `supabase/functions/redeem-points/index.ts`**
- 在请求处理顶部直接返回 `403`：
  ```ts
  return new Response(
    JSON.stringify({ error: "Points redemption is paused during mainnet launch." }),
    { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
  ```
- 服务端硬关闭，防止任何前端绕过。

**4. `RewardsWelcomeModal` 文案**（已在第一节列出）去掉"trial funds"承诺。

**5. 不动的部分**
- `profiles.trial_balance` 字段、`OrderPreview` / `Wallet` 中的 Trial Bonus 展示与抵扣逻辑**保持不变**（已经发出去的体验金还能继续在交易里用）。
- 任务系统（`useTasks`、TaskCard、`claim-task` edge function）保持不变，用户依然可以做任务赚积分，只是暂时换不了 Trial Funds。
- Referral 系统不变。

---

### 四、文案统一调整清单

| 位置 | 旧文案 | 新文案 |
|---|---|---|
| `RewardsWelcomeModal` 标题 | Claim Free Trial Funds | Welcome to Rewards Center |
| `RewardsWelcomeModal` 副标题 | Do tasks, earn points, trade for free! | Complete tasks, earn points, unlock perks. |
| `RewardsWelcomeModal` Step 3 label | Get Trial Funds | Unlock Perks |
| `RewardsWelcomeModal` Step 3 desc | Convert points to capital | Redemption opening soon |
| `Rewards.tsx` 顶部 CTA | Get Trial Funds | Redemption Coming Soon（disabled） |
| `Rewards.tsx` 桌面副标题 | Complete tasks, earn points, redeem rewards | Complete tasks, earn points — redemption opening soon |
| `Rewards.tsx` 积分卡底部 | Min. N pts to redeem | Redemption reopening soon |

> Step 3 图标 `💰` 和 Step 1 `🎯`、Step 2 `⭐` 是 emoji，根据 [content-icon-rules](mem://design/content-icon-rules) 规范应避免 emoji。本次改造是收口流程，**不在本次范围内统一替换**，但可以在 plan 备注中标注一笔后续清理。

---

### 五、需要触动的文件总览

**修改：**
- `src/components/rewards/RewardsWelcomeModal.tsx`（弹窗逻辑 + 文案）
- `src/components/rewards/FloatingRewardsButton.tsx`（显示条件解耦宝箱）
- `src/pages/Rewards.tsx`（按钮 disable + 文案 + 删除 TreasureDropButton 挂载）
- `src/pages/MobileHome.tsx`（如有 TreasureDropButton 挂载则删除）
- `src/hooks/useTreasureDrop.ts`（短路：永远不触发）
- `src/components/rewards/RedeemDialog.tsx`（可加暂停提示，可选）
- `supabase/functions/redeem-points/index.ts`（顶部直接 403）
- `supabase/functions/claim-treasure/index.ts`（顶部直接 503，可选）

**新增：**
- `src/hooks/useRewardsWelcomeSeen.ts`（封装"是否已看过弹窗"的 localStorage 持久化）

**不动：**
- `usePoints` hook、积分余额/历史/任务系统
- `profiles.trial_balance` 字段及交易扣减链路
- `TreasureClaimDialog` 组件文件（封存）
- 数据库表结构

---

### 六、上线后行为预期

- **新用户首次登录** → 进入首页弹一次欢迎弹窗（无 trial funds 承诺） → 无论点 CTA 还是关闭，都写入 localStorage seen 标记 → 立即出现右下角浮窗。
- **老用户（已经看过弹窗或已经领过宝箱）** → 不再弹，直接显示右下角浮窗。
- **未登录用户** → 既不弹弹窗，也不显示浮窗（同今）。
- **Rewards Center 内部** → 用户依然可以做任务、看积分余额、用 Referral，但兑换按钮显示 "Redemption Coming Soon" 且不可点。
- **宝箱不再触发**，企鹅礼盒永远不会出现，相关 edge function 服务端也已封禁。
