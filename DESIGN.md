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

- Show first **10** + `...` + last **6** characters
- Example: `0x3b4e780d12...c6b3bf`
- Always `font-mono`
- Use `<AddressText address={hash} truncate />` component
- On mobile: add `max-w-[200px] truncate` if needed

---

## 7. Animations

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

---

## 8. Do / Don't

### ✅ Do

- Use semantic Tailwind tokens (`bg-card`, `text-muted-foreground`, `text-trading-green`)
- Use Typography components for all numerical displays
- Apply `font-mono` to every number, hash, and address
- Use `camelCase` for all data field labels in transparency/audit pages
- Use `Title Case` for section headers and page titles
- Keep all buttons' text white on colored backgrounds
- Use `trading-card` class for card containers

### ❌ Don't

- Use raw colors (`bg-gray-900`, `text-white`, `#7c3aed`)
- Mix `Title Case` and `camelCase` within the same data-row list
- Use `font-sans` for prices, amounts, or percentages
- Use `font-mono` for descriptive text or labels (except on-chain field names)
- Create custom color classes — add to `index.css` tokens instead
- Use light mode colors — the app is dark-only
- Hardcode pixel values for spacing — use Tailwind scale

---

## 9. File References

| File | Contains |
|------|----------|
| `src/index.css` | All CSS custom properties, component classes, animations |
| `tailwind.config.ts` | Token → Tailwind class mappings, keyframes |
| `src/components/typography/` | PriceText, PercentText, AmountText, AddressText, MonoText, LabelText |
| `/style-guide` | Interactive playground for all design tokens |
