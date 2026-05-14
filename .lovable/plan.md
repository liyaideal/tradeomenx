## Step 3 — Feed 视觉打磨

聚焦 4 个微交互层面的提升，全部为前端展示层改动，不动数据/排序逻辑。

---

### 1. Tier-1 左侧强调色「呼吸」效果

**位置**：`src/components/home/feed/FeedCard.tsx` 中 `showAccentBar` 渲染的 `<span>`。

- 在 `tailwind.config.ts` `keyframes` 新增 `accent-breathe`：
  ```
  "0%,100%": { opacity: "1", boxShadow: "0 0 0 0 hsl(var(--primary)/0)" }
  "50%":     { opacity: ".7", boxShadow: "0 0 6px 0 hsl(var(--primary)/.45)" }
  ```
- `animation` 新增 `accent-breathe: accent-breathe 2.4s ease-in-out infinite`
- accent bar 加 class：`animate-accent-breathe`
- 颜色根据 `accent` 走 currentColor / 已有 bg-* 即可（box-shadow 用 CSS var 即可，对 green/red/yellow 可在 FeedCard 内通过内联 style 注入对应 hsl 变量，避免动态 class 拼接）

仅在 tier 1 + 非 compact 时启用；遵循 `prefers-reduced-motion`（Tailwind `motion-reduce:animate-none`）。

---

### 2. Tier-1 未读红点

**新增逻辑**：标记某张 tier-1 卡片是否「未读」。

- `FeedCard` 新增 prop：`unread?: boolean`（默认 false）。
- 渲染：tag 行右侧（meta 之前）插入 2px 圆形红点 `bg-trading-red`，带轻微 `animate-pulse`。
- compact 模式不显示（无 tag 行）。
- 由各 tier-1 卡片自行决定：
  - `PositionAlertCard`：用 localStorage key `seen:positionAlert:{positionId}:{pnlBucket}` 判定（pnlBucket = `Math.round(pnl%/5)`，PnL 跨 5% 档变化即重新标红）。点击卡片后 `setItem` 标记已读。
  - `WelcomeBackCard`：localStorage `seen:welcomeBack:{date}`，每天首次显示标红。
  - `OnboardingCard`：始终未读（用户没完成 onboarding）。

放一个轻量 helper：`src/lib/feedUnread.ts`，导出 `useUnreadFlag(key: string)` → `{ unread, markRead }`。

---

### 3. Sparkline 价格缩略图

**位置**：`TrendingCard`、`WatchlistMoveCard`、`SettlingSoonCard`，渲染在右侧或第二行。

- 新建 `src/components/home/feed/Sparkline.tsx`：纯 SVG（48×16），接受 `prices: number[]`，最少 2 个点。自动拟合 min/max。
  - 描边色由 prop `tone: "up" | "down" | "neutral"` 决定，分别对应 `text-trading-green / red / muted-foreground`。
  - 末端加 1.5px 圆点（同色，highlight 当前价）。
  - `strokeWidth=1.25`、无填充、`vector-effect="non-scaling-stroke"`。
- 数据源：复用现有 `usePriceHistory(optionIds)`（`src/hooks/usePriceHistory.ts`）。
  - 在卡片组件内调用 `usePriceHistory([topOption.id])`，取末段 30 个点降采样到 12 个。
  - `tone` 由首末点比较得出。
- 布局：
  - `TrendingCard`：tier 3 时不显示（保持极简）；tier 2 提升时显示。
  - `WatchlistMoveCard`：必显，放在事件名右侧（flex 容器）。
  - `SettlingSoonCard`：放在倒计时下方第二行末尾。
- 加载/无数据：渲染 16px 高占位 `<div className="h-4 w-12 rounded bg-muted/30" />`，避免高度跳动。

性能：每张卡只查 1 个 option，按需 hook（不在 useHomeFeed 里集中查），以减小首屏阻塞。

---

### 4. 卡片微动画 / 按压反馈

**位置**：`FeedCard.tsx` 根元素。

- 入场：列表项加 `animate-fade-in`（已有 keyframe）+ stagger。在 `HomeFeed.tsx` 给每张卡片包裹 `style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}`、class `animate-fade-in`。
- 按压（仅 onClick 时）：
  - 把现有 `active:scale-[0.998]` 升级为 `active:scale-[0.985] active:bg-card-hover`
  - 加 `transition-[transform,background-color,border-color] duration-150 ease-out`
  - hover 状态：`hover:border-border/70`（边框轻提亮，比纯背景变化更克制）
- Tier 1 额外：`hover:shadow-[0_0_0_1px_hsl(var(--primary)/.25)]`，强调可点。
- 全部遵守 `motion-reduce:transition-none motion-reduce:animate-none`。

---

### 技术细节 / 文件清单

**新增**
- `src/components/home/feed/Sparkline.tsx`
- `src/lib/feedUnread.ts`

**修改**
- `tailwind.config.ts` — 加 `accent-breathe` keyframe + animation
- `src/components/home/feed/FeedCard.tsx` — 新增 `unread` prop、breathe class、按压/hover 微调
- `src/components/home/HomeFeed.tsx` — 列表项 stagger fade-in
- `src/components/home/feed/cards/PositionAlertCard.tsx` — 接 useUnreadFlag、点击 markRead
- `src/components/home/feed/cards/WelcomeBackCard.tsx` — 同上
- `src/components/home/feed/cards/OnboardingCard.tsx` — `unread` 恒为 true
- `src/components/home/feed/cards/TrendingCard.tsx` — tier 2 时挂 Sparkline
- `src/components/home/feed/cards/WatchlistMoveCard.tsx` — 挂 Sparkline
- `src/components/home/feed/cards/SettlingSoonCard.tsx` — 挂 Sparkline

**不动**
- `useHomeFeed.ts` 排序/打分逻辑
- 数据 hook（`usePositions`、`useActiveEvents` 等）
- 桌面 Home（保持现状，等后续单独对齐）

---

### 验收

- Tier-1 卡片左条带可见的呼吸光晕，不刺眼，2.4s 周期
- Tier-1 首次出现 / 状态变化时右上有 2px 红点，点击后红点消失且刷新后不再出现
- Trending（tier 2）/ Watching / Settling soon 显示 48×16 sparkline，颜色随趋势变化
- 列表入场有 40ms 错位淡入
- 按压时卡片轻微缩放 + 背景变化，hover 边框微亮
- `prefers-reduced-motion: reduce` 下所有动画停用
