# 首页 Dashboard Flow 重构方案

落地用户选定的 v2「顶部 KPI 余额条 + 横向状态托盘 + 统一节奏列表」。核心思想：把上半部分（激活卡 + Airdrop alert + Campaign banner）的"三块独立大卡"改成"一条 KPI Header + 一条横向状态托盘"，让上下密度趋于一致；下半部分保持现有列表节奏并对齐到同一套 padding / 圆角 / border。

---

## 1. 新增：HomeKPIHeader（顶部余额 KPI 条）

新文件：`src/components/home/HomeKPIHeader.tsx`

替换原 MobileHeader 上半区视觉：把 logo + Mainnet 标签放第一行，下面一整块大字余额作为整页的"开屏锚点"。

结构：
- sticky 顶部，`backdrop-blur` + `border-b border-border/40`
- 顶行：左 logo + Mainnet 胶囊（沿用现有 `MobileHeader` 的 logo/胶囊），右 Discord/Globe/Bell（沿用现有按钮）
- 下行（仅登录后显示）：
  - Eyebrow `text-[10px] uppercase tracking-widest text-muted-foreground` = "Total equity"
  - 大数字 `font-mono text-[28px] font-semibold` = `formatBalance(profile.balance)`
  - 旁边小字 `font-mono text-xs text-trading-green` = 7 日 PnL（沿用原 weeklyPnL mock）
- 未登录用户：下行显示一行 CTA "Sign in to start trading" + ChevronRight，点击触发 `onLogin`

直接替换 `MobileHome.tsx` 里现有的 `<MobileHeader>` 调用（保留按钮区，只把布局换成 KPI Header）。

---

## 2. 新增：HomeStatusTray（横向状态托盘）

新文件：`src/components/home/HomeStatusTray.tsx`

把"激活进度 + Airdrop pending + Campaign 营销卡"统一成一条横向滚动托盘：
- 容器：`-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x scrollbar-hide`
- 每张卡：`flex-shrink-0 rounded-2xl border border-border/40 bg-card p-3.5`，宽度 `w-[280px]`（激活）/ `w-[220px]`（其余）
- 三张卡都用相同的"icon chip + 双行文案 + 可选 ChevronRight"骨架，差异化只在颜色 token：

| 卡 | 条件 | 颜色 | 内容 |
|---|---|---|---|
| Activation | `state in (S0_NEW, S1_DEPOSITED)` | trading-green | 圆形 progress（3 段 dot）+ "Onboarding N/3" + 当前 step label，点击跳当前 step.action |
| Airdrop | `pendingAirdrops.length > 0` | trading-yellow | Gift icon + "N Airdrop pending" + NEW badge，点击 `/portfolio/airdrops` |
| Campaign | 永远显示一张主推 | primary / trading-yellow | 沿用 `CampaignBannerCarousel` 当前数据源中的 active campaign，但改成同尺寸卡片 |

激活完成后 (state ≠ S0/S1)，托盘只剩 Airdrop + Campaign；都不存在时 tray 整段不渲染。

注：`CampaignBannerCarousel` 现有的"全宽轮播大卡"只在托盘中以紧凑卡形式出现一张主推，多 campaign 走 horizontal scroll。

---

## 3. 修改：HomeAccountHub

- 删除 `ActivationCard`（已迁到 StatusTray）
- 删除 `UserStatsCard`（balance 已上移到 KPI Header）
- 保留 `GuestWelcomeCard` 用于未登录场景，但简化为 KPI Header 下的"价值主张 + Start trading 按钮"小卡，padding `p-4`，与下方列表节奏一致
- 已登录且已激活的用户，HomeAccountHub 直接 `return null`（KPI Header 已展示余额）

---

## 4. 修改：MobileHome 主结构

```tsx
<div className="min-h-screen bg-background pb-24">
  <HomeKPIHeader onLogin={...} />
  <main className="px-4 pt-4 pb-2 space-y-5">
    <HomeStatusTray />            {/* 替换 HomeAccountHub + HomeActionAlerts + CampaignBannerCarousel */}
    <HomeAccountHub onLogin={...} /> {/* 仅 guest 显示 GuestWelcomeCard */}
    <HomeDiscover />
    <HomeMore />
  </main>
  <BottomNav />
</div>
```

- 移除原 `<MobileHeader>` 调用与 HomeActionAlerts 渲染
- `<HomeDiscover>` 内部移除 `<CampaignBannerCarousel>`（已迁到 tray）
- `space-y-5` 保持当前节奏

---

## 5. 修改：HomeDiscover

- 删除文件顶部的 `<CampaignBannerCarousel variant="mobile" />`
- 其余结构（My positions / Hot markets / Settlement + 紧凑卡）全部保留——上轮已经紧凑化到位

---

## 6. 统一卡片节奏 token

所有列表卡（StatusTray 卡 / Position 卡 / Market 卡 / More 卡）统一用：
- `rounded-2xl`（StatusTray 大卡）/ `rounded-xl`（小列表卡）
- `border border-border/40`
- `bg-card`
- padding：列表卡 `p-3`，托盘卡 `p-3.5`

确保从 KPI header → tray → positions → markets → more 视觉密度连续，无突兀大卡。

---

## 不改动

- 业务逻辑：`useActivationState` / `useAirdropPositions` / `useUserProfile` / `usePositions` / `useActiveEvents`
- BottomNav、AuthSheet、RewardsWelcomeModal、AirdropHomepageModal
- HomeMore（已是紧凑双列卡）
- SectionHeader（上轮已紧凑化）
- 颜色 token、`trading-card` class 定义

---

## 文件变更清单

新建：
- `src/components/home/HomeKPIHeader.tsx`
- `src/components/home/HomeStatusTray.tsx`

修改：
- `src/components/home/HomeAccountHub.tsx`（删 ActivationCard / UserStatsCard，guest 卡简化）
- `src/components/home/HomeDiscover.tsx`（移除 CampaignBannerCarousel）
- `src/pages/MobileHome.tsx`（替换 header + 重排 main）

删除/替换调用：
- 不再渲染 `HomeActionAlerts`（逻辑迁入 StatusTray；文件可留作 fallback 但不引用）

---

## 预期效果

- 第一屏：KPI Header 60–70px + StatusTray 100px + GuestWelcome（仅访客）≈ 第一屏只占 200px，剩下显示 My positions 顶部
- 上下密度差异从"大卡 vs 紧凑列表"降为"统一节奏的卡流"
- 余额成为整页的主信息锚点，符合 Robinhood / Revolut 习惯
