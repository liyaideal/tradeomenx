# OmenX Design System

> Machine-readable design spec. Consult before every UI change.

---

## 1. Brand Identity

- **Product**: OmenX — crypto prediction market platform
- **Theme**: Dark-first, single theme (no light mode)
- **Primary accent**: Purple `hsl(260 60% 55%)`
- **Personality**: Technical, precise, trustworthy — like a Bloomberg terminal for prediction markets

---

## 2. Color Tokens

All colors are HSL values defined as CSS custom properties in `src/index.css`.
Use Tailwind semantic classes (`bg-background`, `text-foreground`, `text-primary`, etc.) — **never** raw hex/rgb.

### Surfaces

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | 222 47% 6% | Page background |
| `--background-elevated` | 222 40% 8% | Elevated surfaces |
| `--card` | 222 35% 10% | Card backgrounds |
| `--card-hover` | 222 35% 12% | Card hover state |
| `--muted` | 222 25% 14% | Muted backgrounds, data row bg |
| `--popover` | 222 40% 9% | Dropdowns, popovers |

### Text

| Token | HSL | Usage |
|-------|-----|-------|
| `--foreground` | 210 40% 98% | Primary text |
| `--muted-foreground` | 215 20% 55% | Secondary text, labels |

### Brand

| Token | HSL | Usage |
|-------|-----|-------|
| `--primary` | 260 60% 55% | Primary actions, active states |
| `--primary-hover` | 260 60% 50% | Primary hover |
| `--primary-muted` | 260 40% 25% | Subtle primary backgrounds |
| `--accent` | 260 50% 45% | Accent elements |

### Trading Semantics

| Token | HSL | Usage |
|-------|-----|-------|
| `--trading-green` | 145 80% 42% | Profit, success, buy/long |
| `--trading-red` | 0 85% 55% | Loss, error, sell/short |
| `--trading-purple` | 260 65% 58% | Brand emphasis |
| `--trading-yellow` | 48 100% 55% | Warnings, alerts, pending |

### Borders

| Token | HSL | Usage |
|-------|-----|-------|
| `--border` | 222 25% 18% | Default borders |
| `--border-subtle` | 222 20% 14% | Subtle dividers |

### Transparency Scenario Accents

| Scenario | Tailwind Color | Usage |
|----------|---------------|-------|
| Merkle / State Root | `emerald-400` | Verified, proof valid |
| Trade Verification | `blue-400` | Trade log matching |
| Liquidation Audit | `amber-400` | Warnings, deviations |
| Funding Rate | `purple-400` | Rate analysis |
| Settlement | `cyan-400` | Oracle, settlement data |

---

## 3. Typography

### Font Stack

- **Sans** (UI text): `Inter` → `font-sans`
- **Mono** (data): `JetBrains Mono` → `font-mono`

### When to Use Each Font

| Content Type | Font | Example |
|-------------|------|---------|
| Labels, headers, descriptions | `font-sans` (Inter) | "Total Profit", "Settings" |
| Prices, amounts, percentages | `font-mono` (JetBrains Mono) | "$0.5500", "12.5%" |
| Addresses, hashes, tx IDs | `font-mono` | "0x3b4e780d12...c6b3bf" |
| Contract field names | `font-mono` | "txHash", "blockNumber" |
| Raw / debug values | `font-mono` | "550000" |

### Typography Components

Use `@/components/typography` instead of raw `<span className="font-mono">`:

| Component | Purpose |
|-----------|---------|
| `<PriceText>` | Currency values with optional sign/color |
| `<PercentText>` | Percentage values with optional sign/color |
| `<AmountText>` | Quantities (contracts, shares) |
| `<AddressText>` | Wallet addresses, tx hashes (with truncation) |
| `<MonoText>` | Generic mono-font wrapper |
| `<LabelText>` | Sans-font text with size/weight/muted props |

### Weight Hierarchy

| Weight | Class | Usage |
|--------|-------|-------|
| 400 | `font-normal` | Body text, descriptions |
| 500 | `font-medium` | Labels, option names, nav items |
| 600 | `font-semibold` | Section headers, card titles |
| 700 | `font-bold` | Hero numbers, page titles |

### Size Scale

