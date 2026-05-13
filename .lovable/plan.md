## 目标

把移动端首页从「贴膏药拼装」升级到 Robinhood / Revolut 那种"消费金融的高质感"——大卡片有体量感、字号层级清晰、间距讲呼吸、不靠霓虹光晕。

**不动**：信息架构（4 层）、配色 token、字体、`MobileHeader`、`BottomNav`、`CampaignBannerCarousel`（已自成一体）、`HomeMore`（次级）、业务逻辑。

**动**：激活卡、My positions 横滑卡、分区标题（Hot markets / Settlement soon / My positions / More）、整页节奏。

---

## 1. 全局节奏（`MobileHome.tsx`）

- `<main>` 间距从 `space-y-6` → `space-y-8`，让模块之间真正"分块"。
- 顶部 `py-4` → `pt-5 pb-2`，让激活卡更接近顶部、不悬空。

## 2. 分区标题统一规范（最大视觉收益点）

新建 `src/components/home/SectionHeader.tsx`，所有分区标题走它，结构：

```text
[图标]  EYEBROW · MONO 10PX UPPERCASE TRACKING-WIDEST
        Section Title (text-lg font-semibold tracking-tight)        [more →]
————— 一根 border-b border-border/40 把内容隔出 ————
```

- eyebrow 用 `font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground`
- 图标用 Lucide，外层 `p-1.5 rounded-md bg-{tone}/10`，按分区给颜色 token：
  - Hot markets → `trading-red`（Flame）
  - Settlement soon → `trading-yellow`（Flag）
  - My positions → `trading-purple`（Wallet）
  - More → `muted-foreground`（LayoutGrid）
- 右侧 `more` 按钮：`text-[11px] font-semibold uppercase tracking-wider text-primary`，带 ChevronRight。
- 接入：`HomeDiscover.tsx`、`HomeMore.tsx` 全部换成新组件，删掉各自现写的 h3/h4。

## 3. 激活卡升级（`ActivationHero` / `HomeAccountHub`）

按 Revolut 卡片质感重做，**不改动逻辑**，只调视觉：

- 容器：`rounded-2xl` + 双层背景：底层 `bg-card`，叠一层从 `trading-green/8` 到 `transparent` 的 135° 渐变 + 1px `border-trading-green/25` + 1px `inset ring-white/5`（玻璃感的关键）。
- 顶部 eyebrow 行：绿点 pulse + `MAINNET · ACTIVATION`（mono uppercase tracking-widest，trading-green），右上 `2/3` 用 `font-mono` 在 chip 里。
- 标题：`text-xl font-semibold tracking-tight`，副行 `text-sm text-muted-foreground` 描述当前阶段。
- 余额行：内嵌 `bg-background/40 border border-border/40 rounded-xl`，左侧 `Available balance` 灰色，右侧大数字 `font-mono text-lg`，小数 `.00` 降透明度（Robinhood 经典做法）。
- 步骤项：
  - 已完成：透明度 60%，绿色对勾（实心圆，背景 `trading-green/15`），文字删除线 `decoration-muted-foreground/60`。
  - 当前进行中：单独高亮容器 `bg-trading-green/5 border-trading-green/25`，右侧 CTA 直接做成绿色实心按钮（`bg-trading-green text-background font-semibold`）。
- 行间距 `space-y-2` → `space-y-2.5`。

## 4. My positions 横滑卡升级

当前是 `flex-shrink-0 w-[240px]` 的浅卡片，问题是没有信息密度。新版每张卡：

```text
┌──────────────────────────────────┐
│ SOL Weekly Performance      ⋯    │   ← 标题 + 静音操作点
│                                   │
│  [LONG]  $1,240.00                │   ← chip + 仓位规模 mono
│                                   │
│  PnL                +$185.20      │   ← 灰 label 左 / mono 大数右
│  ───── tiny sparkline ─────       │   ← 用现有 EventSparkline 复用
└──────────────────────────────────┘
```

- 卡片：`w-[260px] bg-card rounded-2xl border border-border/40 p-4 space-y-3`
- 第一行标题 `truncate text-sm font-semibold`
- chip 用 `trading-green-bg/-red-bg` 配 `text-[10px] font-mono uppercase`
- PnL 行 `flex justify-between items-baseline`，数字 `font-mono`，颜色按正负
- sparkline 高度 24px，颜色继承 PnL
- 横滑容器：`-mx-4 px-4 gap-3 snap-x snap-mandatory`，每卡 `snap-start`，移动端体验更顺
- 标题 + "View all" 走第 2 步的 `SectionHeader`

## 5. Hot markets / Settlement soon

只换标题（走 `SectionHeader`）。卡片本身不动（已经在另一个文件，按 `card-style-isolation` 约束不碰）。Loading spinner 加上 mono 提示文字 `LOADING MARKETS…`，避免空白圈。

## 6. HomeMore 升级

两个方块 → 横向单行，更轻：

- `grid-cols-2 gap-3`，每块 `rounded-xl border border-border/40 bg-card p-4 flex items-center gap-3`
- 左侧小图标方块（`p-2 rounded-lg bg-{tone}/10`），右侧两行：标题 + 一行小描述（`Tutorials & guides` / `Earn USDC`）
- 标题走 `SectionHeader`（图标 LayoutGrid，eyebrow `EXPLORE`）

---

## 文件改动清单

| 文件 | 动作 |
|---|---|
| `src/components/home/SectionHeader.tsx` | **新建**，统一分区头组件 |
| `src/components/home/HomeDiscover.tsx` | 接入 SectionHeader；My positions 横滑卡视觉重做 |
| `src/components/home/HomeAccountHub.tsx` | 渐变 + ring + eyebrow + 余额行 + 步骤项视觉升级 |
| `src/components/activation/ActivationHero.tsx` | 配合 HomeAccountHub 同步质感（保留逻辑）|
| `src/components/home/HomeMore.tsx` | 横向单行卡 + SectionHeader |
| `src/pages/MobileHome.tsx` | `space-y-6` → `space-y-8`；`py-4` → `pt-5 pb-2` |

不动：`MobileHeader`、`BottomNav`、`CampaignBannerCarousel`、`HomeActionAlerts`、`tailwind.config.ts`、`index.css`（不引入新 token，用现有 trading-* / card / border / muted）。

---

## 验收点

落地后我会用 mobile viewport 截一张图自查：(1) 激活卡是否像高级金融卡而不是绿色框框；(2) 分区标题是否有节奏感、能一眼分块；(3) My positions 是否信息密度提上来；(4) 整页 scroll 一遍是否呼吸均匀。
