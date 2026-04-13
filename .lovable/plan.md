

# Plan: Create DESIGN.md for OmenX Project

## Problem
Design consistency has been degrading — inconsistent casing, typography, spacing, and color usage across pages. The Style Guide exists but isn't being systematically referenced. A `DESIGN.md` file at the project root would serve as a persistent, authoritative design spec that gets referenced every time UI changes are made.

## What is DESIGN.md
A plain-text markdown file at the project root that codifies the design system — colors, typography, spacing, component patterns, and rules. Inspired by the [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) concept from Google Stitch.

## What the DESIGN.md will contain

Based on your existing `index.css` tokens, `tailwind.config.ts`, and Style Guide sections, the file will codify:

1. **Brand Identity** — OmenX as a dark-first crypto prediction market platform, purple primary accent
2. **Color Tokens** — All CSS custom properties mapped to their semantic usage (surfaces, trading green/red, scenario accents for transparency pages, etc.)
3. **Typography Rules**
   - Font stack: Inter (sans) + JetBrains Mono (mono)
   - Weight hierarchy: 400 body, 500 medium labels, 600 semibold headers, 700 bold hero numbers
   - Size scale with specific use cases
   - **Casing rules**: camelCase for on-chain fields, Title Case for section headers only, sentence case for descriptions
4. **Spacing & Layout** — Card padding, gap conventions, mobile vs desktop breakpoints
5. **Component Patterns** — trading-card class, data row layout (flex justify-between), badge styles, button variants
6. **Scenario Accent Colors** — Merkle/emerald, Trade/blue, Liquidation/amber, Funding/purple
7. **Address/Hash Truncation** — first 10 + last 6, always font-mono
8. **Do / Don't Rules** — Explicit anti-patterns to avoid (e.g., "Never mix Title Case and camelCase in data rows")

## Files Changed

| File | Action |
|------|--------|
| `DESIGN.md` | **Create** — Project-root design system document (~200 lines) |

No code changes — this is a reference document only. Once created, it will be consulted before any future UI work.

## Why this helps
- Single source of truth that persists across conversations
- Prevents the drift you've been seeing (mixed casing, inconsistent typography)
- Complements the interactive Style Guide with a machine-readable spec

