

## 在首页加 H2E 运营入口 Banner

参考截图里 "TRUMP LIVE: ..." 那条紫色横幅样式，在 Header 和 Explore Events 标题之间新增一条 H2E 运营入口横幅，桌面端 + 移动端都加，点击直达 `/hedge` Landing Page。

### 视觉设计（对齐参考图）

横向胶囊式 banner，整体复用截图里 TRUMP LIVE bar 的视觉语言：

- 容器：`rounded-xl` + 紫色渐变背景（`bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5`）+ `border border-primary/30` + 轻微 `shadow-primary/10`
- 左侧标签：紫色徽标 `H2E LIVE`（`bg-primary text-primary-foreground` 小药丸 + `Gift` Lucide 图标 + 内置脉冲点 `animate-pulse`）
- 中部主文案（白色加粗）：`Hedge your Polymarket positions — for free`
- 副文案（muted）：`Up to $100 in free trading credit · Read-only access · $0 cost`
- 右侧 CTA：紫色 `Try Hedge-to-Earn →`（`text-primary hover:text-primary-hover` + `ArrowUpRight` 图标），整行可点

### 布局规则

- **桌面端**（EventsPage）：单行排列 — `[H2E LIVE 徽标] [主文案] · [副文案] ...........[CTA →]`，宽度跟随 `max-w-7xl mx-auto px-8`，紧贴 Explore Events 上方
- **移动端**（MobileHome）：两行紧凑排列 — 第一行 `[H2E LIVE] [主文案]`，第二行 `[副文案] [→]`；副文案截断处理；整卡可点
- 暗色主题下文字对比度足够，无新色引入（全用 `--primary` HSL token）

### 实现细节

1. 新增 `src/components/hedge/HedgeEntryBanner.tsx`
   - props: `variant?: "desktop" | "mobile"`（默认按 `useIsMobile` 自动判断）
   - 内部用 `useNavigate` 跳 `/hedge`
   - 用 Lucide `Gift` + `ArrowUpRight`，无 emoji（遵循 `mem://design/content-icon-rules`）
   - 数字/金额用 `font-mono`（"$100" 等），文案用 `font-sans`（遵循排版规范）

2. 在 `src/pages/EventsPage.tsx` 第 279 行的 `<main>` 内、"Page Title" `<div className="relative">` 之前插入 `<HedgeEntryBanner />`

3. 在 `src/pages/MobileHome.tsx` 第 216 行的 `<main>` 内、"Conditional Stats Card" 之前插入 `<HedgeEntryBanner />`

4. 不动 `EventsDesktopHeader`、不动 `MobileHeader`，banner 是独立模块化组件，未来可整体下线

### 不包括

- 不在桌面 Hero 区（截图里 TRUMP 那块）做改动 — 那是另一块运营物料
- 不加埋点、不加倒计时（如果你后面要加 "Limited Fund" 倒计时再说）
- 不改 Settings 里的 H2E 入口 — 此 banner 与 Settings 入口并存

### 验证

- `/` 桌面端：header 下方紧接 banner，再下方是 Explore Events
- `/` 移动端：MobileHeader 下方紧接 banner，再下方是 GuestWelcomeCard / UserStatsCard
- 点击 banner 任意位置 → 跳 `/hedge`
- banner 在两端视觉一致、间距协调，不破坏现有节奏