| Size | Class | Usage |
|------|-------|-------|
| 10px | `text-[10px]` | Captions, raw values, micro-labels |
| 12px | `text-xs` | Data row labels/values, badges |
| 14px | `text-sm` | Section headers, body text |
| 16px | `text-base` | Primary content |
| 18px–24px | `text-lg`–`text-2xl` | Card titles, page titles |
| 30px–36px | `text-3xl`–`text-4xl` | Hero numbers |

### Casing Rules

| Element | Casing | Example |
|---------|--------|---------|
| Section / component headers | Title Case | "On-Chain Liquidation Snapshot" |
| Page titles | Title Case | "Trade Verification" |
| On-chain contract fields | camelCase | `positionSide`, `markPrice`, `uid` |
| Blockchain metadata | camelCase | `txHash`, `blockNumber`, `contract` |
| Platform analysis fields | camelCase | `oracleSource`, `priceDeviation` |
| Button text | Title Case | "Place Order", "View Details" |
| Descriptions / body text | Sentence case | "This trade was verified on-chain." |
| Hero labels (above big numbers) | UPPERCASE + `tracking-widest` | "TOTAL VOLUME" |

> **Rule**: Never mix Title Case and camelCase within the same data-row list.

---

## 4. Spacing & Layout

### Card Padding

| Context | Padding |
|---------|---------|
| Standard card content | `p-4` (16px) |
| Compact card / mobile | `p-3` (12px) |
| Spacious / hero sections | `p-5` or `p-6` |

### Data Row Layout

```
flex items-center justify-between py-1.5 px-2 rounded bg-muted/20 text-xs
```

- Gap between rows: `gap-1.5` or `space-y-1.5`
- Label: `text-muted-foreground font-mono` (for on-chain fields)
- Value: `font-mono text-foreground/80`

### Section Spacing

| Between | Gap |
|---------|-----|
| Major sections | `space-y-8` |
| Sub-sections within a card | `space-y-4` |
| Related items | `space-y-2` or `gap-2` |

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| Mobile | < 768px | Single column, bottom nav |
| Desktop | ≥ 768px (`md:`) | Multi-column, side panels, top header |

### Desktop Page Layout 规范

所有桌面端列表页面（Events、Resolved、Portfolio 等）必须遵循统一的页面结构：

1. **共享导航栏**：`<EventsDesktopHeader />` 顶部导航
2. **`<main>` 容器**：`px-8 py-10 max-w-7xl mx-auto space-y-6`
3. **标题区**：
   - 外层 `<div className="relative">`
   - 左侧紫色竖线：`absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent`
   - 标题：`text-3xl font-bold text-foreground`（移动端 `text-2xl`）
   - 副标题：`text-muted-foreground text-sm mt-1.5`
4. **筛选/Tabs 区**：标题下方，`space-y-6` 间距
5. **内容区**：列表或网格

```tsx
// 标准桌面端页面结构模板
<main className="px-8 py-10 max-w-7xl mx-auto space-y-6">
  <div className="relative">
    <div className="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent" />
    <h1 className="text-3xl font-bold text-foreground">Page Title</h1>
    <p className="text-muted-foreground text-sm mt-1.5">Subtitle</p>
  </div>
  {/* Filters / Tabs */}
  {/* Content */}
</main>
```

**❌ 不允许**：桌面端跳过标题区直接渲染 Tabs/内容；使用非标准 `max-w` 或 `py` 值。

---

## 5. Component Patterns

### Cards

- **`.trading-card`**: Default card with gradient background + border
- **`.stats-card`**: Stats display card, lighter border
- **`.web3-card`**: Premium card with animated gradient border + glow

### Buttons

- **`.btn-primary`**: Purple gradient, white text, glow shadow
- **`.btn-trading-green`**: Green gradient, white text — Buy/Long
- **`.btn-trading-red`**: Red gradient, white text — Sell/Short
- All trading buttons: **always white text** (`text-primary-foreground`)

### Status Badges

- **`.status-active`**: Green bg/text/border at 15%/30% opacity
- **`.status-locked`**: Red
- **`.status-pending`**: Yellow

### Filter Pills

- **`.filter-pill`**: Inactive state
- **`.filter-pill-active`**: Primary bg + white text

### Option Chips

- **`.option-chip-active`**: Primary border + subtle primary bg
- **`.option-chip-inactive`**: Muted bg, transparent border

---

## 6. Address & Hash Truncation

