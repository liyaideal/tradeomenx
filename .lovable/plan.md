# 首页整体紧凑化方案

目标：让 My positions / Hot markets / Settlement 全部回到 Robinhood / Revolut 的"高密度 + 节奏感"，整体页面纵向高度下降约 30–35%。当前问题不是局部，是所有 section 的 padding / 字号 / 行数都偏大。

---

## 1. SectionHeader（更轻、更收）

当前：`mb-2.5 + pb-2 + border-b`，icon chip `h-6 w-6`，title `text-sm`，整体约 36px。
改为：
- 去掉底部 `border-b` 和 `pb-2`（边线让位置感更松，紧凑布局不需要）
- 容器：`mb-2 flex items-center justify-between gap-2`
- icon chip：`h-5 w-5 rounded`，icon `h-2.5 w-2.5`
- eyebrow：`text-[9px] tracking-[0.16em]`
- 中点分隔符去掉（直接 eyebrow + title 同行，gap-1.5）
- title：保持 `text-sm font-semibold`
- action：`text-[10px]`，ChevronRight `h-3 w-3`

整体高度从 ~36px → ~22px。

---

## 2. My positions 横向卡片（重点修复）

当前每张卡：`w-[260px] p-3.5 space-y-2.5`，标题 `text-sm` 两行，badge + 文案一行，分隔线 + Unrealized/ROI 双列大字 `text-base`，整体高度 ~140px。

改为单层、无分隔线、信息收敛：

```text
┌─────────────────────────────┐
│ SOL Weekly Performance      │  ← text-[13px] font-medium，line-clamp-1
│ ● Short · Up >5%            │  ← 小圆点彩色 + text-[11px] muted
│                              │
│ +$6.32        +79.0%        │  ← 同行，font-mono text-[15px] semibold
│ Unrealized       ROI        │  ← text-[9px] uppercase muted
└─────────────────────────────┘
```

- 卡尺寸：`w-[220px] p-3 space-y-2`
- 圆角：`rounded-xl`（从 2xl 收一档）
- 去掉 Badge 组件，改成 `●` 彩色小圆点 + 文字（节省一整行）
- 去掉 `border-t pt-3` 分隔线
- 数字行 + 标签行交换顺序：数字大字在上，label 小字在下（更像 Robinhood 持仓）
- 横向 gap：`gap-2.5`（从 3）

整卡高度：~140px → ~96px。

---

## 3. Hot markets 卡片（紧凑化）

当前：`trading-card p-4 space-y-3`，标题 + Badge + Trade 按钮一组，下面横向 option chip（`min-w-[100px] p-2.5`），再下面 Volume + 倒计时一行。整体 ~150px/卡 × 4 = 600px。

改为两行布局，去掉冗余 option chip：

```text
┌───────────────────────────────────────────────┐
│ Crypto · 12h 30m                              │  ← eyebrow
│ Will BTC close above $100k this week?  [Trade]│  ← title text-[13px]
│ ─────────────────────────────────────────────│
│ Yes 0.62  ·  No 0.38      Vol $1.2M           │  ← 单行内联价格 + 量
└───────────────────────────────────────────────┘
```

- 卡 padding：`p-3`，`space-y-2`
- 顶行：eyebrow `text-[10px] uppercase muted`（category · countdown 合并成一条 meta，不再用 Badge 占独立行）
- 标题：`text-[13px] font-medium line-clamp-1`，Trade 按钮 `h-7 px-2.5` 右侧对齐
- 把 option 价格压缩成一行内联：`Yes 0.62 · No 0.38`，二元事件就两个；多 option 时 `truncate` + `+N more`
- Volume 和价格共享同一行，去掉 BarChart3 / Clock 图标（meta 已含倒计时）

每卡 ~150px → ~78px。4 张总高 ~600 → ~340px。

外层 `space-y-3` → `space-y-2`。

---

## 4. Settlement 卡片

复用 Hot markets 的紧凑布局，但保留 `border-trading-yellow/30` 高亮 + 黄色倒计时。
- padding `p-3`，single 卡（settlementSoon.slice(0,1)）。

---

## 5. HomeDiscover 节奏

- 外层 `space-y-6` → `space-y-5`
- 三个 section 之间不再需要分隔线（SectionHeader 自带视觉边界 + icon chip 已经分区）

---

## 6. MobileHome 主轴

- `<main>`：`px-4 pt-3 pb-2 space-y-4`（pt-4 → pt-3，space-y-5 → space-y-4）

---

## 不改动

- HomeAccountHub 激活卡（上轮已重构）
- HomeMore（上轮已重构）
- HomeActionAlerts、CampaignBannerCarousel
- 所有业务逻辑、数据源、路由、颜色 token

---

## 文件变更清单

- `src/components/home/SectionHeader.tsx`
- `src/components/home/HomeDiscover.tsx`
- `src/pages/MobileHome.tsx`

预期效果：首屏可见 section 数量从 1.5 个 → 2.5 个，整页可滚距离下降 ~30%。
