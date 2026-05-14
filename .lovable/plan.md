## Home 重新定位 v2 — 新用户转化优先

### 一句话定位

Home 不是 dashboard，也不是 feed。Home 是**新用户漏斗的第一站**，目标按优先级：
1. Guest → 想注册（看到具体事件、看到大家在押什么、看到赔率，"哦原来是干这个的"）
2. Authed 无首单 → 下首单（降低选择成本，告诉他"押这个就行"）
3. Authed 已首单 → 让他知道有更多可逛的（顺带兼容，不是主战场）

> 已活跃交易者的需求（PnL、持仓管理）由 Portfolio 承担，不抢 home 的版面。

---

### 三个版本的首屏结构

所有版本共享同一套**紧凑事件卡**（不要大封面）。差异在头部和顶部模块。

#### A. Guest

```text
[Header: logo + Discord/Lang/Bell]

┌─────────────────────────────────────┐
│ Predict what happens next.          │  ← 1 行 hero copy（不到 20 字）
│ Trade real-world events on-chain.   │
│ [ Browse markets → ]  [ Sign in ]   │  ← 双 CTA，主按钮无需注册即可看
└─────────────────────────────────────┘

Live now · 28 markets                    ← section label，带实时计数

┌─ Politics ──── 142 traders ──────────┐
│ Will Trump pardon SBF before 2027?   │
│ Yes 23¢  No 77¢   ~~~~~~~~  $48k vol │  ← sparkline + 量
└──────────────────────────────────────┘
┌─ Crypto ───── closing in 4h ─────────┐
│ BTC > $120k by end of week?          │
│ Yes 61¢  No 39¢   ~~~~~~~~  $112k    │
└──────────────────────────────────────┘
… 4-6 张

[ See all 200+ markets → ]

──────────────────────────────────────
Why OmenX                              ← 简短价值主张，3 行
• Settled on-chain, not by us
• Trade with leverage, not just yes/no
• Free $10 trial, no deposit required
──────────────────────────────────────

[SEO Footer]
```

**Equity 模块**：去掉。
**Campaign**：去掉顶部 carousel；如果运营有强诉求，作为一张普通 feed 卡夹在事件卡之间（同样紧凑卡形态，左上 tag 显示 "Campaign"）。

---

#### B. Authed · 无持仓（含 onboarding 未完成）

```text
[Header]

[ Equity 紧凑条 — 一行：$10.00 trial · Deposit → ]

┌─ Onboarding · 1/3 ───────────────────┐  ← 仅 onboarding 未完成时显示
│ Place your first trade   →           │  ← 紧凑 tier-1 卡（已有）
│ ▰▱▱                                  │
└──────────────────────────────────────┘

Pick your first prediction               ← section label，引导语

[ 4-6 张紧凑事件卡，同 guest ]

[ Browse all markets → ]

[Campaign 卡（降级版，普通卡形态，可滑过）]
```

**关键**：第一张事件卡可以是「Suggested · 适合新手」标签，其他保持中性。

---

#### C. Authed · 已有持仓

```text
[Header]
[ Equity 条 ]

Your positions · 2                       ← 只显示 1-2 张精简 position 卡
[ position card 1 ]
[ position card 2 ]
[ View all → ]

More to explore                          ← 主体仍是事件卡
[ 4-6 张紧凑事件卡 ]

[Campaign 卡降级版]
```

> 不为这个状态做特殊设计。事件卡 + 持仓简略 = 够用。

---

### 紧凑事件卡规范（核心组件）

固定高度 ~84-92px，移动端单列。

```text
┌────────────────────────────────────────────┐
│ [Politics]  142 traders · Closes in 3d     │  10px 元信息行
│ Will Trump pardon SBF before 2027?         │  14px 标题，1-2 行 line-clamp
│ Yes  23¢  ~~~~~~     No  77¢  ~~~~~~       │  双价格 + 各自 sparkline
└────────────────────────────────────────────┘
```

- 左上：category chip（小色块）+ 元信息（trader 数、剩余时间）
- 标题：sentence case，1 行优先，最多 2 行
- 数据行：双价格（Yes/No 或两个最大 option）+ 各自 16px sparkline
- 整张可点 → `/trade?event=...`
- 按压反馈：复用 `FeedCard` 的微动画
- 二元事件特殊处理：保持现有 Yes-only 模型展示（按 memory 规则）

