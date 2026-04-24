

## /hedge 移动端排版优化方案

### 一、当前移动端的 7 个核心问题

**1. Hero 字号过大 + 卡片占满整屏**
- `text-4xl`（36px）标题在 375px 宽屏会断行 4-5 行，吃掉一屏 60% 高度
- 右侧 demo 卡片在移动端从 Hero 下方再叠两张大卡，单屏 Hero 总高 ≈ 1100px，用户要滑 3 屏才能离开 Hero
- "Live stats bar" 用 flex-wrap 在窄屏堆成 3 行，每行高 28px，没有视觉压缩

**2. Hero CTA 被推到屏幕外**
- 卡片在 CTA 下面，用户看到的第一屏是「标题 + 副标题」，CTA 完全不可见
- 移动端转化漏斗在第一屏就断

**3. RecentActivity ticker 在移动端文字被截**
- "Live" 标签在 sm 以下隐藏（正常）
- 但每条 item 还是横向 nowrap，font-size `text-xs`（12px），edge mask 12px 太窄遮不住断字
- 滚动速度 50s 在窄屏看起来太慢（每条要 4-5 秒过去）

**4. HowItWorks 移动端竖排但视觉很弱**
- 三个数字 `0X` 用 `text-5xl primary/30`，在窄屏占满半行，但下面 title + body + note 又把节奏拖长
- 每步之间只有一个 `ArrowDown h-5 w-5`（20px）灰色箭头，连接感弱
- 三步加起来在 mobile 占 ≈ 700px 高度

**5. LiveExample 三栏横向布局在移动端崩**
- `md:grid-cols-[1fr_auto_1fr]`，在移动端变成「卡 → 箭头 → 卡」垂直堆叠
- 中间箭头 `py-2`（8px）太挤，两张大卡贴在一起
- 下面 Scenario A/B 在 mobile 是单列，每张卡 `p-6` 太厚
- testimonial figure `p-6` + `text-base/lg` 在 mobile 显得臃肿，figcaption 用 `justify-between` 在窄屏被压成两行错位

**6. FoundersNote 侧栏在移动端变成超宽卡**
- `md:grid-cols-[1fr_auto]` 移动端塌成单列，aside 的 3 个链接每个占满整宽，看起来像 nav 菜单不像信任 sidebar
- 文章正文 `text-sm` + 4 段，在窄屏显得密集

**7. KeyRules / FAQ / FinalCTA / FloatingCTA 的细节**
- KeyRules accordion 触发器在 mobile 字号 `text-sm` + `pl-8` content 缩进还行，但 `px-5` 内边距偏大
- FinalCTA 的 `text-3xl` 标题 + `text-base` 副标题 + `p-8` 内边距，在 mobile 整块卡 ≈ 380px 高
- FloatingCTA `py-3` + 没有安全区适配（iOS 底部有 home indicator）会被遮挡
- 通用：所有 section 在 mobile 都用 `py-16`（64px 上下），8 个 section 累加 1024px 纯空白

---

### 二、修改方案（仅动移动端，桌面端不受影响）

#### A. HedgeHero — 重排第一屏，让 CTA 上屏

- 移动端缩小标题：`text-3xl`（30px），保持 `md:text-6xl`
- 副标题缩为 `text-sm`，移动端 `mt-3`（桌面端 mt-5 不变）
- **关键调整：移动端把右侧 demo 卡换成单张水平合并卡 + "swipe arrow"**，高度从 ≈ 460px 压到 ≈ 180px
  - 新的移动端版本：一张 card 内左右分两栏，左 Polymarket（缩小）右 OmenX（缩小）+ 中间 ArrowLeftRight 图标
  - 桌面端继续保留原来的双卡上下浮动动画（用 `hidden md:block` / `md:hidden` 切换两套布局）
- Live stats bar：移动端改成 1 行 3 列等分（`grid grid-cols-3 divide-x divide-border/40 text-center`），数字在上、label 在下，紧凑且对齐
- Inline trust 行：缩到 `text-[11px]`，移动端只保留 "EIP-712 read-only · View on-chain audit →"，砍掉中间一项
- Section 上下 padding：`py-10 md:py-24`（从 64px 压到 40px）
- **CTA 顺序**：移动端用 `order` 类把 CTA 放在 demo 卡之前，确保第一屏可见 CTA

#### B. HedgeRecentActivity — 移动端紧凑滚动

- 整条 padding `py-2 md:py-2.5` 不变
- 滚动速度移动端加快到 30s（`md:animation-duration: 50s`）
- Edge mask 宽度从 `w-12` 改为 `w-8 md:w-12`
- 每条 item 之间 gap 从 `gap-6` 改为 `gap-4 md:gap-6`，文本不变
- 移动端隐藏 emoji-like dot separator 已经做了（`text-border ·`），保留

#### C. HedgeHowItWorks — 移动端改紧凑垂直时间线

- 移动端：左侧用一根 `w-px bg-border` 垂直线 + 圆形数字徽章（`h-9 w-9 rounded-full bg-primary/10 text-primary font-mono text-sm`），右侧文字
- 把 `0X` 大数字（5xl）只在桌面端保留；移动端改成上述徽章样式
- Title `text-base font-semibold`，body `text-sm text-muted-foreground`，note 一行内嵌
- Section padding：`py-12 md:py-24`
- 三步总高度从 ≈ 700px 压到 ≈ 380px

#### D. HedgeLiveExample — 移动端关键瘦身

