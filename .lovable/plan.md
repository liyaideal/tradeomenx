# Resolved 列表改版 Plan (H + G + J)

## 目标
让 `/resolved` 与 `/` (Active) 在视觉语言上完全统一，同时保留 Resolved 自身的"档案"气质，并新增"我的已结算"快速视图。

---

## 1. 统一卡片语言 (Direction H)

复用 Active 的 **MarketCardB** 视觉骨架（分类背景图 + 圆角 + border hover + 分类徽章），但内容字段改为结算语义：

**卡片内容（约 ≈140px 高）：**
- 顶部：分类徽章 + Settled 日期（右上角小字）
- 中部：事件标题（2 行截断）
- 底部行：
  - 左：`✓ {winningOptionLabel}` (text-success)
  - 右：Volume（`font-mono`），用户参与过则显示 PnL chip（`+$120` 绿 / `-$45` 红）

**响应式：**
- Desktop: `grid-cols-2 lg:grid-cols-3`
- Mobile: `grid-cols-1`

**移除：** `ResolvedEventCard.tsx`（被新卡片取代）

---

## 2. All / Mine 切换 (Direction G)

在 `ResolvedFilters` 之上新增一个 **EventTabs 风格**的切换：

```text
[ All Resolved ]  [ My Settled ]
```

- **All**（默认）：展示所有已结算事件
- **Mine**：仅展示 `userParticipated === true` 的事件，按 `settled_at` desc 排序
- 未登录用户点 Mine → 触发现有登录流程（复用 `useAuthGate`）
- 状态：`viewMode: "all" | "mine"`，URL query `?view=mine` 可分享

---

## 3. 时间分组头 (Direction J)

在卡片网格之上插入 sticky 分组标题，按 `settled_at` 归档：

```text
THIS WEEK              (12)
[card] [card] [card]
...

EARLIER THIS MONTH     (28)
[card] [card] [card]
...

OCTOBER 2025           (47)
...
```

**分组规则：**
- `This Week`（近 7 天）
- `Earlier This Month`（本月剩余）
- 之后按 `MMMM YYYY` 分组（如 `October 2025`）

**样式：** `text-xs uppercase tracking-wider text-muted-foreground`，右侧括号显示数量，与 Active 的章节头风格一致。

---

## 文件改动

**新建：**
- `src/components/resolved/ResolvedMarketCard.tsx` — 复用 MarketCardB 骨架的结算卡片
- `src/components/resolved/ResolvedViewToggle.tsx` — All / Mine 切换
- `src/components/resolved/ResolvedGroupedGrid.tsx` — 按时间分组渲染网格
- `src/lib/resolvedGrouping.ts` — `groupBySettledAt(events)` 工具函数

**修改：**
- `src/pages/ResolvedPage.tsx`
  - 新增 `viewMode` state + URL 同步
  - 未登录点击 Mine → `useAuthGate`
  - `events.filter(e => viewMode === "mine" ? e.userParticipated : true)`
  - 渲染 `<ResolvedViewToggle />` + `<ResolvedGroupedGrid />`

**删除：**
- `src/components/ResolvedEventCard.tsx`

**不变：**
- `useResolvedEvents.ts`、Detail 页、`ResolvedFilters`、Share / Settlement banners、数据库 schema

---

## 技术细节

- 卡片骨架直接 import / 抽 `MarketCardB` 的样式 token（分类背景、border、hover），避免重复定义
- 分组函数纯客户端计算，基于已过滤后的 `events`
- Mine 视图为空时显示空态：`You haven't settled any markets yet.` + CTA → `/`
- 字段命名遵循 memory：`camelCase` on-chain，`Title Case` 标题，`font-mono` 数字与金额

---

## 验收

1. Desktop `/resolved` 卡片网格与 `/` Active 视觉一致
2. Mobile 单列卡片，节奏与 Active mobile 一致
3. All / Mine 切换工作，URL 可分享
4. 时间分组头正确显示，sticky 滚动友好
5. 未登录点 Mine 正确触发登录
