确认了解：在你同意前我不会开始写代码。下面是我基于需求和你的四个确认选项整理的实施计划。

## 已确认决策

- 上线范围：接现有交易数据。
- 视觉规范：文案不使用 emoji；只在插画/装饰里表现火箭、金币、发射感，符合项目“NO EMOJIS in UI”的规则。
- 首页入口：H2E banner 位置改成轮播，Mainnet Launch 第一张，H2E 第二张。
- CTA 与归因：复用现有登录流程；未登录打开现有 Sign Up / Sign In，登录后跳转 Events；`?ref=xxx` 保留在 URL/localStorage，首版不入库、不接 referral 绑定。

## 页面与路由

新增路由：

```text
/mainnet-launch
```

页面全英文，暗色背景 + 金色/橙色主视觉，和 H2E 紫色区分。桌面用全宽营销页布局，移动端用现有移动 header + responsive sections。

页面结构按需求实现：

1. Hero
   - Tag: `MAINNET LAUNCH`
   - Headline: `OmenX Mainnet Is Live.`
   - Sub-headline: `Your first trade wins. Every time.`
   - Body: `Make your first trade and win $2–$50 USDC. 100% win rate. No lottery. No luck needed.`
   - CTA: `Start Trading →`
   - 三个 trust badges：`100% win rate` / `Up to $50 USDC` / `Rewards in 24h`
   - 真实倒计时，每秒更新，截止：2026-05-28 10:00 UTC+8
   - 右侧/下方为 CSS/SVG 风格火箭发射 + USDC 金币 + 金色光效插画，不在文案中使用 emoji。

2. How It Works
   - 3-step cards：Sign Up / Make Your First Trade / Get Paid
   - 桌面三列，移动端纵向堆叠。
   - Step 2 明确 `≥5K USDC volume` 是 trading volume。

3. Reward Ladder
   - Event 1: First Trade Bonus 卡片，显示 `Trade ≥ 5K USDC volume → Win $2–$50 USDC` 与 `100% Win Rate`。
   - Event 2: Volume Rebates 表格：10K/50K/100K/300K/500K/750K/1M 对应 5/10/20/60/100/150/200 USDC。
   - 明确 `Rewards based on highest tier reached. Not cumulative across tiers.`
   - 已登录用户用现有交易 volume 高亮当前档位。

4. Trust & Security Bar
   - Mainnet Live / Built on Base / Settle in USDC / Rewards in 24h。
   - 使用 Lucide 图标，不使用 emoji。

5. Key Rules
   - 按需求展示短规则。
   - 文案保留 fee ratio、daily by 18:00 UTC+8、campaign dates、eligible invited users 等重点。

6. FAQ
   - 用 accordion 展示 6 个问题。
   - 包含 trading volume 定义、奖励到账时间、两个 Event 能否同时拿、Event 2 不累加、是否需要 deposit $5,000、What's the catch。

7. Final CTA + Timeline
   - The clock is ticking.
   - 显示截止日期和 campaign timeline。
   - Timeline 根据当前时间计算 Day X of 14；活动前/活动后也会有合理 fallback 文案。

8. My Progress
   - 未登录或无首笔达标交易：不显示 Progress，完整活动页照常展示。
   - 已登录且达到首笔交易门槛：显示 Your Campaign Progress。
   - 数据首版来自现有 `trades` 表计算：统计 campaign 时间窗口内当前用户 `Filled` 交易的 `amount` 总和作为 volume。
   - Event 1 状态：
     - volume ≥ 5,000：显示完成，但因为首版不新增运营奖励状态表，奖励状态显示为 `Processing`，奖励金额显示区间 `$2–$50 USDC`，不伪造具体中奖金额。
     - volume < 5,000：不展示 Progress section，避免给未转化用户增加复杂信息。
   - Event 2 状态：根据 volume 自动计算当前最高档、下一档、还差多少。
   - CTA 文案：`Go to Events →`。
   - Share 首版先不做生成分享卡片，避免引入未确认的分享素材和 referral 绑定；可在下一阶段补。

## 首页入口：banner 轮播

把现在 Events/MobileHome 中 H2E banner 的位置替换为活动 banner 轮播组件：

```text
Slide 1: Mainnet Launch
Slide 2: H2E
```

Mainnet slide：
- 金色/橙色主视觉。
- 文案：
  - `MAINNET LAUNCH`
  - `Your first trade wins. Every time.`
  - `Up to $50 USDC — 100% win rate.`
  - CTA: `Join Now →`
  - `Ends in 13d 14h` 这类动态倒计时。
