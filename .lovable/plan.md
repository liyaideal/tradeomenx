

## 重做 H2E Banner — 高冲击力三段式布局

参照新参考图重做 `HedgeEntryBanner.tsx`，采用 **左 / 中 / 右** 三段式叙事结构，强化视觉冲击力和点击欲望。**不动文案核心信息**，只重构视觉层次和构图。

### 桌面端布局（三段式横向叙事）

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [LIMITED FUND] [INDUSTRY FIRST]                                              │
│                                                                              │
│ MARKETS MOVE FAST.       │  [Hero Image — 全高度]   │  EARN UP TO            │
│ DON'T GET REKT.          │                          │  $100                  │
│                          │                          │  PER ACCOUNT·ZERO COST │
│ We'll hedge your exposed │                          │                        │
│ positions — for FREE.    │                          │  ┌──────────────────┐  │
│ First come, first served.│                          │  │ ⏰ LIMITED SPOTS  │  │
│                          │                          │  │ 231 / 1,000      │  │
│ [Get My Free Hedge →]    │                          │  │ ▰▰▰▱▱▱▱▱▱▱       │  │
│                          │                          │  └──────────────────┘  │
│ 🛡 ZERO COST  ⚡ INSTANT  │                          │  Don't miss out.       │
│   No catch.   Sleep better                          │                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

**关键升级**：
- **左段：Headline 双行强对比** — 第一行 `MARKETS MOVE FAST.`（白色），第二行 `DON'T GET REKT.`（紫色 `text-primary`），两行都用 `text-3xl lg:text-4xl font-black tracking-tight`，营造广告位级别的冲击感
- **左段：底部 3 个 micro-trust** — 用 Lucide `ShieldCheck` / `Zap` / `Lock` + 标题 + 单行说明（`ZERO COST / No catch.`、`INSTANT HEDGE / Sleep better.`、`YOU KEEP PROFITS / We cover the downside.`），呼应参考图底部小图标行
- **中段：Hero 图全高占位** — 现有 `hedge-banner-hero.png` 拉满到 banner 全高（`h-full`），不再 aspect 限制，去掉外层 `ring` 和 `shadow`，用 `mask-image` 做边缘渐隐，让图与背景无缝融合
- **右段：垂直三层信息** — 上层 `EARN UP TO $100` 大字、中层「Limited Spots Left 231/1000 + 进度条」卡片（紫框 + `Clock` 图标 + `Progress` 组件，营造稀缺感）、底层手写感 `Don't miss out.`（用 `italic font-semibold text-primary`）
- **背景增强**：保留紫色 glow，再加一个左侧红色 glow（`bg-destructive/10`）和右侧绿色 glow（`bg-success/10`），呼应参考图「红仓→绿对冲」的色彩叙事

### 移动端布局（垂直紧凑版）

```text
┌─────────────────────────────┐
│  [Hero Image — full bleed]  │
│  [LIMITED FUND][IND. FIRST] │  ← 叠加在图左上
│                             │
├─────────────────────────────┤
│ MARKETS MOVE FAST.          │
│ DON'T GET REKT.             │
│ We'll hedge — for FREE.     │
│                             │
│ ┌─────────────────────────┐ │
│ │ ⏰ 231 / 1,000 spots    │ │
│ │ ▰▰▰▱▱▱▱▱▱▱              │ │
│ └─────────────────────────┘ │
│                             │
│ [Get My Free Hedge →]       │
└─────────────────────────────┘
```

- 移动端把右侧 `Limited Spots` 进度条卡片下沉到 CTA 上方，强化稀缺感后立即转化
- Headline 缩到 `text-xl`，但保持双色双行对比

### 实现细节

1. **完全重写** `src/components/hedge/HedgeEntryBanner.tsx`
   - props 不变（`variant?: "desktop" | "mobile"`）
   - 用 `Progress` 组件（`@/components/ui/progress`）做稀缺感进度条，硬编码 `value={23}`（231/1000）
   - 用 Lucide `ShieldCheck` / `Zap` / `Lock` / `Clock` / `ArrowRight`，无 emoji
   - 数字用 `font-mono`（`$100`、`231 / 1,000`），Headline 用 `font-sans font-black`
   - `Don't miss out.` 用 `italic` 模拟手写感（不引入新字体）
   - 整卡可点 → `navigate("/hedge")`

2. **不改文案核心信息** — 「Markets move fast. Don't get rekt.」「We'll hedge your exposed positions — for FREE.」「First come, first served.」「Earn up to $100」「Per account · Zero cost」「Limited Spots Left 231 / 1,000」「Don't miss out.」全部按参考图照搬

3. **不动**：
   - `EventsPage.tsx` 和 `MobileHome.tsx` 的 banner 嵌入位置不变
   - `hedge-banner-hero.png` 资源不替换（继续复用）
   - `/hedge` Landing Page 不变

### 设计 Token 遵循

- 主色：`--primary`（紫）
- 警告色：`--warning`（LIMITED FUND 徽标）
- 红色 glow：`--destructive/10`（左侧仓位暴露氛围）
- 绿色 glow：`--success/10`（右侧对冲安全氛围）
- 卡片底色：`bg-card` + `from-card via-card to-primary/5` 渐变
- 边框：`border-primary/30`
- 不引入任何新色

### 验证

- 桌面端 banner 视觉权重明显增强，三段叙事清晰：「左：警告 + CTA」/「中：视觉爆点」/「右：稀缺感 + 奖励」
- 移动端进度条 + 稀缺感数字直接出现在 CTA 上方，转化路径更短
- 整卡点击区域不变，跳 `/hedge`
- 不破坏首页其他模块节奏

