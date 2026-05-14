# Step 2 — 视觉层级 + 剩余卡片 + 排序逻辑

把 Home Feed 从"骨架"升级为有节奏的信息流：3 层视觉权重、同类降级规则、补全卡片类型、用 `useHomeFeed` 统一排序。

## 1. 视觉层级（3 层）

所有卡共享 `FeedCard` 壳（rounded-2xl + border-border/40 + bg-card），只在 4 个维度上做层级差异：**左侧 accent bar / padding / 字号 / 颜色强调**。

### Tier 1 · 个人信号（最强）
谁：`PositionAlertCard`、`WelcomeBackCard`、`OnboardingCard`
- 左侧 2px accent bar：positive=trading-green / negative=trading-red / neutral=primary
- `p-4`，主文 `text-sm font-semibold`，关键数字 `text-base font-mono font-semibold`
- PnL 直接用 trading-green / trading-red 着色
- 同时最多 1 张 Tier 1 卡可视；多张时按"未读 > 时间"留 1 张

### Tier 2 · 机会信号（中）
谁：`SettlingSoonCard`、`WatchlistMoveCard`、`AirdropOpportunityCard`
- 无 accent bar；tag 右侧 meta 用 trading-yellow（倒计时 / 涨跌幅）
- `p-4`，主文 `text-sm font-medium`，数字 `font-mono font-semibold`
- 只在 meta 一处用强色，正文仍是 foreground

### Tier 3 · 浏览信号（最弱）
谁：`TrendingCard`、`NewListingCard`、`LearnCard`
- 更紧凑：`p-3.5`，主文 `text-[13px]` 不加粗
- 数字降级为 `text-foreground/80`，无强调色
- tag 仍保留，便于扫读

### 同类降级规则
同一 tier 同一 type 连续出现：第 2 张起切到 `FeedCard` 的 `compact` 变体——
- 去掉 tag 行
- `p-3`
- 上边距收紧（feed 用 `space-y-1.5` 包一组连续同类，组间 `space-y-2.5`）

`FeedCard` 新增 props：
```ts
tier?: 1 | 2 | 3;          // 默认 3
accent?: "primary" | "green" | "red" | "yellow" | "none";
compact?: boolean;         // 同类第 2 张起为 true
```

## 2. 剩余卡片类型

**`PositionAlertCard`**（Tier 1）— 用 `usePositions` + `useRealtimePositionsPnL`
- 触发：单仓 `|pnlPercent| ≥ 10%` 或接近清算（margin ratio）
- 内容：`{event} · {option}` + 大号 PnL（绿/红） + "View position →"
- 跳转：`/portfolio?position={id}`

**`SettlingSoonCard`**（Tier 2）— 用 `useActiveEvents`
- 触发：`end_date` 在 24h 内的 event
- meta：倒计时 `Ends in 3h 12m`（trading-yellow）
- 内容：event name + 顶部 option 当前价

**`WatchlistMoveCard`**（Tier 2）— 用 `useWatchlist` + `useRealtimePrices`
- 触发：watchlist 中的 event 24h 涨跌幅 ≥ 5%
- meta：`+8.4%`（trading-green/red）
- 内容：event name + before → now 价格

**`AirdropOpportunityCard`**（Tier 2）— 用 `useAirdropPositions` + `useH2eRewardsSummary`
- 触发：authed 用户存在未激活的 airdrop 机会
- 内容：`Free $X position available` + "Claim →"
- 跳转：`/portfolio/airdrops`

**`NewListingCard`**（Tier 3）— 用 `useActiveEvents`
- 触发：`created_at` 在 48h 内
- 内容：event name + "New" badge（小）+ 顶部 option 价

**`LearnCard`**（Tier 3）— 静态轮换
- 触发：S0_NEW / S1_DEPOSITED 或 guest，用作 feed 末尾"填充 + 教育"
- 池：3-5 条预设（"What's a prediction market?" / "How leverage works" / "Read the glossary →"）
- 跳转：`/glossary`、`/about` 等

