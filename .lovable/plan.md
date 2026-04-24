

## /hedge 页面 Header & Footer 规范修复

### 现状问题

**1. Header（`HedgeNavbar.tsx`）严重违规**
- 全站规范：所有桌面页面必须用 `<EventsDesktopHeader />`（Logo + 主导航 Events/Resolved/Portfolio/Insights/Leaderboard + 语言/Discord/Equity/Profile）
- 现状：`/hedge` 用了一个自定义的极简 navbar，只有 Logo + "Events" + "Sign In"，与 `/events`、`/portfolio` 等页面完全不一致
- 移动端也缺少 `MobileHeader`

**2. Footer（`HedgeFooter.tsx`）严重违规**
- 全站规范：所有内容/营销页面必须用 `<SeoFooter />`（5 列布局：Brand + Platform + Learn More + Legal + Connect + 底部版权 + 风险提示）
- 现状：用了一个自定义极简 footer，只有 Logo + X/Telegram + Terms/Privacy
- 社交链接还指向了错误的账号（`x.com/omenxfi` vs 规范的 `x.com/OmenX_official`）

**3. DESIGN.md 缺失 Footer 规范** — 当前只有零散的 SeoFooter 实现，没有正式列入设计文档

---

### 改造方案

#### A. 替换 /hedge 的 Header 和 Footer

**文件**：`src/pages/HedgeLanding.tsx`
- 移除 `HedgeNavbar` 引用，改用 `EventsDesktopHeader`（桌面）+ `MobileHeader`（移动端，showLogo + 标题 "Hedge-to-Earn"）
- 移除 `HedgeFooter` 引用，改用 `SeoFooter`
- 用 `useIsMobile()` 区分两端，参考 `SeoPageLayout` 的写法

**清理**：删除 `src/components/hedge/HedgeNavbar.tsx` 和 `src/components/hedge/HedgeFooter.tsx`（无其他引用）

#### B. 在 DESIGN.md 补充 Footer 规范

在 `## 16.5 全站统一 Footer 规范（Site-wide Footer）` 新增章节，内容：

- **唯一 Footer 组件**：`<SeoFooter />`（位于 `src/components/seo/SeoFooter.tsx`），所有内容页、营销页、详情页（如 /hedge、/about、/faq、/transparency、/glossary 等）必须使用
- **桌面端 5 列网格布局**：Brand（Logo XL + 60 字描述）/ Platform / Learn More / Legal / Connect
- **移动端**：Brand 区 + 链接折叠手风琴（Accordion）+ Connect 常驻
- **官方社交链接**（不允许任何页面自定义）：
  - X：`https://x.com/OmenX_official`
  - Discord：`https://discord.gg/AZwP5qtK`
  - Email：`support@omenx.com`
- **底部栏**：版权 + 风险提示（"For informational purposes only. Not financial advice."）
- **样式 token**：`border-t border-border/30 bg-card/50 mt-auto`，内容容器 `max-w-7xl mx-auto px-6 py-10`
- **禁止**：
  - 任何页面创建自定义 footer 组件
  - 在 footer 中使用未列入官方账号的社交链接
  - 跳过风险提示行

#### C. StyleGuide 增加 Footer 规范展示

**文件**：`src/pages/StyleGuide/sections/CommonUISection.tsx`
- 在已有的 `DesktopNavigationSection` 之后新增 `SiteFooterSection` 子组件
- 直接渲染 `<SeoFooter />` 实例预览
- 列出 5 列结构表格、社交账号清单、移动端 Accordion 行为、引用方式（`import { SeoFooter } from "@/components/seo/SeoFooter"`）
- 用 `<CodePreview>` 展示标准引用代码

---

### 不改动

- 不改 `/hedge` 页面的中间内容（Hero、HowItWorks、Banner、FAQ、CTA 等）
- 不改 `HedgeMobileFloatingCTA` 的悬浮 CTA 行为
- 不改 `SeoFooter` 本身的实现（已经是规范）
- 不改 `EventsDesktopHeader` 本身

### 预期效果

- `/hedge` 页面的导航/页脚与 `/events`、`/portfolio`、`/about` 等其它页面完全一致
- 用户在登录后能直接看到 Equity 余额和 Profile 入口（之前 HedgeNavbar 没有）
- DESIGN.md 拥有完整的 Footer 规范条款，未来不会再出现自定义 footer 散落各处
- StyleGuide 有可视化的 Footer 章节供 review