**Unified standard: First 6 + Last 6** — applies to ALL contexts (addresses, tx hashes, UIDs, oracle proofs, contract addresses).

| Input | Displayed |
|-------|-----------|
| `0x1234567890abcdef1234567890abcdef12345678` | `0x1234...345678` |
| `0xabc123def456...` (any hash) | `0xabc1...ef4567` |

- Always `font-mono`
- Use `<AddressText address={hash} truncate />` component (default `truncateLength=6`)
- On mobile: add `max-w-[200px] truncate` if needed
- **Do NOT** use other truncation lengths (8+5, 10+6, 14+10, 6+4) — they have been eliminated

### Security: Color-Coded Address Display

For full deposit address displays (e.g., `FullAddressSheet`), apply color differentiation:
- **Digits (0–9)**: `text-primary` (purple)
- **Letters (a–f)**: `text-foreground` (white)

This prevents character confusion (e.g., `6` vs `b`, `0` vs `O`).

---

## 7. Trading Patterns

### Trading Color Semantics

| Color | Token | Meaning |
|-------|-------|---------|
| Green | `text-trading-green` | Profit, Buy/Long, Success |
| Red | `text-trading-red` | Loss, Sell/Short, Error |
| Yellow | `text-trading-yellow` | Warning, Pending |
| Purple | `text-trading-purple` | Brand emphasis, Active state |

### Account Risk Indicator (4-Tier)

Formula: `Risk Ratio = Initial Margin / Equity × 100` where `Equity = Balance + Unrealized PnL`

| Tier | Range | Color | Behavior |
|------|-------|-------|----------|
| SAFE | < 80% | `trading-green` | Normal trading |
| WARNING | 80–95% | `trading-yellow` | Reduce positions suggested |
| RESTRICTION | 95–100% | `trading-red` | Close-only mode |
| LIQUIDATION | ≥ 100% | `trading-red` + `animate-pulse` | Forced liquidation |

### Order Status Badges

| Status | Colors |
|--------|--------|
| Pending | `bg-amber-500/20 text-amber-400` |
| Partial Filled | `bg-cyan-500/20 text-cyan-400` |
| Filled | `bg-trading-green/20 text-trading-green` |
| Cancelled | `bg-trading-red/20 text-trading-red` |

### Option Chips

Use `<OptionChips>` component for event option selection:
- Active: `option-chip-active` (primary border + bg)
- Inactive: `option-chip-inactive` (muted bg, transparent border)
- Always show price in `font-mono` next to label

### Event Category Badges

Use `CATEGORY_STYLES` from `@/lib/categoryUtils` — never hardcode category colors:
```tsx
import { CATEGORY_STYLES, getCategoryFromName } from "@/lib/categoryUtils";
```

---

## 8. Wallet & Transaction Patterns

### Transaction Status Config

| Status | Icon | Color | Animation |
|--------|------|-------|-----------|
| pending | `Clock` | `text-trading-yellow` | — |
| processing | `Loader2` | `text-trading-yellow` | `animate-spin` |
| completed | `CheckCircle2` | `text-trading-green` | — |
| failed | `XCircle` | `text-trading-red` | — |
| cancelled | `AlertCircle` | `text-muted-foreground` | — |

### Transaction Card Layout

```
flex items-center justify-between p-3 bg-card rounded-lg border border-border/50
```

- Left: Icon (colored circle) + amount + description
- Right: Status badge

### Vertical Stepper

Used in withdrawal flow and deposit tracking:
- Completed steps: `bg-trading-green border-trading-green` with `CheckCircle2` icon
- Current step: `bg-trading-yellow/20 border-trading-yellow` with spinning `Loader2`
- Pending steps: `bg-muted border-border` with step number
- Connector line: `w-0.5 h-8` — green if previous step completed, `bg-border` otherwise

### Block Confirmations

- In-progress: Yellow-themed card with `animate-pulse` progress bar
- Completed: Green-themed card with full progress bar
- Format: `{current}/{required}` in `font-mono`

### Explorer Link Pattern

- Always `font-mono` for hashes
- Truncate: `hash.slice(0, 8)...hash.slice(-5)` (Wallet convention, differs from transparency 10+6)
- Include `<ExternalLink className="h-3 w-3" />` icon
- Use `text-primary hover:underline`

---

## 9. Deposit & Withdraw Patterns

### Chain & Token Logos

