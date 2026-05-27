## 目标

把 mainnet 上线前对 Beta points / rewards 的全面暂停解除，只保留 **积分兑换试用金（redeem-points）** 仍然禁用。其他 rewards 入口、任务领取、宝箱掉落、欢迎弹窗等全部恢复。

## 前端改动

1. **`src/pages/Rewards.tsx`** — 移除顶部 "Mainnet launching soon" 非关闭 Dialog 及其 import，让 /rewards 页面正常使用。Rewards 页面里如果有 "积分兑换试用金" 模块，保留它的 UI 但点击时仍会被后端 403 拦截（保持现状）。

2. **`src/components/rewards/FloatingRewardsButton.tsx`** — 恢复为点击跳转 `/rewards`，重新显示 claimable count badge（从 ddbb1ef9 之前的实现还原）。

3. **`src/components/rewards/RewardsWelcomeModal.tsx`** — 删除顶部的 `return null` 短路，恢复正常的首次访客欢迎弹窗逻辑。

4. **`src/components/BottomNav.tsx`** — 把两处 `showRewardsPausedToast()` 改回 `navigate('/rewards')` / `navigate('/referral')`。

5. **`src/components/EventsDesktopHeader.tsx`** — 同上，两个 DropdownMenuItem 改回正常导航。

6. **`src/hooks/useTreasureDrop.ts`** — 从 695312a9 之前的版本还原完整实现（资格检查、claim-treasure 调用、浮动宝箱触发等）。

7. **`src/lib/rewardsPause.ts`** — 删除该文件（不再被任何地方引用）。

## 后端改动

8. **`supabase/functions/claim-task/index.ts`** — 移除函数 try block 顶部的 503 短路，恢复任务领取。

9. **`supabase/functions/claim-treasure/index.ts`** — 从 88c958fa 之前的版本完整还原（含资格校验、随机点数、写入 ledger 等），让宝箱掉落能真正发放积分。

10. **`supabase/functions/redeem-points/index.ts`** — **保持不变**，继续返回 403。这是用户明确要求保留禁用的入口。

## 文档/记忆

11. **`.lovable/memory/features/rewards/mainnet-launch-pause.md`** — 改写为只描述"积分兑换暂停"这一条规则；删除关于 toast、welcome modal、claim-task / claim-treasure、FloatingRewardsButton badge 隐藏等已经解除的条目。

12. **`.lovable/memory/index.md`** — 更新对应行的 description，反映新的范围（仅 redeem-points 暂停）。

## 验证

- /rewards 页面可以正常打开，无遮罩 Dialog。
- 移动端浮动 bonus 按钮点击进入 /rewards，claimable badge 重新可见。
- BottomNav / 桌面 header 下拉的 Rewards / Referral 入口可以正常跳转。
- 任务页可以完成任务并领取积分。
- 宝箱掉落动画与 claim 流程正常返回积分。
- 在 Rewards 的"积分兑换"按钮上点击，仍然弹出 403 错误（保留的限制）。

## 不在范围内

- 不修改 `MainnetLaunch` 活动页或其奖励组件。
- 不删除 `points_accounts` / `points_ledger` / `user_tasks` 等数据表。
- 不解禁 redeem-points 的 403。