- Position pair：移动端两张卡 padding 从 `p-6` 改为 `p-4`，font 从 `text-lg` → `text-base`
- 中间 `ArrowLeftRight` 改成横向短分隔线 + arrow，垂直方向 `py-1`
- Scenario A/B：mobile 强制单列已是默认，但 padding `p-6` → `p-4`，title `text-base` → `text-sm`
- Testimonial figure：mobile `p-4` + `text-sm`，figcaption 改为垂直堆叠（mobile `flex-col items-start gap-1`，桌面 `md:flex-row md:justify-between md:items-center`）
- Section padding `py-12 md:py-24`
- 两个 grid 之间间距 `mt-6 md:mt-10`

#### E. HedgeFoundersNote — 移动端侧栏改横排紧凑链接

- 移动端：把 aside 改为一行 3 个等宽小图标按钮（Discord / X / Audit），高度 ≈ 56px
  - `grid grid-cols-3 gap-2`，每个按钮垂直堆 icon + label 两行
- 桌面端继续保留竖排 sidebar（`md:flex md:flex-col`）
- 正文段落 `text-sm leading-relaxed`，移动端不动；treasury 地址行加 `break-all` 避免溢出
- Section padding `py-12 md:py-20`

#### F. HedgeKeyRules — 移动端 accordion 紧凑

- AccordionItem `px-5` → `px-4 md:px-5`
- AccordionTrigger 内的 `text-sm` 改 `text-[13px] md:text-sm leading-snug`
- Group legend 在移动端改为 `text-[11px]`，gap-3
- Section padding `py-12 md:py-24`
- Risk disclaimer details：mobile `px-4`

#### G. HedgeSocialProof — 移动端横向滑动

- 移动端把 `grid md:grid-cols-3` 改为横向滚动条：`flex overflow-x-auto snap-x snap-mandatory gap-3 -mx-4 px-4 pb-2`，每张卡 `min-w-[280px] snap-start`
- 减少视觉堆叠（避免 3 张卡上下排 ≈ 600px）
- 桌面端继续 grid-cols-3
- Section header：移动端 "See more on X →" 链接保持 `hidden sm:inline`（已有）

#### H. HedgeFAQ — 紧凑

- Section padding `py-12 md:py-24`
- AccordionTrigger `text-base` → `text-sm md:text-base`，`py` 减小
- Item `px-5` → `px-4 md:px-5`

#### I. HedgeFinalCTA — 移动端瘦身 + 给 FloatingCTA 留出空间

- 内部卡 padding `p-8` → `p-6 md:p-14`
- 标题 `text-3xl` → `text-2xl md:text-5xl`，移动端用 `leading-tight`
- 副标题 `text-base` → `text-sm md:text-lg`
- Section padding `py-12 md:py-24`
- **底部加 `pb-24 md:pb-24`** 避免被 FloatingCTA 遮挡

#### J. HedgeMobileFloatingCTA — 安全区适配

- 容器加 `pb-[max(0.75rem,env(safe-area-inset-bottom))]`，避免 iOS 底部 home indicator 遮按钮
- 高度更紧凑：`py-3` → `py-2.5`
- 加细微阴影 `shadow-[0_-4px_12px_rgba(0,0,0,0.3)]` 与背景区分

#### K. HedgeLanding — 给主区域加 padding-bottom

- `<main className="flex-1 pb-20 md:pb-0">` 让最后一个 section 不会被 FloatingCTA 完全压住

---

### 三、文件改动清单

| 文件 | 改动 |
|---|---|
| `HedgeHero.tsx` | 标题字号、demo 卡移动端版本、stats bar 网格、CTA 顺序、padding |
| `HedgeRecentActivity.tsx` | 移动端 marquee 加速、edge mask 缩窄、gap |
| `HedgeHowItWorks.tsx` | 移动端改垂直时间线（徽章 + 左线），桌面端不变 |
| `HedgeLiveExample.tsx` | 卡 padding/font 缩小、testimonial figcaption 移动端竖排 |
| `HedgeFoundersNote.tsx` | 移动端 sidebar 改 3 等分横排、treasury `break-all` |
| `HedgeKeyRules.tsx` | accordion px/font 缩小、disclaimer padding |
| `HedgeSocialProof.tsx` | 移动端改横向 snap-scroll，桌面 grid 不变 |
| `HedgeFAQ.tsx` | accordion padding/font 紧凑 |
| `HedgeFinalCTA.tsx` | 内部卡瘦身 + pb-24 给 FloatingCTA |
| `HedgeMobileFloatingCTA.tsx` | safe-area padding + 阴影 |
| `HedgeLanding.tsx` | main 加 `pb-20 md:pb-0` |

### 四、不改动

- 桌面端布局（所有 `md:` 之后样式保留原值）
- 文案（除 Hero 移动端 inline trust 简化为 2 项）
- HedgeCTAButton 内部逻辑、HedgeMobileFloatingCTA 显示触发逻辑
- 动画 keyframes（hedge-float / hedge-marquee）
- section 顺序

### 五、预期效果

- Hero 第一屏（375×667）能看到：badge + 标题 + 副标题 + CTA + stats bar，CTA 立刻可点
- 全页移动端总高度从 ≈ 5800px 压到 ≈ 4200px（-28%），滑动疲劳明显改善
- iOS 底部 home indicator 不再遮挡 FloatingCTA
- HowItWorks / LiveExample / FoundersNote 三个原本"桌面思路移植到移动"的 section 现在有专门的移动布局，告别"塌陷感"