> 不在 Step 2 范围：`OrderFilledCard` / `RewardsClaimedCard`（待通知系统接入后再做）。

## 3. `useHomeFeed` 排序逻辑

新建 `src/hooks/useHomeFeed.ts`，输出：
```ts
type FeedItem =
  | { kind: "onboarding" }
  | { kind: "welcomeBack" }
  | { kind: "positionAlert"; positionId: string; severity: number }
  | { kind: "settlingSoon"; eventId: string; secondsLeft: number }
  | { kind: "watchlistMove"; eventId: string; absChange: number }
  | { kind: "airdropOpportunity" }
  | { kind: "trending"; eventId: string; volume: number }
  | { kind: "newListing"; eventId: string; createdAt: string }
  | { kind: "learn"; topicId: string };

function useHomeFeed(): { items: FeedItem[]; isLoading: boolean }
```

### 优先级评分
每个候选 item 算一个 score，降序排：

| Kind | 基础分 | 加权 |
|---|---|---|
| positionAlert | 1000 | + severity × 100（清算风险拉满） |
| onboarding | 900 | 仅 S0/S1 |
| welcomeBack | 850 | 仅 S2/S3 且 7 天未访问 |
| airdropOpportunity | 800 | 有未激活机会 |
| settlingSoon | 600 | + (24h - secondsLeft/3600) × 10 |
| watchlistMove | 500 | + absChange × 5 |
| trending | 200 | + log10(volume) × 10 |
| newListing | 150 | 48h 内线性衰减 |
| learn | 50 | 仅当上面凑不够 8 张时填充 |

### 后处理（顺序执行）
1. **Tier 1 上限**：最多保留 1 张（取分数最高）
2. **同类降级**：从前往后扫，第 2 张同 kind 起 `compact=true`
3. **总数**：authed ≤ 12，guest ≤ 8
4. **强制位**：第 1 张必须是 Tier 1 或 Tier 2（防止首屏全是 trending）；若没有，把分数最高的 settlingSoon/trending 提到顶并标记 `tier=2`

### `HomeFeed.tsx` 改动
变成纯渲染层：
```tsx
const { items } = useHomeFeed();
return (
  <div className="space-y-2.5">
    {items.map(renderItem)}
  </div>
);
```
按 `kind` 路由到对应 Card 组件。

## 4. 文件改动清单

**新建**
- `src/components/home/feed/cards/PositionAlertCard.tsx`
- `src/components/home/feed/cards/SettlingSoonCard.tsx`
- `src/components/home/feed/cards/WatchlistMoveCard.tsx`
- `src/components/home/feed/cards/AirdropOpportunityCard.tsx`
- `src/components/home/feed/cards/NewListingCard.tsx`
- `src/components/home/feed/cards/LearnCard.tsx`
- `src/hooks/useHomeFeed.ts`

**修改**
- `src/components/home/feed/FeedCard.tsx` — 新增 `tier` / `accent` / `compact` props
- `src/components/home/feed/cards/OnboardingCard.tsx` — 改为 `tier={1}`、`accent="primary"`
- `src/components/home/feed/cards/WelcomeBackCard.tsx` — 改为 `tier={1}`，根据 PnL 选 accent
- `src/components/home/feed/cards/TrendingCard.tsx` — 改为 `tier={3}`，支持 `compact`
- `src/components/home/HomeFeed.tsx` — 改为纯渲染 + `useHomeFeed`

**新增 memory**
- `mem://features/home-feed-architecture` — 记录 3 层视觉规范、降级规则、排序公式（Core 加一行简述）

## 5. 验收

- Authed S1 + 持仓状态：第 1 张应为 PositionAlert（如有 ≥10% 波动），否则 Onboarding
- Authed S3 沉睡：第 1 张为 WelcomeBack；后跟 SettlingSoon → Trending
- Guest：无 Tier 1，第 1 张提升为 SettlingSoon 或 Trending（带 tier=2 视觉）
- 连续 5 张 Trending：第 1 张正常，第 2-5 张为 compact 无 tag
- 浏览器手动复检：385px / 768px / 1024px 三档 padding 与节奏一致