- Always use official SVGs from `/chain-logos/` and `/token-logos/`
- Standard size: `w-5 h-5` (inline), `w-8 h-8` (selector)
- **Never** use emoji, text, or generic icons for chains/tokens

### Deposit/Withdraw Typography

| Element | Spec |
|---------|------|
| Section title | `text-base font-semibold` (16px) |
| Card label (From / To) | `text-sm text-muted-foreground` (14px) |
| Amount input | `text-2xl font-mono` (24px) |
| Token selector text | `text-sm font-medium` (14px) |
| Chain name in selector | `text-xs text-muted-foreground` (12px) |
| Quote detail label | `text-xs text-muted-foreground` (12px) |
| Quote detail value | `text-xs font-mono` (12px) |
| Balance display | `text-xs font-mono` |
| Result amount | `text-3xl font-mono font-bold` |
| CTA button | `text-sm font-semibold` (14px) |
| Powered by footer | `text-[10px] text-muted-foreground` |

### Swap Card Layout

- **From card**: `rounded-xl border border-border/50 bg-muted/20 p-4`
- **Arrow divider**: `w-9 h-9 rounded-lg bg-card border border-border/50` with `ArrowDown` icon, centered `-my-2 relative z-10`
- **To card**: `rounded-xl border border-primary/30 bg-primary/5 p-4`

### Quote Detail Rows

```
flex justify-between text-xs text-muted-foreground
```
- Values: `font-mono`
- Free/zero fees: `text-trading-green`

### Powered By Footer

```html
<p className="text-[10px] text-center text-muted-foreground">
  Powered by <span className="font-semibold">SOCKET</span>
</p>
```

---

## 10. Mobile Patterns

### Logo Usage

| Context | Size | Notes |
|---------|------|-------|
| MobileHome, EventsPage headers | `md` (h-5) | Left-aligned, no back button |
| Trade pages | — | Logo hidden, back button only |
| Detail pages with back button | `md` | Back + Logo together |
| Desktop navigation | `lg` (h-6) | Left side of top nav |
| Marketing / landing pages | `xl` (h-8) | Hero sections, footers |

Logo rules:
- Always use `<Logo>` component from `@/components/Logo`
- On light backgrounds: use `className="invert"` or wrap in dark container
- Never stretch, add effects, or use raw SVG import

### Page Type Classification

| Type | Back Button | Logo | Examples |
|------|------------|------|----------|
| Functional | Never | Yes | `/`, `/events`, `/leaderboard`, `/portfolio` |
| Operational (Logo) | Yes | Yes | `/trade/:id`, `/resolved/:id` |
| Operational (No Logo) | Yes | No | `/deposit`, `/withdraw`, `/settings` |

### Mobile Header `rightContent` 规范

**关键规则：EventsPage 与 ResolvedPage 的移动端 Header 右上角必须使用 `MobileStatusDropdown` 组件**，允许用户通过下拉菜单在 "Active" 和 "Resolved" 之间切换页面。**严禁**替换为普通按钮、图标链接或其他自定义 UI。

| Page | rightContent | Component | Behavior |
|------|-------------|-----------|----------|
| EventsPage (`/events`) | Status dropdown | `<MobileStatusDropdown statusFilter="active" />` | 选择 "Resolved" → `navigate("/resolved")` |
| ResolvedPage (`/resolved`) | Status dropdown | `<MobileStatusDropdown statusFilter="resolved" />` | 选择 "Active" → `navigate("/events")` |

- 组件来源：`import { MobileStatusDropdown } from "@/components/EventFilters"`
- 两个页面的行为必须**镜像对称**，保持一致体验
- 修改这两个页面的 Header 时，必须先确认此规范

### Mobile Bottom Nav

- Safe area: `--safe-area-bottom: 5rem`
- Content padding: `pb-safe` to avoid bottom nav overlap

---

## 11. User Identity

### Username Generation

- Library: `sillyname`
- Format: `sillyname().replace(/ /g, '_')` → e.g., "Fluffy_Bunny"

### Default Avatars

