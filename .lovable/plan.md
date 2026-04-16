

# Style B Outcome 区域加 CHG 时间标签

## 改动

在 outcome 容器（`bg-white/[0.03]` 那个区域）内部顶部加一行小标签，右对齐显示当前时间维度（如 `24H CHG`），使用 `text-[9px] font-mono text-muted-foreground/60`。

具体结构变为：

```text
┌─ outcome 容器 ──────────────────┐
│                      24H CHG   │  ← 新增小标签行
│  Bitcoin > $120K   ▲ +1.25%    │
│  Ethereum > $5K    ▼ -0.80%    │
│  Solana > $300     ▲ +2.10%    │
└─────────────────────────────────┘
```

- 多 outcome（children > 0）和单 outcome 容器都加这个标签
- 标签文字来自已有的 `TF_LABELS` 映射
- 容器内部用 flex justify-end 放标签，不增加额外高度（用 `-mb-0.5` 或 `text-[9px] leading-none`）

## 改动范围

仅 `src/components/events/MarketCardB.tsx`，约 4 行新增

