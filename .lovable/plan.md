# /style-guide 增加 Mobile Home Playground，清理旧 Home 规则

## 背景

`MobileHome` (`/`) 已经重新设计完成，当前实际渲染的模块顺序：

1. `MobileHeader`（Discord + 语言切换 + 通知）
2. `HomeGreeting` — 游客 / 登录两套布局，且登录态分 `hasData` / 无 7D 活动
3. `PersonalSlot` — 根据用户激活状态从 OnboardingCard / PositionAlertCard / null 三选一
4. `HomeCampaignRail` — 横滑 banner
5. `HomeTopEvents` — 标题随用户态变化，游客额外插入 `TrialCallout` interlude

而 `MobilePatternsSection.tsx` 顶部还保留着 "Preset D · Home Equity Hero" 这种已经下线的旧规则（`HomeEquityHero` 不再被 `MobileHome` 使用），需要清理。

## 改动概览

### 1. 新建 `src/pages/StyleGuide/sections/MobileHomeSection.tsx`

一个独立的 Mobile Home playground，按"模块 → 状态"组织。每个模块用 `SubSection` 包，状态切换用 `Tabs` 或 `Badge` 选择器，Preview 直接渲染**真实组件**（不重写 mock），右侧贴对应 props/状态说明。

模块清单：

- **A. Page Skeleton** — 一张 390×* 的 mockup，标注从上到下的 5 个模块槽位、间距 (`mt-3 / mt-5`)、外层 padding (`px-4 pt-3 pb-2`) 和 `pb-24` 给 BottomNav 留位。
- **B. MobileHeader (Home preset)** — 渲染真实 `<MobileHeader showLogo showBack={false} rightContent={...} />`，列出 Discord / Language / Notification 三个 action 的规范（hover 色、红点未读指示）。
- **C. HomeGreeting** — 状态切换器：
  - `guest` → "Live on OmenX" 卡片（24h volume + active markets + 顶部市场 sparkline + 底部 CTA "Sign in to start trading →"），数据来自 `useHomeStats`，未登录态点击触发 `onSignIn`
  - `authed · hasData` → "Welcome back / displayName" + Deposit chip + Total equity 大字 + 7D PnL + sparkline
  - `authed · noData` → 同上但显示 "No 7D activity — Tap deposit to start"
  - 在 playground 用 mock props 强制渲染各状态（封装一个 `<HomeGreetingPreview state="guest|authedActive|authedEmpty" />` 包装器，避免依赖真实 auth context）
- **D. PersonalSlot** — 三态卡片并排：
  - guest / activated-empty → 空（说明 "renders nothing"）
  - `S0_NEW / S1_DEPOSITED` → `OnboardingCard`
  - activated + has positions → `PositionAlertCard`（用 mock positionId 或静态截图复刻）
  - 文字说明优先级规则
- **E. HomeCampaignRail** — 直接渲染真实组件，列出 4 种 theme (`gold / primary / green / violet`) 和 chip tone (`accent / success / ...`)
- **F. HomeTopEvents** — 标题逻辑表：
  - guest → "Top Events" + `<TrialCallout>` interlude
  - authed + 无持仓 → "Pick your first prediction"，无 interlude
  - authed + 有持仓 → "Top Events"，无 interlude
  - 排序规则一行带过：`24h volume desc`（指向 `useHotMarkets`）
- **G. Spacing & Empty State 规范** — 表格列出每个模块的 `mt-*` 值、`empty:hidden` 的使用（PersonalSlot 容器）、以及"游客点击大卡 → AuthSheet"的全局交互。

### 2. `src/pages/StyleGuide/sections/index.ts`

导出新增的 `MobileHomeSection`。

### 3. `src/pages/StyleGuide/index.tsx`

在 `tabs` 数组里新增一项 `{ id: "home", label: "Mobile Home", icon: "🏠" }`，建议放在 `mobile` 之前（"Mobile" 这个 tab 是 header / 通用 mobile patterns，"Mobile Home" 是 `/` 页专属）。新增对应的 `<TabsContent value="home">`。

### 4. 清理 `MobilePatternsSection.tsx`

- 删除整段 "PRESET D · HOME EQUITY HERO" `SectionWrapper`（约 line 77-136），它引用的 `HomeEquityHero` 已不在 `MobileHome` 中使用，留着只会误导。
- 保留 "Mobile Header Design Specification"、"Header Playground"、"Logo Usage" 等通用规范，以及 Header preset 切换器里的 `home` preset（这个还是对的：home 页 header 就是 logo-only）。
- 不动 `MobileHeader` 组件本身。

### 5. （可选）保留无用的旧组件文件

`HomeEquityHero / HomeMarketsSections / HomeFeed / HomeDiscover / HomeOnboardingStrip / HomeAirdropStrip / HomeAccountHub / HomeStatusStrip / HomeTournamentsRail / HomeActionAlerts / LiveStatsStrip` 这些文件**当前没有被任何页面引用**（只在自身文件 grep 命中）。本次先不删除，避免误伤；如果你确认弃用，下一轮可以一并清掉。在 plan 里列出来便于决策。

## 文件改动清单

| 文件 | 操作 |
|---|---|
| `src/pages/StyleGuide/sections/MobileHomeSection.tsx` | 新建 |
| `src/pages/StyleGuide/sections/index.ts` | 新增导出 |
| `src/pages/StyleGuide/index.tsx` | 新增 tab + TabsContent |
| `src/pages/StyleGuide/sections/MobilePatternsSection.tsx` | 删除 Preset D 段落 |

## 不动的范围

- `MobileHome.tsx` 与所有 `src/components/home/*` 真实组件零修改。
- 其它 StyleGuide section（Tokens / Typography / Trading / Wallet / ...）零修改。
- 旧的未引用 home 组件文件本轮**不删**，等你确认。

## 一个需要你确认的点

> **是否需要在本轮把没人引用的旧 home 组件文件（`HomeEquityHero` 等 11 个）一起删掉？**
> 默认我倾向**先保留**，因为 grep 没人引用 ≠ 完全无用（可能是动态 import 或后续要复用），稳妥起见单独一轮处理。
