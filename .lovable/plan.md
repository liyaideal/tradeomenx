## 思路

Home 的本质 = **"打开 app 第一眼,看到这一刻最值得我看的东西"**。
不是 wallet,不是 dashboard,而是一条按优先级排序的卡片流。每张卡 = 一条"信号",大小一致、视觉一致、行动一致。

Wallet 信息(equity / 持仓)不是主角,只在顶部薄状态条出现,随时可见但不抢戏。要看完整 wallet 去 `/wallet` 或底部 tab。

## 页面骨架

```text
┌─────────────────────────────────┐
│ Logo        Mainnet  [ status ] │  ← Header (现有, 不动)
├─────────────────────────────────┤
│ StatusStrip                     │  ← 新: 一行薄条
│  $1,234.56 Equity  ↗ +2.3%      │     登录态: equity 胶囊 + 今日 PnL
│  (访客: "Sign in to trade →" )  │     访客: 单 CTA 胶囊
├─────────────────────────────────┤
│ Feed                            │  ← 主体
│  ┌─────────────────────────┐    │
│  │ [type tag]   ⋯          │    │     每张卡:
│  │ Title / 主信息          │    │     - 同一卡壳
│  │ Sub line                │    │     - 顶部小 type 标签
│  │ [ Primary action ]      │    │     - 一个主行动
│  └─────────────────────────┘    │     - 可 dismiss(部分类型)
│  ┌─────────────────────────┐    │
│  │ ...                     │    │
│  └─────────────────────────┘    │
│                                 │
│  [ Load more / 自然结束 ]       │
└─────────────────────────────────┘
```

## Feed 卡片类型

每种类型独立组件,共享 `<FeedCard>` 卡壳:

| Type tag | 触发条件 | 内容 | 主 action |
|---|---|---|---|
| `Onboarding` | 未完成注册步骤 | 当前步骤名 + 进度 1/3 | Continue |
| `Position` | 持仓 PnL 突破 ±10% | 市场名 + PnL 数字 | View position |
| `Watching` | 关注的市场价格变化 >5% | 市场名 + 新概率 | Open market |
| `Settling soon` | 持有/关注的市场 <24h 结算 | 市场名 + 倒计时 | Open market |
| `Trending` | 平台 24h 高 volume 市场 | 市场名 + volume + 概率 | Open market |
| `New listing` | 24h 内新上市场 | 市场名 + 简介 | Open market |
| `Airdrop` | 有可领 airdrop | 金额 + 名称 | Claim |
| `Campaign` | 当前活动(最多 1 张) | 活动名 + 简介 | Join |
| `Welcome back` | 距上次登录 >7 天 | "Welcome back" + 期间 top mover | View |
| `Learn` | 给新人/低频 | 教程标题 | Read |

## 四种用户状态下 feed 的默认顺序

| 状态 | 默认 feed 顺序(top → down) |
|---|---|
| 访客 | Trending × 5 → Learn × 2 → New listing × 3 |
| 新用户(无成交) | Onboarding → Campaign(若有) → Trending × 3 → Learn × 2 |
| 活跃 trader | Position alerts → Watching → Settling soon → Airdrop → Trending |
| 沉睡用户 | Welcome back → Position(若仍持有) → Trending × 5 |

排序规则在一个 `useHomeFeed()` hook 里,按 (priority, recency) 排序后返回数组。

## 视觉规则(强制统一)

- **卡壳**: `rounded-2xl border border-border/40 bg-card p-4`,无变种
- **Type tag**: 顶部一行 `text-xs uppercase tracking-wide text-muted-foreground`,无背景色
- **强调色**: 仅 `primary` 用于按钮 / `trading-green|red` 用于 PnL / `trading-yellow` 仅用于 settling 倒计时
- **禁止**: 绿色描边卡、金色全图卡、紫色 eyebrow、emoji、装饰图、卡内多 CTA
- **CTA 风格**: 主要 = `bg-primary text-primary-foreground` 小按钮,次要 = ghost 文字

## 文件改动

### 新建
- `src/components/home/HomeStatusStrip.tsx` — 顶部薄状态条(equity + PnL 胶囊 / 访客 CTA)
- `src/components/home/feed/FeedCard.tsx` — 共享卡壳 + type tag slot
- `src/components/home/feed/cards/OnboardingCard.tsx`
- `src/components/home/feed/cards/PositionAlertCard.tsx`
- `src/components/home/feed/cards/WatchingCard.tsx`
- `src/components/home/feed/cards/SettlingSoonCard.tsx`
- `src/components/home/feed/cards/TrendingCard.tsx`
- `src/components/home/feed/cards/NewListingCard.tsx`
- `src/components/home/feed/cards/AirdropCard.tsx`
- `src/components/home/feed/cards/CampaignCard.tsx`
- `src/components/home/feed/cards/WelcomeBackCard.tsx`
- `src/components/home/feed/cards/LearnCard.tsx`
- `src/hooks/useHomeFeed.ts` — 按用户状态生成 feed item 数组(纯 mock 数据/复用现有 hooks)
- `src/components/home/HomeFeed.tsx` — 渲染 feed item 列表

### 修改
- `src/pages/Home.tsx` — 砍掉旧的 EquityHero / OnboardingStrip / AirdropStrip / CampaignBanner / AccountHub / Discover / More 调用,改为:
  ```tsx
  <Header />
  <HomeStatusStrip />
  <HomeFeed />
  ```

### 不动 / 暂留
- `HomeEquityHero.tsx` 等旧组件**不删除**,只是 Home 不再引用,保留给可能的 `/wallet` 页或回滚
- 底部 tab、`/events`、`/wallet` 等其他页面不动
- 设计令牌不动

## 实施分步(approve 后)

1. **第 1 步:骨架 + StatusStrip + 3 类核心卡**(Trending / Onboarding / Welcome back) — 可见雏形
2. **第 2 步:补全剩余卡片类型 + `useHomeFeed` 排序逻辑** — 4 种用户状态切换可见
3. **第 3 步:做 dismiss / 空态 / load more 等细节** — 收尾

第 1 步完成后停下来给你看效果,再决定是否继续。

## 不做的事

- 不动现有 wallet 页、events 页、底部 tab
- 不做真实推荐算法,排序用现有 mock + 简单优先级
- 不动 campaign 业务逻辑,只调它在 home 的呈现
- 不引入新依赖
