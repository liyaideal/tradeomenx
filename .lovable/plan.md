## 背景
guest 在 mobile home 的 Top Events 卡片之间会插入一张 `<TrialCallout/>`（"$10 to try, no deposit needed"），对应"$10 试用金"活动还没准备上线。改为在该插槽推 Mainnet Launch 活动，复用同一个引流位。

注意：Mainnet Launch 已经在 Top Events 上方的 `HomeCampaignRail` 用大 banner 展示一次。为避免重复感，interlude 用**一张视觉更克制的小卡**（图标 + 双行文案 + 右侧 CTA），与上方大 banner 区分开。

## 改动

### 1. 新建 `src/components/home/MainnetLaunchCallout.tsx`
结构与 `TrialCallout` 一致（便于无缝替换插槽），不同点：
- icon: `Trophy`（lucide）替换 `Gift`
- 配色用 `mainnet-gold`（项目已有 token，见 `CampaignBannerCarousel.tsx`）替换 `primary`
- 主文案：`Trade once. Earn up to $200.`
- 副文案：`$5K weekly pool · Mainnet Launch is live.`
- 右侧 CTA: `Join` + `ArrowRight`
- 点击行为：`onClick` 跳转 `/mainnet-launch`（用 `react-router-dom` `useNavigate`，不接 `onSignIn`）
- 保持 `rounded-2xl border bg-card px-4 py-3.5`、`radial-gradient` 角落高光（色相换成 `mainnet-gold`）

### 2. `src/pages/MobileHome.tsx`
- 移除 `import { TrialCallout } ...`
- 新增 `import { MainnetLaunchCallout } from "@/components/home/MainnetLaunchCallout";`
- `HomeTopEvents` 的 `interlude` 改为：`!isAuthed ? <MainnetLaunchCallout /> : undefined`
- `setAuthOpen` 仍保留给 `HomeGreeting`/`AuthSheet` 使用

### 3. `src/pages/StyleGuide/sections/MobileHomeSection.tsx`（style guide 预览同步）
- 替换 `TrialCalloutReplica` 的内容渲染为 Mainnet Launch 小卡的同款样式（图标 + 文案 + CTA），或直接 import 真实的 `MainnetLaunchCallout`
- `composedMatrix.guest.note` 改为："未登录：PersonalSlot 收起，TopEvents 中插入 Mainnet Launch 小卡（引流到 /mainnet-launch）"
- 矩阵表格 `<TrialCallout/>` 字样改为 `<MainnetLaunchCallout/>`
- "Title & interlude rules" 表格里 Guest 行同步改

### 4. 保留 `src/components/home/TrialCallout.tsx`
不删除，等"$10 试用金"活动正式上线时可直接切回。在文件顶部加注释说明当前未被引用。

## 不在范围
- `HomeCampaignRail` 不动（已展示 Mainnet Launch 大 banner）
- 桌面 home 不动（本次只调 mobile）
- 不改任何业务/状态逻辑
