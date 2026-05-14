## 问题

`MarketCardB`（events 卡片）的 outcome 表格根据 `children` 数量渲染 1–3 行，导致 desktop 多列网格中卡片高度参差不齐。Mobile 是单列竖排，高度不一致没有视觉影响，所以无需处理。

## 方案：用占位行补齐到 3 行（仅 desktop）

在 `src/components/events/MarketCardB.tsx` 的 outcome 表格里，渲染完真实的 `children.slice(0, 3)` 后，再补齐 `3 - shown` 个**占位行**，使表格在 desktop 上始终占 3 行高度。

- 占位行使用 `hidden md:flex`，仅在 desktop 生效；mobile 仍按真实行数渲染，不浪费纵向空间。
- 占位行内容用 `invisible` 的同尺寸字符（如 `&nbsp;`），保证行高与真实行完全一致（`text-[11px]` 行 + `font-mono` 数值），不引入新尺寸假设。
- 保持现有 padding、间距、`space-y-0.5`、`24H Chg` 表头、底部 `Vol / +N more markets` 不变。

```text
desktop（3 列对齐）
┌── card ─────────────┐ ┌── card ─────────────┐
│ ★ Politics  Dec 31  │ │ ★ Sports     Jul 20 │
│ Title…              │ │ Title…              │
│ ┌ outcomes (3 rows)┐│ │ ┌ outcomes (3 rows)┐│
│ │ Yes      +1.20%  ││ │ │ England   -0.52% ││
│ │ No       -0.40%  ││ │ │ Spain     +0.00% ││
│ │ ░░ placeholder ░░ ││ │ │ France    +0.00% ││ ← 真实第三行
│ └──────────────────┘│ │ └──────────────────┘│
│ Vol: $2.2M          │ │ Vol: $1.7M          │
└─────────────────────┘ └─────────────────────┘
```

## 范围

- **只改** `src/components/events/MarketCardB.tsx` 的 children > 0 分支
- 不动 children === 0 的"单一百分比"分支（用户没提到，且形态不同；如需要后续单独讨论）
- 不动 mobile 行为、不动数据/排序/路由/筛选逻辑
- 不引入新文件、不改 design tokens

## 技术细节

```tsx
{market.children.slice(0, 3).map((child) => (
  /* …existing real row… */
))}
{Array.from({ length: Math.max(0, 3 - Math.min(market.children.length, 3)) }).map((_, i) => (
  <div key={`ph-${i}`} className="hidden md:flex items-center justify-between" aria-hidden>
    <span className="text-[11px] invisible">&nbsp;</span>
    <span className="text-[11px] font-mono font-semibold tabular-nums invisible">+0.00%</span>
  </div>
))}
```

这样 desktop 上 1/2/3 行的卡片底部对齐一致，mobile 不变。