- Provider: DiceBear `adventurer-neutral` style
- API: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed={seed}&backgroundColor={bg}`
- Use `generateAvatarUrl()` and `getRandomAvatarUrl()` from `@/hooks/useUserProfile`

---

## 12. Forms & Tables

### Form Validation

- Schema: Zod (`z.object(...)`)
- Integration: `react-hook-form` with `zodResolver`
- Error display: `<FormMessage />` component

### Table Patterns

- Use `<Table>` components from `@/components/ui/table`
- Numeric columns: `font-mono`
- PnL values: Color by sign (`text-trading-green` / `text-trading-red`)
- Status cells: Use trading status badges
- Selection: `<Checkbox>` with `data-state="selected"` row styling

---

## 13. Animations

| Animation | Class | Duration | Usage |
|-----------|-------|----------|-------|
| Fade in | `animate-fade-in` | 0.3s | Content appearing |
| Slide up | `animate-slide-up` | 0.4s | Cards entering |
| Scale in | `animate-scale-in` | 0.2s | Modals, popovers |
| Pulse soft | `animate-pulse-soft` | 2s loop | Live indicators |
| Enter | `animate-enter` | 0.3s | Combined scale + translate |

### Order Book Flashes

- Price increase: `flash-update-green` (0.5s)
- Price decrease: `flash-update-red` (0.5s)
- New trade: `flash-new-trade` (0.8s)

### Web3 Card Glow

- `.web3-card`: Animated gradient border + radial glow
- `.web3-card-intense`: Higher opacity/intensity variant
- Animations: `gradient-rotate` (4s) + `glow-pulse` (3s)

---

## 14. Do / Don't

### ✅ Do

- Use semantic Tailwind tokens (`bg-card`, `text-muted-foreground`, `text-trading-green`)
- Use Typography components for all numerical displays
- Apply `font-mono` to every number, hash, and address
- Use `camelCase` for all data field labels in transparency/audit pages
- Use `Title Case` for section headers and page titles
- Keep all buttons' text white on colored backgrounds
- Use `trading-card` class for card containers
- Use official chain/token SVG logos from `/chain-logos/` and `/token-logos/`
- Use `<Logo>` component — never raw SVG imports
- Use `CATEGORY_STYLES` for event category badges
- Use `STATUS_CONFIG` pattern for transaction status badges

### ❌ Don't

- Use raw colors (`bg-gray-900`, `text-white`, `#7c3aed`)
- Mix `Title Case` and `camelCase` within the same data-row list
- Use `font-sans` for prices, amounts, or percentages
- Use `font-mono` for descriptive text or labels (except on-chain field names)
- Create custom color classes — add to `index.css` tokens instead
- Use light mode colors — the app is dark-only
- Hardcode pixel values for spacing — use Tailwind scale
- Use emoji or generic icons for chain/token logos
- Stretch, add effects to, or modify the OMENX logo
- Place white logo on light backgrounds without `invert`

---

## 15. 移动端卡片一致性规范（Mobile Card Consistency）

Active（`MarketCard`）和 Resolved（`ResolvedEventCard`）移动端卡片 **必须** 共享以下设计 token，禁止使用 `<Card>` 组件的默认样式：

| Token | Value | Notes |
|-------|-------|-------|
| 外壳 | raw `<div>` + `rounded-xl border border-border/40 p-4` | 不使用 `<Card>`/`<CardHeader>`/`<CardContent>` |
| 背景 | `linear-gradient(165deg, hsl(222 35% 11%) 0%, hsl(225 40% 7%) 100%)` | inline style |
| 标题 | `text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-3` | 不用 `text-[15px]` |
| 顶行 | 左侧 badges（Category + 状态），右侧时间信息 | `mb-2` |
| hover | `hover:border-primary/40`，无 glow | 移动端不需要发光效果 |
| 底部分隔 | `mt-2 pt-2 border-t border-border/20` | Volume 等附加信息 |

**禁止**：在移动端卡片中使用 `<Card>` 组件（其默认 `p-6` 和 `rounded-lg` 会破坏一致性）。

---

## 16. 移动端列表页规范（Mobile List Page Pattern）

### 页面头部

所有移动端列表页面 **必须** 包含以下头部结构：

```
┌─────────────────────────────────────┐
│ Title (text-2xl font-bold)    [Filter]│
│ Subtitle (text-sm text-muted)       │
├─────────────────────────────────────┤
│ [Tabs（如有）]                       │
└─────────────────────────────────────┘
```

