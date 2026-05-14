# 恢复 Campaign Carousel 到 Home 顶部

## 目标

Step 1 重构 MobileHome 时把 `CampaignBannerCarousel` 一并移除了，导致 Mainnet Launch 和 Hedge 两个核心商业入口在 Home 上消失。本次把它放回去，并明确它在新信息流架构里的位置。

## 视觉结构

```text
┌────────────────────────────────┐
│ MobileHeader                   │
├────────────────────────────────┤
│ HomeStatusStrip   (Equity/CTA) │  ← 细
├────────────────────────────────┤
│ CampaignBannerCarousel         │  ← 恢复，保留原视觉
│  · Mainnet Launch              │
│  · Hedge                       │
├────────────────────────────────┤
│ HomeFeed                       │  ← 信息流
│  · Onboarding / WelcomeBack    │
│  · Trending × N                │
└────────────────────────────────┘
```

Carousel 不进入 Feed 的排序系统 —— 它是平台级商业位，独立于"个人/机会/浏览"三层信号。

## 改动

**`src/pages/MobileHome.tsx`**
- 重新 import `CampaignBannerCarousel`
- 在 `<HomeStatusStrip />` 之后、`<HomeFeed />` 之前插入 `<CampaignBannerCarousel variant="mobile" />`
- 间距：与 StatusStrip / Feed 各保持现有 `space-y` 节奏（`mt-3` 上下）

**其他文件不动。** Carousel 自身组件保持原样，guest / authed 都展示（campaign 对未登录用户是最强获客信号）。

## 后续（Step 2 时再决定，不在本次范围）

- 是否在 Mainnet Launch 倒计时结束后自动隐藏 Mainnet 那张 slide
- 是否在 Feed 中段对沉睡用户额外插一张"campaign reminder" FeedCard（小卡形态，与顶部 carousel 区分）

这两点等 Step 2 视觉层级方案出来后一起讨论。
