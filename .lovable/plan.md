## 任务

移除首页（移动端 + 桌面 events 页）右下角的 Rewards 悬浮入口。主网上线后 Rewards 暂停，悬浮 FAB 价值降低，且占用首页视觉焦点。

## 改动清单

1. **`src/pages/MobileHome.tsx`**
   - 删除 line 475 的 `<FloatingRewardsButton className="bottom-24 right-4" />`
   - 删除 line 10 的 import

2. **`src/pages/EventsPage.tsx`**
   - 删除 line 369 的 `{!isMobile && <FloatingRewardsButton className="bottom-8 right-8" />}`
   - 删除 line 15 的 import

3. **保留** `src/components/rewards/FloatingRewardsButton.tsx` 组件文件本身和 `index.ts` 导出 — 不删源码，未来恢复时直接接回；同时避免影响 StyleGuide 引用（若有）。

### 不动

- Avatar dropdown 里的 Rewards 入口（仍指向 paused toast）
- RewardsWelcomeModal 弹窗逻辑
- 其它 Rewards 页面/路由

### 验证

- 移动端首页 `/` 右下角不再有礼物 FAB
- 桌面 `/events` 右下角不再有 FAB
- 控制台无 unused import 警告
