# Home v3 — Sportsbook-inspired layout

参考图核心模式：**问候头 → 搜索 → Tournaments 横滑大卡 → Top Events + Live 开关 + 分类 chips → 比分/赔率风格事件卡**。把它映射到我们的预测市场语境，用来取代当前 v2 的 LiveStatsStrip + 三段式列表。

## 1. 顶部区（取代 LiveStatsStrip）

```text
Hello,                                [+]
GUEST  /  WADE WARREN
─────────────────────────────────────────
[🔍  Search markets, categories…]
```

- Guest 显示 `Hello, there` + 副行 `Pick a market to start`；authed 显示 `Hello,` + 用户名（大写、display 字体）。
- 右上 `+` 按钮：guest = 打开 AuthSheet；authed = 跳 `/deposit`。
- 搜索框点击跳 `/events?focus=search`（先做 UI，搜索逻辑沿用现有 events 页过滤）。
- 不再放 equity 数字在最顶（authed 的 HomeStatusStrip 下移一格，紧贴问候，保持小尺寸）。

## 2. Tournaments 横滑卡（取代 CampaignBanner 的位置，但语义不同）

参考图里大色块 + 人物的横滑卡，我们用来承载**事件分类/主题**而不是单个 campaign：

```text
Tournaments
[ ▶ All matches            ] [ Crypto    ] [ Politics ] [ Sports ] …
[   PREMIER LEAGUE         ] [   …       ]
```

- 横向 snap 滚动，单卡 ~280×140，圆角 2xl。
- 第一张固定 = `All markets`（primary 色 + 箭头），点击跳 `/events`。
- 后续按 `category` 分组，封面用纯色 / 渐变 + 大写 display 字体类名（不放真人图，避免版权与风格冲突）。我们走极简色块路线，不复刻参考图的运动员摄影。
- 每张右下显示 `N markets · $X 24h`。
- 复用 `categoryUtils` 的颜色 token；新组件 `HomeTournamentsRail.tsx`。

## 3. Top Events + Live 开关 + 分类 chips

```text
Top Events                       LIVE  [●─]
[All] [Crypto] [Politics] [Sports] [AI] …
```

- `Live` 开关：开 = 只显示 `isClosingSoon` 或 24h 内有成交的市场；关 = 全部。默认开（强调「正在发生」的氛围）。
- 分类 chips 横滑，复用 `FilterChips` 视觉，单选，默认 `All`。
- 选中态：黑底白字 + 类别图标（Lucide），未选：muted 底。

## 4. 事件卡（比分赔率式，取代当前 MarketCardB 在 Home 的复用）

参考图卡片三段：左队徽 + 队名｜中赛事名 + 比分 + 时间｜右队徽 + 队名，下方一行三个赔率块。

映射到二元/多元预测市场：

```text
┌──────────────────────────────────────────┐
│ [icon]    Will BTC > 100k by EOY?  [icon]│
│  YES         Crypto · 2d 4h         NO   │
│              ── 0.72  ──                 │
│ ┌──────┐    ┌──────┐    ┌──────┐         │
│ │ Yes  │    │  —   │    │  No  │         │
│ │ 0.72 │    │ Vol  │    │ 0.28 │         │
│ │ +3%  │    │ 1.2M │    │ -3%  │         │
│ └──────┘    └──────┘    └──────┘         │
└──────────────────────────────────────────┘
```

- 二元事件：左 Yes 价 + 24h 涨跌、中 24h vol、右 No 价 + 涨跌。点左/右块直接跳 `/trade?event=…&side=yes|no`，预选边。
- 多选事件（>2 outcomes）：退化为 `MarketCardB` 原样，避免硬塞。
- 卡片整体可点击 → 事件详情（沿用现有逻辑）。
- 价格块用 `font-mono`，涨跌色 `trading-green/red`，符合 mem 排版规则。
- 新组件 `HomeMatchCard.tsx`，与 `MarketCardB` **并存**（mem「卡片风格隔离」：A/B/C 卡片文件互不修改 — 这是新增的 D 类卡，独立文件）。

## 5. 状态分支（沿用 v2 三态，但视觉换成 v3）

| State | 顶部 | Tournaments | Top Events 默认 chip | 个人 callouts 位置 |
|---|---|---|---|---|
| Guest | Hello, there + 搜索 | 显示 | All | `TrialCallout` 移到 Top Events 第 3 张卡之后 |
| Authed 无持仓 | Hello, name + 搜索 + HomeStatusStrip(slim) | 显示 | All | `OnboardingCard` 在 Tournaments 与 Top Events 之间 |
| Authed 有持仓 | 同上 | 显示 | All | 顶部 `PositionAlertCard` 上移到搜索框下、Tournaments 上面（最大 \|pnl%\|） |

## 6. 删除/降级

- `LiveStatsStrip` 不再放在最顶；保留组件，挪到 Tournaments 的卡角作为微数据（或直接删，看用户决定 — 见问题）。
- v2 的 `HomeMarketsSections` 三段式（Most traded / Closing soon / New）**保留作为 fallback**，挂在 Top Events 列表底部「More from OmenX」分组里，避免一刀切丢失原有信息密度。或者直接删 — 见问题。

## 文件改动

**新增**
- `src/components/home/HomeGreeting.tsx` — 问候 + `+` 按钮
- `src/components/home/HomeSearchBar.tsx` — 搜索入口（跳转式）
- `src/components/home/HomeTournamentsRail.tsx` — 横滑色块卡
- `src/components/home/HomeTopEvents.tsx` — Top Events 标题 + Live 开关 + 分类 chips + 卡片列表
- `src/components/home/HomeMatchCard.tsx` — 比分赔率式事件卡（D 类）

**修改**
- `src/pages/MobileHome.tsx` — 重排为 v3 组合
- `.lovable/memory/features/home-page-purpose.md` — 更新结构描述
- `.lovable/memory/index.md` — 增加 D 类卡引用

**保留不动**
- `MarketCardB`、`HomeMarketsSections`（看问题决定是否在底部复用）
- `OnboardingCard`、`PositionAlertCard`、`TrialCallout`、`HomeStatusStrip`

## 实施前需要确认的 4 个问题

1. **Tournaments 卡片封面**：纯色/渐变色块（极简、与现有设计语言一致）vs 加抽象插画/几何图形（更接近参考图氛围）？
2. **Live 开关默认值**：默认开（强调实时感）vs 默认关（信息更全）？
3. **比分卡左右块点击**：直接跳 `/trade?side=yes|no` 预选下注边（转化最强但有点激进）vs 跳事件详情让用户自选（更稳）？
4. **底部要不要保留 v2 的三段式 `HomeMarketsSections`** 作为「More markets」？保留 = 信息密度高；删 = 与 Top Events 重复，更克制。
