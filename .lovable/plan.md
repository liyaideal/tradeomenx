
## 简化版方案：最小改动停掉积分入口

### 核心思路
- **不改 `/rewards` 页面内容**，只在页面上盖一个**关不掉的公告弹窗**（无 X、Esc 不关、点遮罩不关）
- **所有进入 `/rewards` 的入口**：保留按钮可见，去掉跳转，统一改成 toast 公告
- **后端兜底**：`claim-task` 加 503 守卫，防止绕过 UI

### 统一公告文案（常量复用）
> **主网即将上线**
> Beta 积分将不再继续累积。现有 Beta 积分将按一定比例转换为主网积分，敬请期待。

### 入口梳理（共 5 处需要拦截 → toast）

| # | 位置 | 文件 | 当前行为 | 改为 |
|---|---|---|---|---|
| 1 | 移动首页右下金币动效 | `FloatingRewardsButton.tsx` | 跳 `/rewards` | toast 公告，隐藏 claimable 数字 badge |
| 2 | 桌面 Header 头像下拉 → Rewards | `EventsDesktopHeader.tsx:190` | 跳 `/rewards` | toast 公告 |
| 3 | 桌面 Header 头像下拉 → Referral | `EventsDesktopHeader.tsx:194` | 跳 `/rewards?tab=referral` | toast 公告 |
| 4 | 移动端"我的"抽屉 → Rewards | `BottomNav.tsx:215-222` | 跳 `/rewards` | toast 公告 |
| 5 | 移动端"我的"抽屉 → Referral | `BottomNav.tsx:223-230` | 跳 `/rewards?tab=referral` | toast 公告 |

外加：
- **`RewardsWelcomeModal`**（新登录用户首页一次性弹窗）：直接 `return null` 停用，不再主动引导新用户进积分中心
- **`/rewards` 页面顶部**：渲染一个**不可关闭的 Dialog**，用户仍可看到自己历史积分（只读），但无法操作

### 不可关闭弹窗的实现
- 用 shadcn `<Dialog open={true}>`，不传 `onOpenChange`，不渲染 close 按钮
- `onEscapeKeyDown` / `onPointerDownOutside` 都 `e.preventDefault()`
- 内容只有公告文案 + 「我知道了（仅关闭按钮 disabled，文案改为"页面已暂停"）」或者干脆没有按钮，纯静态

### 后端兜底（推荐保留）
`supabase/functions/claim-task/index.ts` 顶部加：
```ts
return new Response(JSON.stringify({ error: "Beta points are paused for mainnet launch" }), { status: 503, headers: ... })
```
跟 `claim-treasure` / `redeem-points` 已有处理保持一致。**强烈建议保留**：否则任何老用户已完成的任务还能在前端绕过，或脚本直调接口领。

### 改动文件清单（共 7 个）
1. **新增** `src/lib/rewardsPause.ts` — 公告文案常量 + `showRewardsPausedToast()` 工具函数
2. `src/components/rewards/FloatingRewardsButton.tsx` — 改 onClick + 隐藏 badge
3. `src/components/EventsDesktopHeader.tsx` — 2 个菜单项改 onClick
4. `src/components/BottomNav.tsx` — 2 个菜单项改 onClick
5. `src/components/rewards/RewardsWelcomeModal.tsx` — 顶部 `return null`
6. `src/pages/Rewards.tsx` — 加一个不可关闭的公告 Dialog 覆盖（页面其余内容不动）
7. `supabase/functions/claim-task/index.ts` — 顶部 503 守卫
8. 更新 `mem://features/rewards/mainnet-launch-pause` 记忆

### 不动
- `/rewards` 页面 UI / Tasks / Referral / History 列表代码
- 数据表 / Edge function 逻辑（除 503 守卫）
- `MainnetLaunch` 活动页里的 RewardSnapshot/RewardLadder（与 Beta 积分无关）
- Referral 邀请关系绑定逻辑（只是不再发积分）

确认后开始实施。