| 元素 | 规范 | 备注 |
|------|------|------|
| 标题 | `text-2xl font-bold text-foreground` | 如 "Active Events"、"Resolved Events" |
| 副标题 | `text-muted-foreground text-sm mt-1.5` | 简短描述页面用途 |
| 筛选按钮 | 与标题同行右对齐，`h-9 w-9 rounded-full bg-muted/50` + `<Filter />` 图标 | 点击弹出 `MobileDrawer` |
| Tabs | 在标题下方独立一行显示（如有） | 不与筛选按钮同行 |

### 页面实现对照

| Page | 标题 | 副标题 | Tabs | Filter Drawer |
|------|------|--------|------|---------------|
| EventsPage (`/events`) | Active Events | Browse and trade live prediction markets | `EventTabs` | `MobileActiveFilterDrawer` |
| ResolvedPage (`/resolved`) | Resolved Events | View results from all completed prediction events | 无 | `MobileResolvedFilterDrawer` |

### 筛选 Drawer 规范

所有移动端列表页面的筛选 **必须** 收进 Drawer，不允许在页面内平铺筛选控件。

| 元素 | 规范 | 备注 |
|------|------|------|
| 活跃筛选计数 | 筛选按钮右上角圆形 badge 显示活跃筛选数量 | `bg-primary text-primary-foreground` |
| Drawer 内部 | 各筛选项使用 label + 控件垂直排列，底部 Reset + Apply 按钮 | `space-y-6` |

**禁止**：
- 在移动端页面平铺 `<Select>`、`<Input>` 等筛选控件
- 列表页头部缺少标题或副标题
- 筛选按钮使用非 Drawer 的交互方式

---

## 16. File References

| File | Contains |
|------|----------|
| `src/index.css` | All CSS custom properties, component classes, animations |
| `tailwind.config.ts` | Token → Tailwind class mappings, keyframes |
| `src/components/typography/` | PriceText, PercentText, AmountText, AddressText, MonoText, LabelText |
| `src/lib/categoryUtils.ts` | Event category styles and badge mappings |
| `src/components/Logo.tsx` | Logo component with size variants |
| `src/hooks/useUserProfile.ts` | Avatar generation utilities |
| `/style-guide` | Interactive playground for all design tokens |

---

## 17. Content Rules

- **No icons on events or markets**: Events and markets (options) do not have icons or emoji. Never render `eventIcon` or any icon/emoji next to event or market names in any view (list, grid, card, shelf).
- **Icons must use Lucide**: All UI icons must use Lucide React SVG icons (`lucide-react`). Never use emoji (🔥✨⏰ etc.) as icons anywhere in the interface.
- **Terminology**: "Event" is the parent prediction question; "Market" is an individual option/outcome within an event.
- **Watchlist / Favorite icon**: Always use `Star` from `lucide-react`. Active state: `fill-trading-yellow text-trading-yellow`. Inactive: `text-muted-foreground`. Never use `Heart` for watchlist/favorite functionality.

---

## 18. Category Card Backgrounds

Each event category can display a themed background image on its market card (`MarketCardB`).

### File Locations

| Category | File | Badge Variant |
|----------|------|---------------|
| Social | `/card-bg/social.jpg` | `social` |
| Crypto | `/card-bg/crypto.jpg` | `crypto` |
| Finance | `/card-bg/finance.jpg` | `finance` |
| Politics | `/card-bg/politics.jpg` | `politics` |
| Tech | `/card-bg/tech.jpg` | `tech` |
| Entertainment | `/card-bg/entertainment.jpg` | `entertainment` |
| Sports | `/card-bg/sports.jpg` | `sports` |
| Market / General | _(none)_ | `general` |

### Visual Specs

- **Image opacity**: `opacity-[0.15]` — subtle texture, never overpowers text
- **Gradient overlay**: `bg-gradient-to-r from-[hsl(225_40%_7%)] via-[hsl(225_40%_7%/0.65)] to-transparent` — darkens the left (text) side
- **Positioning**: `absolute inset-0`, `object-cover`, behind content (`z-0`)
- **Loading**: `loading="lazy"` — off-screen cards don't block initial paint

### Image Requirements

- **Max width**: 600px (cards render at ~400px max)
- **Format**: JPEG, quality ≤ 60%
- **Target size**: ≤ 50 KB per image
- **Rationale**: Images display at 15% opacity; high resolution is imperceptible

### Configuration

Category-to-background mapping is defined in `src/lib/categoryUtils.ts` via the `cardBg` property in `CATEGORY_STYLES`.
