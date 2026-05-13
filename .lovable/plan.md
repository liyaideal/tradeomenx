## 目标
把 Status Tray 拆成三层独立曝光，让 Onboarding、Airdrop、Campaign 各自获得专属视觉位置；Campaign 拿到全宽轮播，曝光最强。

## 新版首屏结构

```text
┌──────────────────────────────────────┐
│ HomeKPIHeader                        │ sticky
│  Logo · Mainnet ·       Globe Bell   │
│  Total equity  $12,345.67   +2.4% 7D │
├──────────────────────────────────────┤
│ HomeOnboardingStrip (单行进度条)     │ 仅未完成时显示
│  ✓  Step 2 of 3 · Place first trade →│
│     ▰▰▰ ▰▰▰ ▱▱▱                      │
├──────────────────────────────────────┤
│ HomeAirdropStrip (单行通知)          │ 仅有未领取空投时
│  🎁 1 Airdrop ready · Claim now    → │
├──────────────────────────────────────┤
│ CampaignBannerCarousel (全宽轮播)    │ 始终显示
│  ┌──────────────────────────────┐    │
│  │  Banner 视觉 + CTA           │    │
│  └──────────────────────────────┘    │
│         · ● · ·                       │ 指示点
├──────────────────────────────────────┤
│ HomeAccountHub (Guest Welcome)       │
│ HomeDiscover                         │
│ HomeMore                             │
└──────────────────────────────────────┘
```

## 各层规范

### 1. HomeOnboardingStrip（新组件）
- 单行紧凑条，非卡片：`rounded-xl border border-trading-green/25 bg-trading-green/5 px-3 py-2.5`
- 左：`h-8 w-8` 圆角图标（Check / 数字）
- 中：`ONBOARDING 2/3` eyebrow（font-mono 9px tracking-[0.2em] text-trading-green）+ 标题（font-sans 14px semibold）
- 右：ChevronRight
- 标题下方：3 段进度条（已完成填充 trading-green，当前段 50%，未完成 muted）
- 完成后整条 `return null`

### 2. HomeAirdropStrip（新组件）
- 同样的单行紧凑条样式：`rounded-xl border border-trading-yellow/25 bg-trading-yellow/5 px-3 py-2.5`
- 左：Gift 图标
- 中：`AIRDROP` eyebrow（trading-yellow）+ `1 Airdrop ready` + 副文案 `Claim before close`
- 右：ChevronRight
- 没有可领取空投时 `return null`

### 3. CampaignBannerCarousel（复用现有）
- 直接用现有 `<CampaignBannerCarousel variant="mobile" />` 全宽渲染
- 容器只做左右 padding：`px-4`
- 内部已有自动轮播 + 指示点，曝光最强
- 与上方两条 strip 之间 `space-y-2.5`，与 Discover 之间 `space-y-5`

## 文件改动

- 新增 `src/components/home/HomeOnboardingStrip.tsx`
- 新增 `src/components/home/HomeAirdropStrip.tsx`
- 删除 `src/components/home/HomeStatusTray.tsx`（被三层取代）
- 修改 `src/pages/MobileHome.tsx`：
  - 移除 `<HomeStatusTray />`
  - 顺序：`HomeKPIHeader → HomeOnboardingStrip → HomeAirdropStrip → CampaignBannerCarousel → HomeAccountHub → HomeDiscover → HomeMore`
  - 三个曝光层之间用 `space-y-2.5`，与 Discover 之间用 `mt-5`
- 不动业务逻辑、hooks、跳转目标、Logo 修复（已 done）

## 不会改动
- `HomeKPIHeader.tsx`、`HomeAccountHub.tsx`、`HomeDiscover.tsx`、`HomeMore.tsx`
- `CampaignBannerCarousel.tsx` 内部
- 任何 hook 与数据源