- 点击跳 `/mainnet-launch`，保留当前 `ref` 参数（如果有）。

H2E slide：
- 复用现有 `HedgeEntryBanner` 的图片和跳转 `/hedge`。

轮播行为：
- Mainnet Launch 默认第一张。
- 自动轮播，带 dots；桌面可有 hover pause，移动端可横滑/点 dots。
- 在 EventsPage 和 MobileHome 两处替换，保持原先位置与间距。

## CTA / 登录逻辑

所有活动页 CTA 使用统一逻辑：

- 未登录：打开现有 AuthDialog/AuthSheet。
- 已登录：跳转 `/events`。
- 如果当前 URL 有 `?ref=xxx`：
  - 页面加载时存入 localStorage，例如 `mainnet_launch_ref`。
  - CTA 跳转时保留 query ref 或 source 信息，不做后端绑定。

## 数据与计算

首版不新增数据库表，不做运营标记后台。

新增前端 hook：

```text
useMainnetLaunchProgress
```

职责：
- 读取当前登录用户在 campaign 时间窗口内的 `trades`。
- 过滤 `status = Filled`。
- 统计 `amount` 总和作为 campaign volume。
- 计算：
  - 是否达到 Event 1：volume ≥ 5,000。
  - Event 2 当前档位。
  - 下一档所需 volume。
  - 下一档进度百分比。
  - days/hours/minutes left。

注意：现有 `trades.amount` 在 demo 数据中可能较小，所以 Progress 对真实用户会按现有交易数据展示；未达标就不显示 Progress。后续如果要对接合约引擎真实 volume，可替换 hook 内数据源。

## 埋点

本轮不接第三方 analytics 或后端事件表，因为你选择了“复用现有登录”。我会保留一个轻量前端 helper：

- 开发环境 console debug 或 no-op。
- 事件命名按需求预留：`mainnet_launch_page_view`、`mainnet_launch_cta_click`、`mainnet_launch_faq_expand` 等。

这样之后接 analytics 时不用改 UI 结构。

## 技术改动范围

预计新增/修改：

- `src/App.tsx`
  - 增加 `/mainnet-launch` route。

- 新增 `src/pages/MainnetLaunch.tsx`
  - 活动页容器、SEO title/description、header/footer、section 组合、移动浮动 CTA。

- 新增 `src/components/mainnet-launch/*`
  - Hero、HowItWorks、RewardLadder、TrustBar、KeyRules、FAQ、FinalCTA、Progress、Countdown、LaunchVisual、MobileFloatingCTA 等组件。

- 新增或替换入口组件
  - 例如 `src/components/campaign/CampaignBannerCarousel.tsx`
  - 复用现有 `HedgeEntryBanner` 的图片资产作为第二张 slide。

- 修改：
  - `src/pages/EventsPage.tsx`：把 `<HedgeEntryBanner />` 替换为轮播。
  - `src/pages/MobileHome.tsx`：把 `<HedgeEntryBanner variant="mobile" />` 替换为轮播。

- 新增 hook/util：
  - `src/hooks/useMainnetLaunchProgress.ts`
  - `src/lib/mainnetLaunch.ts` 或组件内常量：活动时间、阶梯、倒计时格式化、tier 计算。

## 不包含在首版的内容

- 不新增运营后台“批量标记已发放”。
- 不新增奖励 claimed/processing 数据表。
- 不伪造用户具体 Event 1 中奖金额。
- 不实现分享卡片生成。
- 不接 referral 注册绑定。
- 不接真实第三方 analytics。

这些可以作为第二阶段，在 landing page 上线后继续补。

## 验收标准

- `/mainnet-launch` 桌面和移动端均完整展示所有活动 sections。
- 文案全英文，UI 文案无 emoji。
- 倒计时每秒更新，基于 2026-05-28 10:00 UTC+8。
- 未登录点击 CTA 打开现有登录弹窗/sheet。
- 已登录点击 CTA 跳转 `/events`。
- 已登录且现有交易 volume ≥ 5,000 时显示 Progress，并正确计算当前 tier/下一档差额。
- Events 首页和 MobileHome 的原 H2E banner 位置变为轮播，Mainnet Launch 默认第一张，H2E 仍可访问。
- 不修改 Supabase auto-generated client/types 文件。