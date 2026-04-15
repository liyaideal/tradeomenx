

# Outcome 缩略表方案

## 布局

用 `market.children` 数组的前 3 个子 market，在标题下方展示迷你列表，每行显示 outcome label + CHG（不要价格）。替换掉现有的单个 top market + CHG 行。

```text
┌─────────────────────────────────────┐
│ ★ [Crypto]  NEW                     │
│ Bitcoin Price End of Q3             │
│                                     │
│  Above $100K              ▲ +3.52% │
│  $80K-$100K               ▼ -1.20% │
│  Below $80K               ▲ +0.80% │
│                       +3 more →    │
│ ─────────────────────────────────── │
│ 24H VOL $1.2M    TOTAL VOL $12.5M │
└─────────────────────────────────────┘
```

## 要点

- 从 `market.children` 取前 3 个（按 volume 排序），每行用 `flex justify-between`：左边 label（truncate），右边 CHG 值（带颜色 + 箭头）
- 超过 3 个子 market 时，底部显示 `+N more →`（text-primary，可点击感）
- 单 market 事件（`children.length === 0`）：只显示 event 级别 CHG，无列表
- CHG 值根据 `chgTimeframe` 动态切换（复用 `getChange` helper）
- 移除现有的 "▾ 6 markets" 指示行和单独的 top market + CHG 行，用缩略表替代
- 底部 Vol 行保留，移除 "View Markets →" CTA（整卡可点击已足够）

## 改动文件

1. **MarketCard.tsx** — 替换第 74-97 行（multi-market indicator + top market CHG）为 outcome 缩略表
2. **MarketCardB.tsx** — 同样替换第 97-111 行

每文件改动约 20 行，无新组件。