**与现有 `MarketCardB` 的关系**：尽量复用同一个底层卡，避免重复维护。如果 `MarketCardB` 太重就在 home 单独做一个 `HomeMarketCard`，但样式 token 共享。

---

### Campaign 降级方案

不再独占顶部 carousel。改为：
- **Guest**：完全不出现在 home（运营活动通过专属 landing 页/横幅外部分发）
- **Authed**：变成事件流中夹的一张「Campaign 卡」，紧凑高度同事件卡，左上 tag 写「Campaign」+ 渐变描边区分。一次只插一张，位置在第 3 张事件卡之后。可滑过即收起（localStorage 记忆）。

> 这样 campaign 不消失，但失去抢首屏的特权，对应你说的「过于显眼」。

---

### 拆掉 / 改造的现有模块

| 模块 | 改动 |
|---|---|
| `HomeStatusStrip` | guest 版去掉；authed 版保留但更紧凑（一行） |
| `CampaignBannerCarousel` 在 home 顶部 | 去掉，改为 feed 中插卡 |
| `HomeFeed`（priority-sorted 混合流） | 拆解：顶部 hero/onboarding/positions 各自独立，主体只剩**事件卡列表**，scoring 简化 |
| Tier 1 呼吸光、未读红点（Step 3 刚做的） | 仅在 onboarding/position 这类残留 tier-1 卡上保留 |
| Sparkline | 升格为事件卡标配，不再只是 watchlist/trending 的点缀 |

---

### useHomeFeed → useHomeMarkets

排序逻辑大幅简化，不再混合多种 kind：

- 输入：所有活跃 events
- 排序信号（按权重）：
  1. 24h volume（社会证明）
  2. 距离结算时间适中（24h-7d 优先，过短/过长降权）
  3. 用户 watchlist 内的优先（authed 时）
  4. 类别多样性（避免连续 4 张都是 crypto）
- 输出：6-8 张事件，移动端可向下滚加载

Onboarding/position/welcome-back 这些**非市场卡**从 feed 流剥离，挂在固定位置。

---

### 文件影响（粗略清单）

**新增**
- `src/components/home/HomeHero.tsx` — guest 版 hero
- `src/components/home/HomeMarketCard.tsx` — 紧凑事件卡（如果决定不复用 MarketCardB）
- `src/components/home/HomeMarketList.tsx` — 拉数据 + 排序 + 渲染列表
- `src/hooks/useHomeMarkets.ts` — 替代部分 useHomeFeed
- `src/components/home/HomePositionsSummary.tsx` — Authed C 版的持仓简略

**改造**
- `src/pages/MobileHome.tsx` — 三状态分支
- `src/components/home/HomeStatusStrip.tsx` — 紧凑化、guest 隐藏
- `src/components/home/HomeFeed.tsx` — 大幅瘦身或拆掉
- `src/components/campaign/CampaignBannerCarousel.tsx` — 不在 home 用，新增 `CampaignFeedCard.tsx`

**保留**
- 所有 tier-1 卡（OnboardingCard/PositionAlertCard/WelcomeBackCard）
- Step 3 视觉打磨（呼吸光、按压反馈、Sparkline 组件）

---

### 不在本轮做

- 桌面 Home — 等移动端定型再对齐
- 个性化推荐（基于 watchlist 的 ML 排序）— 第一版用规则
- "为新手挑选的事件"算法 — 第一版用 hardcoded label

---

### 接下来需要你确认的两件事

> 这些写在 plan 里，**等你 approve plan 后我会再问一次再开工**：

1. **Hero CTA 主按钮是 "Browse markets"（无需注册先看） vs "Try a $1 prediction"（直接给 demo 体验）？**
   两条路都可，前者门槛低、后者粘性强。
2. **紧凑事件卡是新建 `HomeMarketCard` 还是改造复用 `MarketCardB`？**
   memory 里有「卡片风格隔离」约束，倾向新建，但想跟你确认是不是觉得视觉上 home 卡和 events 列表卡可以/应该长得一样。
