

## H2E Landing Page 实现方案

### 路由 & 文件结构

新增路由 `/hedge`（在 App.tsx 注册，桌面 + 移动统一渲染），新建文件：

```text
src/pages/HedgeLanding.tsx                              主页面入口
src/components/hedge/
  ├── HedgeNavbar.tsx                顶部 Logo + Events + Sign In
  ├── HedgeHero.tsx                  Section 1: Hero + 3 trust badges + 右侧动效卡片
  ├── HedgeHowItWorks.tsx            Section 2: 3-Step
  ├── HedgeLiveExample.tsx           Section 3: BTC 硬编码对冲示例 + Scenario A/B
  ├── HedgeTrustBar.tsx              Section 4: 4 个信任信号
  ├── HedgeKeyRules.tsx              Section 5: Fine Print 6 条
  ├── HedgeFAQ.tsx                   Section 6: 6 题 Accordion
  ├── HedgeFinalCTA.tsx              Section 7: 底部转化兜底
  ├── HedgeFooter.tsx                极简 Footer（复用 SeoFooter 风格但更轻）
  ├── HedgeMobileFloatingCTA.tsx     移动端浮动 CTA bar
  ├── HedgeCTAButton.tsx             复用的 CTA 按钮（带统一点击逻辑）
  └── PolymarketConnectDialog.tsx    从 ConnectedAccountsCard 抽出的连接对话框
```

### CTA 三态行为

`HedgeCTAButton` 内部根据用户状态分发：

| 状态 | 行为 |
|---|---|
| 未登录 | 打开 `AuthSheet` / `AuthDialog`（移动/桌面），登录完成后自动弹连接对话框 |
| 已登录、未连接 Polymarket | 直接在 Landing Page 上弹 `PolymarketConnectDialog` |
| 已连接 Polymarket | `navigate('/portfolio/airdrops')` |

判断依据：`useUserProfile().user` + `useConnectedAccounts().activeAccounts.find(a => a.platform === 'polymarket')`。

### 内容实现细节（按 PRD 1:1）

**Hero**：
- 左侧文案 "Got a Polymarket position?" / "We'll hedge it — for free." + body + CTA + 3 个 trust badges（$0 cost / Read-only access / Up to $100）
- 右侧动效：纯 CSS / Framer Motion 风格（用 Tailwind transitions），一张 Polymarket 仓位卡（"BTC > $100K · YES · $500"）旁边一个 ↔ 箭头连到 OmenX 卡（"BTC > $100K · SHORT · $0 FREE"），整体轻微浮动循环

**How It Works**：3 张卡片（桌面 grid-cols-3，移动垂直堆叠 + 中间向下箭头）。Icon 用 Lucide：`Wallet` / `ScanLine` / `DollarSign`。底部重复 CTA。

**Live Example**：硬编码 BTC > $100K 例子。两张卡左右对比（移动端上下），中间 ↔ 箭头。Scenario A/B 默认全部展开（不做 Tab 切换，PRD 推荐方案）。底部 punchline "You have nothing to lose. Literally."

**Trust Bar**：4 张小卡，桌面 grid-cols-4，移动 grid-cols-2。Lucide 图标：`Lock` / `Coins` / `Layers` / `FileSearch`。

**Key Rules**：6 条 ✅ 列表（用 Lucide `Check` 替代 emoji，符合 mem://design/content-icon-rules），"No hidden terms. No tricks." 收尾 + CTA。

**FAQ**：复用 `@/components/ui/accordion`，6 题，第一条 `defaultValue` 展开。

**Final CTA**：紫色渐变卡片 + headline + CTA + "⚡ Limited H2E Fund — first come, first served"（⚡ 用 Lucide `Zap`）。

**Footer**：极简版 — Logo + Twitter/Discord/Telegram + Terms/Privacy。

### 移动端浮动 CTA

`HedgeMobileFloatingCTA`：仅 `isMobile` 时渲染，使用 `IntersectionObserver` 监测 Hero CTA 是否离开视口；离开后底部 fixed bar 滑入（`bottom-0 z-40`），点击触发同样的 CTA 逻辑。

### 设计 Token 遵循

- 颜色：暗色主题，紫色主色用项目现有 `--primary`（HSL token），不引入新色
- 字体：数字用 `font-mono`（金额、$100、$10K），文案用 `font-sans`
- 卡片：复用 `Card` 组件 + `rounded-xl` + `border-border/40`
- 不使用 emoji 作为 UI 图标，全部改 Lucide React

### 不在本次范围内

- 首页 Hero Banner / Ticker Bar 入口（按你的选择只做 Landing Page 本身）
- 数据埋点（PRD Section 5 的 8 个事件）
- A/B Test 框架
- `?ref=xxx` Agent 归因参数处理（路由会保留 query string，但不解析持久化，留给后续）

### 技术细节

**路由注册**（src/App.tsx）：
```tsx
<Route path="/hedge" element={<HedgeLanding />} />
```
桌面端和移动端共用同一组件，内部用 `useIsMobile` 调整布局；不放进 `ResponsiveLayout` 的 `max-w-md` 容器内 — Landing Page 需要全宽。可在 `HedgeLanding` 组件内部用 `<div className="w-full">` 自管布局。

**抽出 Polymarket 连接逻辑**：把 `ConnectedAccountsCard` 中的连接对话框（input 地址 → 签名 → verify）抽到 `PolymarketConnectDialog.tsx`，原 Settings 页继续复用同一组件，避免逻辑两份。

**AuthSheet 触发**：使用 `useAuthFlowStore` 协调（参见 mem://technical/auth-flow-modal-coordination）。

**完成后状态**：路由 `/hedge` 可访问；CTA 按 3 态正确分发；移动端浮动 bar 工作；现有 Settings → Connected Accounts 不受影响。

### 等你确认

收到「**开始工作**」后我开始 coding。

